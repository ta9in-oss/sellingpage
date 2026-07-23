import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'
import { encryptSecret } from '../lib/secretBox'

interface Params {
  storeId?: string
  /** When set, the same Cloudflare credentials are also saved account-level. */
  platformUserId?: string
  cfAccountId?: string
  cfApiToken?: string
  instantAppId?: string
  instantAdminToken?: string
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
    const { storeId, platformUserId, cfAccountId, cfApiToken, instantAppId, instantAdminToken } = data

    if (!storeId && !platformUserId) throw new Error('storeId أو platformUserId مطلوب')

    const key = process.env.STORE_SECRET_KEY
    if (!key) throw new Error('STORE_SECRET_KEY غير مضبوط على الخادم')

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

    if (Object.keys(patch).length === 0) return { success: true }

    const txs: any[] = []
    if (storeId) txs.push(db.tx.stores[storeId].update(patch))
    if (platformUserId) txs.push((db.tx.platformUsers as any)[platformUserId].update(patch))

    await db.transact(txs)
    return { success: true }
  })
