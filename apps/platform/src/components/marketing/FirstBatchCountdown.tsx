import { useState, useEffect } from 'react'
import { FIRST_BATCH_DEADLINE } from '@/config/pricing'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

const T = {
  heading: {
    ar: 'أسعار الدفعة الأولى تنتهي خلال',
    fr: 'Les tarifs 1re vague se terminent dans',
    en: 'First-batch pricing ends in',
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
      <div
        dir={dir}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 border-2 font-black text-sm',
          onDark ? 'border-yellow-400 text-yellow-400' : 'border-black text-black bg-yellow-400',
        )}
      >
        ⏰ {t(T.ended)}
      </div>
    )
  }

  const cells: Array<[number, { ar: string; fr: string; en: string }]> = [
    [time.days, T.days],
    [time.hours, T.hours],
    [time.mins, T.mins],
    [time.secs, T.secs],
  ]

  return (
    <div dir={dir} className="inline-flex flex-col items-center gap-2">
      <span className={cn('text-xs font-bold uppercase tracking-wide', onDark ? 'text-yellow-400' : 'text-black/60')}>
        ⏰ {t(T.heading)}
      </span>
      <div className="flex items-center gap-2" dir="ltr">
        {cells.map(([value, label], i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                'flex flex-col items-center justify-center min-w-[3.25rem] px-2 py-1.5 border-2 font-black',
                onDark ? 'border-yellow-400 bg-black text-yellow-400' : 'border-black bg-white text-black',
              )}
            >
              <span className="text-2xl leading-none tabular-nums">{String(value).padStart(2, '0')}</span>
              <span className="text-[10px] font-bold opacity-70">{t(label)}</span>
            </div>
            {i < cells.length - 1 && <span className={cn('font-black text-xl', onDark ? 'text-yellow-400' : 'text-black')}>:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
