import { createServerFn } from '@tanstack/react-start'

/**
 * Auto-provisions a new InstantDB app for a merchant store.
 *
 * We generate the appId and adminToken ourselves (both UUIDs),
 * then register them with the InstantDB platform API using
 * the platform's personal token.
 *
 * This eliminates the need for merchants to create or manage
 * InstantDB accounts — we handle the database entirely.
 */
export const autoProvisionInstantDB = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as { storeSlug: string; merchantToken?: string })
  .handler(async ({ data: { storeSlug, merchantToken } }) => {
    const token = merchantToken || process.env['INSTANTDB_PLATFORM_PERSONAL_TOKEN']
    if (!token) throw new Error('No InstantDB token (merchant or platform) available')

    // Generate both IDs ourselves — InstantDB requires us to provide them
    const appId = crypto.randomUUID()
    const adminToken = crypto.randomUUID()
    const title = `7aba-store-${storeSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`

    // Merchant OAuth token → Platform superadmin endpoint; personal token → dash endpoint.
    const url = merchantToken
      ? 'https://api.instantdb.com/superadmin/apps'
      : 'https://api.instantdb.com/dash/apps'

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: appId, title, admin_token: adminToken }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`InstantDB app creation failed: ${err}`)
    }

    return { appId, adminToken }
  })
