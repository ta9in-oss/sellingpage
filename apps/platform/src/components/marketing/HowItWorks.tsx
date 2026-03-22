import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { Palette, SlidersHorizontal, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const T = {
  title: { ar: 'كيف يعمل؟', fr: 'Comment ça marche?' },
}

const icons: Record<string, LucideIcon> = {
  Palette,
  SlidersHorizontal,
  Rocket,
}

const steps = [
  {
    icon: 'Palette',
    ar: 'اختر قالبك',
    fr: 'Choisissez votre thème',
    desc: {
      ar: 'ثلاثة قوالب احترافية جاهزة للتخصيص',
      fr: 'Trois thèmes professionnels prêts à personnaliser',
    },
  },
  {
    icon: 'SlidersHorizontal',
    ar: 'خصص متجرك',
    fr: 'Personnalisez votre boutique',
    desc: {
      ar: 'محرر بصري مع معاينة فورية',
      fr: 'Éditeur visuel avec aperçu instantané',
    },
  },
  {
    icon: 'Rocket',
    ar: 'أطلق في دقيقتين',
    fr: 'Lancez en 2 minutes',
    desc: {
      ar: 'نشر تلقائي على Cloudflare',
      fr: 'Déploiement automatique sur Cloudflare',
    },
  },
]

export function HowItWorks() {
  const { t, lang } = useLang()

  return (
    <section id="how" className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-black text-center text-gray-900 mb-16">
          {t(T.title)}
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Dashed connector on desktop */}
          <div
            className={cn(
              'hidden md:block absolute top-10 h-px border-t-2 border-dashed border-orange-200',
              'left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)]'
            )}
          />

          {steps.map((step, i) => {
            const Icon = icons[step.icon]
            return (
              <div
                key={i}
                className="relative flex flex-col items-center text-center gap-4"
              >
                {/* Number circle */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center">
                  <span className="absolute -top-2.5 -end-2.5 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <Icon className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {lang === 'ar' ? step.ar : step.fr}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t(step.desc)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
