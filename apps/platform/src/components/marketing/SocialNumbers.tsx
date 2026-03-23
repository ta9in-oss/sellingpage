import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'

const stats = [
  { value: 500, suffix: '+', ar: 'متجر منشور', fr: 'Boutiques lancées' },
  { value: 99, suffix: '%', ar: 'رضا العملاء', fr: 'Satisfaction client' },
  { value: 2, suffix: 'د', ar: 'متوسط وقت النشر', fr: 'Temps de déploiement' },
]

function useCountUp(target: number, duration = 1500, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])

  return count
}

function StatCard({
  value,
  suffix,
  label,
  active,
}: {
  value: number
  suffix: string
  label: string
  active: boolean
}) {
  const count = useCountUp(value, 1500, active)

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="text-5xl lg:text-6xl font-black text-black tabular-nums">
        {count}
        <span className="text-black">{suffix}</span>
      </div>
      <p className="text-base text-black/70 font-medium">{label}</p>
    </div>
  )
}

export function SocialNumbers() {
  const { lang } = useLang()
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-24 px-4 bg-yellow-400 border-y-2 border-black"
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            value={stat.value}
            suffix={stat.suffix}
            label={lang === 'ar' ? stat.ar : stat.fr}
            active={active}
          />
        ))}
      </div>
    </section>
  )
}
