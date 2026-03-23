import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'

interface Params {
  instantAppId: string
  instantAdminToken: string
  adminEmail: string
}

/**
 * Adds the first admin user to a merchant's InstantDB store.
 *
 * Called during the deploy wizard after the store is deployed to Cloudflare.
 * The merchant provides their InstantDB App ID and Admin Token in ConnectServicesStep,
 * and the admin email in SetupAdminStep. This server function adds that email to
 * the store's `users` table with role: 'admin'.
 */
export const addStoreAdmin = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as Params)
  .handler(async ({ data }) => {
    const { instantAppId, instantAdminToken, adminEmail } = data

    if (!instantAppId || !instantAdminToken || !adminEmail) {
      throw new Error('المعطيات ناقصة')
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
