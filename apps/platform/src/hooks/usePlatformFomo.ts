import { useEffect, useRef, useState } from 'react'
import { getRecentSubscribers, type SubscriberStats } from '@/server/getRecentSubscribers'
import { TIERS } from '@/config/pricing'
import type { Tri } from '@/config/pricing'

/**
 * Real subscriber activity for the platform FOMO toast — no fabricated
 * names/cities. A prior version hardcoded fake "X from Oran bought" events
 * (removed in bb800db); this reads actual subscriptions via a server
 * function instead, so the client never touches the raw `platformUsers`
 * entity (which also carries deployment credential fields). `name` is
 * optional at signup, so anonymous subscribers show without one — never
 * invent a name or location that wasn't actually given.
 *
 * Three real event shapes, mixed and shuffled: an individual recent signup,
 * an all-time count for one tier, or the all-time total across every tier.
 */
export type FomoEvent =
  | { kind: 'individual'; name: string | null; plan: Tri; purchasedAt: number }
  | { kind: 'tierTotal'; plan: Tri; count: number }
  | { kind: 'grandTotal'; count: number }

function relativeTime(ms: number): Tri {
  const diff = Date.now() - ms
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return { ar: 'الآن', fr: 'à l’instant', en: 'just now' }
  if (mins < 60) return { ar: `منذ ${mins} دقيقة`, fr: `il y a ${mins} min`, en: `${mins}m ago` }
  const hours = Math.floor(mins / 60)
  if (hours < 24) return { ar: `منذ ${hours} ساعة`, fr: `il y a ${hours} h`, en: `${hours}h ago` }
  const days = Math.floor(hours / 24)
  return { ar: `منذ ${days} يوم`, fr: `il y a ${days} j`, en: `${days}d ago` }
}

function tierName(id: string): Tri {
  return TIERS.find((t) => t.id === id)?.name ?? { ar: id, fr: id, en: id }
}

function buildEvents(stats: SubscriberStats): FomoEvent[] {
  const events: FomoEvent[] = stats.recent.map((u) => ({
    kind: 'individual',
    name: u.name,
    plan: tierName(u.tier),
    purchasedAt: u.purchasedAt,
  }))

  for (const [tier, count] of Object.entries(stats.byTier)) {
    if (count > 0) events.push({ kind: 'tierTotal', plan: tierName(tier), count })
  }

  if (stats.total > 0) events.push({ kind: 'grandTotal', count: stats.total })

  // Shuffle so the three kinds interleave instead of running in fixed blocks.
  for (let i = events.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[events[i], events[j]] = [events[j], events[i]]
  }
  return events
}

export function usePlatformFomo() {
  const [current, setCurrent] = useState<FomoEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    getRecentSubscribers().then((stats: SubscriberStats) => {
      if (cancelled) return
      const events = buildEvents(stats)
      if (events.length === 0) return

      function showNext() {
        const event = events[indexRef.current % events.length]
        indexRef.current++
        setCurrent(event)
        setVisible(true)

        timerRef.current = setTimeout(() => {
          setVisible(false)
          const gap = 12000 + Math.random() * 8000
          timerRef.current = setTimeout(showNext, gap)
        }, 5000)
      }

      const initial = 6000 + Math.random() * 4000
      timerRef.current = setTimeout(showNext, initial)
    })

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const timeAgo = current?.kind === 'individual' ? relativeTime(current.purchasedAt) : null
  return { current, visible, timeAgo }
}
