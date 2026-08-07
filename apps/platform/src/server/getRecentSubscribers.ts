import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'

export interface RecentSubscriber {
  name: string | null
  tier: string
  purchasedAt: number
}

/**
 * Recent real subscriptions for the public FOMO toast. Runs server-side with
 * the admin token specifically so the client never receives a raw
 * `platformUsers` row — that entity also carries `cfApiToken`/
 * `instantAdminToken`, which a public, unauthenticated widget must not fetch.
 */
export const getRecentSubscribers = createServerFn({ method: 'GET' }).handler(
  async (): Promise<RecentSubscriber[]> => {
    const adminDb = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
    })

    const result = await adminDb.query({ platformUsers: {} })
    const users = (result.platformUsers ?? []) as Array<{
      name?: string
      tier?: string
      purchasedAt?: number
    }>

    return users
      .filter((u): u is { name?: string; tier: string; purchasedAt: number } => !!u.tier && !!u.purchasedAt)
      .sort((a, b) => b.purchasedAt - a.purchasedAt)
      .slice(0, 20)
      .map((u) => ({ name: u.name ?? null, tier: u.tier, purchasedAt: u.purchasedAt }))
  }
)
