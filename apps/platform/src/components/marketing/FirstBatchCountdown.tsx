import { useState, useEffect } from 'react'
import { FIRST_BATCH_DEADLINE } from '@/config/pricing'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

const T = {
  heading: {
    ar: 'أسعار الدفعة الأولى فقط',
    fr: 'Tarifs de la première vague uniquement',
    en: 'First-batch prices only',
  },
  ended: {
    ar: 'انتهى عرض الدفعة الأولى — الأسعار ارتفعت',
    fr: 'Offre 1re vague terminée — les tarifs ont augmenté',
    en: 'First-batch offer ended — prices have gone up',
  },
  days: { ar: 'يوم', fr: 'jours', en: 'days' },
  hours: { ar: 'ساعة', fr: 'h', en: 'hrs' },
  mins: { ar: 'دقيقة', fr: 'min', en: 'min' },
  secs: { ar: 'ثانية', fr: 'sec', en: 'sec' },
}

function remaining() {
  const diff = FIRST_BATCH_DEADLINE.getTime() - Date.now()
  if (diff <= 0) return null
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  }
}

/**
 * Live-ticking countdown to the first-batch deadline. Client-only: starts null
 * on the server/first paint to avoid a hydration mismatch, then ticks each second.
 */
export function FirstBatchCountdown({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { t, dir } = useLang()
  const [time, setTime] = useState<ReturnType<typeof remaining> | undefined>(undefined)

  useEffect(() => {
    setTime(remaining())
    const iv = setInterval(() => setTime(remaining()), 1000)
    return () => clearInterval(iv)
  }, [])

  // Not yet mounted (SSR / first paint) — render nothing to keep hydration clean.
  if (time === undefined) return null

  const onDark = variant === 'dark'

  if (time === null) {
    return (
      <div dir={dir} className={cn('text-center text-base font-black', onDark ? 'text-yellow-400' : 'text-black')}>
        {t(T.ended)}
      </div>
    )
  }

  const cells: Array<[number, { ar: string; fr: string; en: string }]> = [
    [time.days, T.days],
    [time.hours, T.hours],
    [time.mins, T.mins],
    [time.secs, T.secs],
  ]
  const accent = onDark ? 'text-yellow-400' : 'text-black'

  // Borderless, centered, oversized text — no boxes.
  return (
    <div dir={dir} className="flex flex-col items-center text-center gap-2 w-full">
      <span className={cn('text-sm sm:text-base font-bold', accent)}>{t(T.heading)}</span>
      <div className="flex items-end justify-center gap-8 sm:gap-16" dir="ltr">
        {cells.map(([value, label], i) => (
          <div key={i} className="flex flex-col items-center leading-none">
            <span className={cn('text-4xl sm:text-6xl font-black tabular-nums', accent)}>{String(value).padStart(2, '0')}</span>
            <span className={cn('text-[10px] sm:text-xs font-bold mt-1 opacity-70', accent)}>{t(label)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
