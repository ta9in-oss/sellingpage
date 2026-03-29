import { useLang } from '@/hooks/useLang'
import {
  Zap,
  Shield,
  Palette,
  Languages,
  Bell,
  MapPin,
  BarChart2,
  CreditCard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { featureGrid as locale } from '@/locales'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Palette,
  Languages,
  Bell,
  MapPin,
  BarChart2,
  CreditCard,
}

export function FeatureGrid() {
  const { t } = useLang()

  return (
    <section className="py-24 px-4 bg-white border-y-2 border-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-black text-center text-black mb-12">
          {t(locale.title)}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {locale.features.map((feature, i) => {
            const Icon = iconMap[feature.icon]
            return (
              <div
                key={i}
                className={cn(
                  'border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000] p-5',
                  'hover:bg-yellow-50 hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all'
                )}
              >
                <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-black" strokeWidth={2} />
                </div>
                <h3 className="font-black text-black text-sm mb-1">
                  {t(feature.label)}
                </h3>
                <p className="text-xs text-black/60 leading-relaxed">
                  {t(feature.desc)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
