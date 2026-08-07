import { useEffect, useRef, useState } from 'react'
import { getRecentSubscribers, type RecentSubscriber } from '@/server/getRecentSubscribers'
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
 */
export interface FomoEvent {
  name: string | null
  plan: Tri
  purchasedAt: number
}

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

export function usePlatformFomo() {
  const [current, setCurrent] = useState<FomoEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    getRecentSubscribers().then((subscribers: RecentSubscriber[]) => {
      if (cancelled || subscribers.length === 0) return

      function showNext() {
        const u = subscribers[indexRef.current % subscribers.length]
        indexRef.current++
        const tier = TIERS.find((t) => t.id === u.tier)
        setCurrent({
          name: u.name,
          plan: tier?.name ?? { ar: u.tier, fr: u.tier, en: u.tier },
          purchasedAt: u.purchasedAt,
        })
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

  return { current, visible, timeAgo: current ? relativeTime(current.purchasedAt) : null }
}
