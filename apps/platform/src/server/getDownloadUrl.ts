import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'

export type DownloadType = 'store-source' | 'store-app' | 'platform-source'

interface GetDownloadUrlInput {
  downloadType: DownloadType
  userEmail: string
}

/** Tiers that may access each download type */
const TIER_ACCESS: Record<DownloadType, string[]> = {
  'store-source': ['pro', 'agency'],
  'store-app': ['pro', 'agency'],
  'platform-source': ['agency'],
}

/** Download URLs — configure via env vars or fall back to GitHub archives */
const DOWNLOAD_URLS: Record<DownloadType, string> = {
  'store-source':
    process.env.DOWNLOAD_URL_STORE_SOURCE ||
    'https://github.com/Ta9in/sellingpage/archive/refs/heads/main.zip',
  'store-app':
    process.env.DOWNLOAD_URL_STORE_APP ||
    'https://github.com/Ta9in/sellingpage/archive/refs/heads/main.zip',
  'platform-source':
    process.env.DOWNLOAD_URL_PLATFORM_SOURCE ||
    'https://github.com/Ta9in/sellingpage/archive/refs/heads/main.zip',
}

export const getDownloadUrl = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as GetDownloadUrlInput)
  .handler(async ({ data }) => {
    const adminDb = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
    })

    const result = await adminDb.query({
      platformUsers: { $: { where: { email: data.userEmail } } },
    })
    const platformUser = result.platformUsers?.[0] as { tier?: string } | undefined
    const tier = platformUser?.tier || ''

    const allowed = TIER_ACCESS[data.downloadType]
    if (!allowed.includes(tier)) {
      throw new Error(`باقتك الحالية (${tier}) لا تتضمن هذا التحميل`)
    }

    return { url: DOWNLOAD_URLS[data.downloadType] }
  })
