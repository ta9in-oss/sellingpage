import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'
import { encryptSecret } from '../lib/secretBox'
import { event, createError } from '../lib/logger'

interface Params {
  storeId?: string
  /** When set, the same Cloudflare credentials are also saved account-level. */
  platformUserId?: string
  cfAccountId?: string
  cfApiToken?: string
  instantAppId?: string
  instantAdminToken?: string
  /** Chargily secret key (sealed). Per-store: it is the merchant's own account. */
  chargilyApiKey?: string
  /** Chargily publishable key — public, inlined into the storefront bundle. */
  chargilyPublicKey?: string
}

/**
 * Writes a merchant's credentials to InstantDB with the secret fields encrypted.
 *
 * The browser used to transact these straight into the `stores` row, which put
 * a Cloudflare token that can edit the merchant's Pages projects into plaintext
 * in the database — and made it readable back by any client that could query
 * the row. The write now happens here so the encryption key (STORE_SECRET_KEY)
 * stays in the worker, and the ciphertext is all the client can ever observe.
 *
 * Non-secret fields (account id, app id) stay in the clear: CI needs them, they
 * are not credentials on their own, and keeping them readable lets the wizard
 * show "connected" without a decrypt round-trip.
 */
export const saveMerchantSecrets = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as Params)
  .handler(async ({ data }) => {
    const {
      storeId, platformUserId, cfAccountId, cfApiToken, instantAppId, instantAdminToken,
      chargilyApiKey, chargilyPublicKey,
    } = data
    const log = event()
    const targetType = platformUserId ? 'account' : 'store'
    const targetId = platformUserId || storeId || 'unknown'

    try {
      if (!storeId && !platformUserId) throw createError({ message: 'storeId أو platformUserId مطلوب', status: 400 })

      const key = process.env.STORE_SECRET_KEY
      if (!key) throw createError({ message: 'STORE_SECRET_KEY غير مضبوط على الخادم', status: 500, why: 'server missing STORE_SECRET_KEY' })

      const db = init({
        appId: process.env.VITE_INSTANT_APP_ID!,
        adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
      })

      // Only touch fields the caller actually supplied — this function is used by
      // both the deploy wizard (all four) and the settings screens (a subset).
      const patch: Record<string, string> = {}
      if (cfAccountId) patch.cfAccountId = cfAccountId.trim()
      if (instantAppId) patch.instantAppId = instantAppId.trim()
      if (cfApiToken) patch.cfApiToken = await encryptSecret(cfApiToken.trim(), key)
      if (instantAdminToken) patch.instantAdminToken = await encryptSecret(instantAdminToken.trim(), key)

      // Chargily is store-scoped and never account-scoped: each storefront takes
      // payments into its own merchant account, so an account-level key would
      // silently route every store's revenue to one Chargily account.
      const storeOnly: Record<string, string> = {}
      if (chargilyPublicKey !== undefined) storeOnly.chargilyPublicKey = chargilyPublicKey.trim()
      if (chargilyApiKey) storeOnly.chargilyApiKey = await encryptSecret(chargilyApiKey.trim(), key)

      if (Object.keys(storeOnly).length > 0 && !storeId) {
        throw createError({ message: 'مفاتيح Chargily تُحفظ على مستوى المتجر فقط', status: 400, why: 'chargily keys require storeId' })
      }

      const touched = [...Object.keys(patch), ...Object.keys(storeOnly)]
      if (touched.length === 0) return { success: true }

      const txs: any[] = []
      if (storeId) txs.push(db.tx.stores[storeId].update({ ...patch, ...storeOnly }))
      if (platformUserId) txs.push((db.tx.platformUsers as any)[platformUserId].update(patch))

      await db.transact(txs)

      // Which secrets were touched — field names only, never values.
      log.set({ secrets: { fields: touched, scope: targetType } })
      log.audit({
        action: 'merchant.secrets.save',
        actor: { type: 'user', id: targetId },
        target: { type: targetType, id: targetId },
        outcome: 'success',
      })
      log.emit()
      return { success: true }
    } catch (err) {
      log.error(err as Error)
      log.audit({ action: 'merchant.secrets.save', actor: { type: 'user', id: targetId }, target: { type: targetType, id: targetId }, outcome: 'failure' })
      log.emit()
      throw err
    }
  })
