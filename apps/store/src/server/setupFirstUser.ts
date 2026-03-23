import { createServerFn } from '@tanstack/react-start'
import { init, id } from '@instantdb/admin'

function getAdminDb() {
  const appId = process.env.VITE_INSTANT_APP_ID
  const adminToken = process.env.INSTANT_ADMIN_TOKEN
  if (!appId || !adminToken) throw new Error('InstantDB env vars not configured')
  return init({ appId, adminToken })
}

/** Check whether any admin/seller user exists yet */
export const checkSetupNeeded = createServerFn({ method: 'GET' }).handler(async () => {
  const adminDb = getAdminDb()
  const result = await adminDb.query({ users: {} })
  const users = (result as any)?.users ?? []
  return { needsSetup: users.length === 0 }
})

interface SetupInput {
  email: string
}

/** Add the first admin user — only works when no users exist */
export const setupFirstUser = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as SetupInput)
  .handler(async ({ data }) => {
    const adminDb = getAdminDb()

    // Re-check that users table is still empty (prevent race condition)
    const result = await adminDb.query({ users: {} })
    const users = (result as any)?.users ?? []
    if (users.length > 0) {
      return { success: false, error: 'تم إعداد المتجر بالفعل. لا يمكن إضافة المستخدم الأول مرة أخرى.' }
    }

    const email = data.email.toLowerCase().trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'البريد الإلكتروني غير صالح' }
    }

    await adminDb.transact([
      adminDb.tx.users[id()].update({
        email,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    ])

    return { success: true }
  })
