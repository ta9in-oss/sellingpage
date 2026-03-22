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

const T = {
  title: { ar: 'كل ما تحتاجه لمتجرك', fr: 'Tout ce dont vous avez besoin' },
}

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

const features = [
  {
    icon: 'Zap',
    ar: 'نشر في دقيقتين',
    fr: 'Déployé en 2 min',
    desc: {
      ar: 'Cloudflare Workers — أسرع CDN في العالم',
      fr: 'Cloudflare Workers — CDN le plus rapide',
    },
  },
  {
    icon: 'Shield',
    ar: 'ملكية كاملة',
    fr: 'Propriété totale',
    desc: {
      ar: 'الكود والبيانات ملكك، لا أحد يستطيع إغلاق متجرك',
      fr: 'Code et données vous appartiennent',
    },
  },
  {
    icon: 'Palette',
    ar: '3 قوالب احترافية',
    fr: '3 thèmes pro',
    desc: {
      ar: 'بسيط، جريء، دافئ — كل واحد محسّن للبيع',
      fr: 'Simple, audacieux, chaleureux — optimisés pour vendre',
    },
  },
  {
    icon: 'Languages',
    ar: 'عربي + فرنسي',
    fr: 'Arabe + Français',
    desc: {
      ar: 'واجهة RTL أصلية ودعم ثنائي اللغة',
      fr: 'Interface RTL native et bilinguisme',
    },
  },
  {
    icon: 'Bell',
    ar: 'إشعارات الطلبات',
    fr: 'Notifications commandes',
    desc: {
      ar: 'إشعارات فورية لكل طلب جديد',
      fr: 'Notifications en temps réel',
    },
  },
  {
    icon: 'MapPin',
    ar: 'توصيل للجزائر',
    fr: 'Livraison Algérie',
    desc: {
      ar: '58 ولاية ودوائرها كاملة في نموذج الطلب',
      fr: '58 wilayas dans le formulaire de commande',
    },
  },
  {
    icon: 'BarChart2',
    ar: 'تحليلات مدمجة',
    fr: 'Analytics intégrés',
    desc: {
      ar: 'Google Analytics + Meta Pixel + Clarity',
      fr: 'Google Analytics + Meta Pixel + Clarity',
    },
  },
  {
    icon: 'CreditCard',
    ar: 'لا عمولات أبداً',
    fr: 'Zéro commission',
    desc: {
      ar: 'كل ريال من مبيعاتك يذهب إليك مباشرة',
      fr: 'Chaque dinar de vos ventes vous revient',
    },
  },
]

export function FeatureGrid() {
  const { t, lang } = useLang()

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-black text-center text-gray-900 mb-12">
          {t(T.title)}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon]
            return (
              <div
                key={i}
                className={cn(
                  'bg-white rounded-2xl p-5 border border-gray-100',
                  'hover:border-orange-200 hover:shadow-md transition-all group'
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                  <Icon className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {lang === 'ar' ? feature.ar : feature.fr}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
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
