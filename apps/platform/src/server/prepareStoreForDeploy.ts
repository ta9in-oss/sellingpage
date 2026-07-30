import { createServerFn } from '@tanstack/react-start'
import { init, id as newId } from '@instantdb/admin'
import { encryptSecret } from '../lib/secretBox'
import { event, createError } from '../lib/logger'

interface Params {
  storeId: string
  userEmail: string
}

/**
 * Makes a store deployable using the merchant's *account-level* credentials, so
 * publishing never re-asks for Cloudflare/InstantDB per store.
 *
 * - Cloudflare: if the store has no token, copy the account's (the ciphertext is
 *   already sealed with STORE_SECRET_KEY, so it moves as-is). If neither the
 *   store nor the account has one, throw — the caller sends the merchant to
 *   Settings to connect Cloudflare.
 * - InstantDB: if the store has no app yet, auto-provision one with the platform
 *   token and store the admin token encrypted. The merchant never has to touch it.
 *
 * Returns { ready: true } once the store row has everything the daemon needs.
 */
export const prepareStoreForDeploy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as Params)
  .handler(async ({ data: { storeId, userEmail } }) => {
    const log = event({ storeId })
    try {
      const key = process.env.STORE_SECRET_KEY
      if (!key) throw createError({ message: 'STORE_SECRET_KEY غير مضبوط على الخادم', status: 500, why: 'server missing STORE_SECRET_KEY' })

      const db = init({
        appId: process.env.VITE_INSTANT_APP_ID!,
        adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
      })

      const [{ stores }, { platformUsers }] = await Promise.all([
        db.query({ stores: { $: { where: { id: storeId } } } }),
        db.query({ platformUsers: { $: { where: { email: userEmail } } } }),
      ])
      const store = stores?.[0] as any
      const account = platformUsers?.[0] as any
      if (!store) throw createError({ message: 'المتجر غير موجود', status: 404 })

      const patch: Record<string, string> = {}

      // Cloudflare — prefer store creds, fall back to the account's.
      const hasStoreCf = !!store.cfApiToken && !!store.cfAccountId
      let cfSource = 'store'
      if (!hasStoreCf) {
        if (account?.cfApiToken && account?.cfAccountId) {
          patch.cfAccountId = account.cfAccountId
          patch.cfApiToken = account.cfApiToken // ciphertext, same STORE_SECRET_KEY
          cfSource = 'account'
        } else {
          // Message keeps the token the deploy wizard branches on.
          throw createError({ message: 'CLOUDFLARE_NOT_CONFIGURED', status: 428, why: 'no Cloudflare token on store or account', fix: 'Connect Cloudflare in Settings' })
        }
      }

      // InstantDB — auto-provision once if the store has none.
      const hasStoreInstant = !!store.instantAppId && !!store.instantAdminToken
      let instantSource = 'store'
      if (!hasStoreInstant) {
        if (account?.instantAppId && account?.instantAdminToken) {
          patch.instantAppId = account.instantAppId
          patch.instantAdminToken = account.instantAdminToken
          instantSource = 'account'
        } else {
          const token = process.env.INSTANTDB_PLATFORM_PERSONAL_TOKEN
          if (!token) throw createError({ message: 'INSTANTDB_NOT_CONFIGURED', status: 428, why: 'no InstantDB app and no platform token to provision one' })
          const appId = newId()
          const adminToken = newId()
          const slug = (store.slug as string) || storeId
          const res = await fetch('https://api.instantdb.com/dash/apps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ id: appId, title: `7aba-store-${slug}`, admin_token: adminToken }),
          })
          if (!res.ok) throw createError({ message: 'InstantDB provisioning failed', status: 502, why: (await res.text()).slice(0, 200) })
          patch.instantAppId = appId
          patch.instantAdminToken = await encryptSecret(adminToken, key)
          instantSource = 'provisioned'
        }
      }

      if (Object.keys(patch).length > 0) {
        await db.transact([db.tx.stores[storeId].update(patch)])
      }
      log.set({ prepare: { storeId, cfSource, instantSource, outcome: 'ready' } })
      log.emit()
      return { ready: true }
    } catch (err) {
      log.error(err as Error)
      log.emit()
      throw err
    }
  })
