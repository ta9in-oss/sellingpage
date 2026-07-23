import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'
import { decryptSecret } from '../lib/secretBox'

interface Params {
  /** The store whose merchant InstantDB credentials to use. */
  storeId: string
  adminEmail: string
}

/**
 * Adds the first admin user to a merchant's InstantDB store.
 *
 * Called during the deploy wizard after the store is deployed to Cloudflare.
 * The merchant provides their InstantDB App ID and Admin Token in ConnectServicesStep,
 * and the admin email in SetupAdminStep. This server function adds that email to
 * the store's `users` table with role: 'admin'.
 *
 * The merchant's admin token is encrypted at rest and the browser cannot read it,
 * so this takes a storeId and resolves the credentials here instead of accepting
 * them from the client.
 */
export const addStoreAdmin = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as Params)
  .handler(async ({ data }) => {
    const { storeId, adminEmail } = data

    if (!storeId || !adminEmail) {
      throw new Error('المعطيات ناقصة')
    }

    const platformDb = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
    })
    const storeRes = await platformDb.query({ stores: { $: { where: { id: storeId } } } })
    const store = storeRes.stores?.[0] as { instantAppId?: string; instantAdminToken?: string } | undefined

    const instantAppId = store?.instantAppId ?? ''
    const instantAdminToken = store?.instantAdminToken
      ? await decryptSecret(store.instantAdminToken, process.env.STORE_SECRET_KEY ?? '')
      : ''

    if (!instantAppId || !instantAdminToken) {
      throw new Error('بيانات InstantDB للمتجر غير متوفرة')
    }

    // Initialize admin SDK with the MERCHANT's InstantDB app credentials
    const storeAdminDb = init({
      appId: instantAppId,
      adminToken: instantAdminToken,
    })

    // Check if users table already has this email (idempotent)
    const result = await storeAdminDb.query({
      users: { $: { where: { email: adminEmail } } },
    })

    const existingUsers = result.users ?? []
    if (existingUsers.length > 0) {
      return { success: true, alreadyExists: true, message: 'المستخدم موجود بالفعل' }
    }

    // Check total users — safety: don't override if users already exist
    const allResult = await storeAdminDb.query({ users: {} })
    const allUsers = allResult.users ?? []
    if (allUsers.length > 0) {
      return {
        success: false,
        alreadyExists: false,
        message: 'يوجد مستخدمون بالفعل في هذا المتجر. استخدم لوحة التحكم لإضافة مستخدمين.',
      }
    }

    // Add the admin user
    const { id } = await import('@instantdb/admin')
    const newId = id()
    await storeAdminDb.transact(
      storeAdminDb.tx.users[newId].update({
        email: adminEmail.toLowerCase().trim(),
        role: 'admin',
        createdAt: Date.now(),
      })
    )

    return { success: true, alreadyExists: false, message: 'تم إضافة المدير بنجاح' }
  })
