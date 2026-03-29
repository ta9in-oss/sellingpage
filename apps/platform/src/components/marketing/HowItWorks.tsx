import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { Palette, SlidersHorizontal, Bell, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { howItWorks as locale } from '@/locales'

const icons: Record<string, LucideIcon> = {
  Palette,
  SlidersHorizontal,
  Bell,
  Rocket,
}

export function HowItWorks() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how" ref={ref} className="py-24 px-4 bg-white border-y-2 border-black">
      <div className="max-w-5xl mx-auto">
        {/* Heading border flips with reading direction via logical properties */}
        <h2 className="text-4xl font-black text-black mb-16 border-s-4 border-yellow-400 ps-4 text-start">
          {t(locale.title)}
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Dashed connector on desktop */}
          <div className="hidden md:block absolute top-8 h-px border-t-2 border-dashed border-black left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)]" />

          {locale.steps.map((step, i) => {
            const Icon = icons[step.icon]
            return (
              <div
                key={i}
                className={cn(
                  'relative border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000] p-6',
                  'transition-all duration-500',
                  visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Number badge */}
                <span className="absolute -top-3 -end-3 w-8 h-8 bg-yellow-400 border-2 border-black font-black text-sm flex items-center justify-center">
                  {i + 1}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 bg-yellow-400 border-2 border-black flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-black" strokeWidth={2} />
                </div>

                <h3 className="font-black text-black text-lg mb-2">
                  {t(step.label)}
                </h3>
                <p className="text-black/60 text-sm leading-relaxed">
                  {t(step.desc)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
