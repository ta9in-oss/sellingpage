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
      // InstantDB's i.date() round-trips as an ISO string, not the epoch
      // number `new Date()` was written with — normalize below.
      purchasedAt?: number | string
    }>

    return users
      .map((u) => ({ name: u.name ?? null, tier: u.tier, purchasedAt: u.purchasedAt ? new Date(u.purchasedAt).getTime() : NaN }))
      .filter((u): u is RecentSubscriber => !!u.tier && !Number.isNaN(u.purchasedAt))
      .sort((a, b) => b.purchasedAt - a.purchasedAt)
      .slice(0, 20)
  }
)
