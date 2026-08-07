import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'

export interface RecentSubscriber {
  name: string | null
  tier: string
  purchasedAt: number
}

export interface SubscriberStats {
  recent: RecentSubscriber[]
  /** All-time count per tier — not restricted to the 30-day recent window. */
  byTier: Record<string, number>
  /** All-time total across every tier. */
  total: number
}

/**
 * Recent + aggregate real subscriptions for the public FOMO toast. Runs
 * server-side with the admin token specifically so the client never
 * receives a raw `platformUsers` row — that entity also carries
 * `cfApiToken`/`instantAdminToken`, which a public, unauthenticated widget
 * must not fetch.
 */
export const getRecentSubscribers = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SubscriberStats> => {
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

    const subscribed = users
      .map((u) => ({ name: u.name ?? null, tier: u.tier, purchasedAt: u.purchasedAt ? new Date(u.purchasedAt).getTime() : NaN }))
      .filter((u): u is RecentSubscriber => !!u.tier && !Number.isNaN(u.purchasedAt))

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const recent = subscribed
      .filter((u) => u.purchasedAt >= thirtyDaysAgo)
      .sort((a, b) => b.purchasedAt - a.purchasedAt)
      .slice(0, 20)

    const byTier: Record<string, number> = {}
    for (const u of subscribed) byTier[u.tier] = (byTier[u.tier] ?? 0) + 1

    return { recent, byTier, total: subscribed.length }
  }
)
