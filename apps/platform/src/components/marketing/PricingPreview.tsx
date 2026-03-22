import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const T = {
  title: { ar: 'الأسعار', fr: 'Tarifs' },
  sub: {
    ar: 'دفع مرة واحدة. لا اشتراكات. لا مفاجآت.',
    fr: 'Payez une fois. Pas d\'abonnements. Pas de surprises.',
  },
  cta: { ar: 'اختر هذه الباقة', fr: 'Choisir ce forfait' },
  once: { ar: 'دفع مرة واحدة', fr: 'Paiement unique' },
}

const tiers = [
  {
    name: { ar: 'بسيط', fr: 'Simple' },
    dzd: '3,900',
    usd: '$29',
    badge: { ar: 'الأكثر شيوعاً', fr: 'Le plus populaire' },
    accent: true,
  },
  {
    name: { ar: 'احترافي', fr: 'Pro' },
    dzd: '14,900',
    usd: '$99',
    badge: null,
    accent: false,
  },
  {
    name: { ar: 'ستوديو', fr: 'Studio' },
    dzd: '49,000',
    usd: '$299',
    badge: null,
    accent: false,
  },
  {
    name: { ar: 'راعي', fr: 'Partenaire' },
    dzd: '99,000+',
    usd: '$500+',
    badge: null,
    accent: false,
  },
]

export function PricingPreview() {
  const { t } = useLang()

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
            {t(T.title)}
          </h2>
          <p className="text-lg text-gray-500">{t(T.sub)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={cn(
                'relative rounded-2xl p-6 flex flex-col gap-4 border',
                tier.accent
                  ? 'bg-orange-500 border-orange-400 text-white shadow-xl shadow-orange-200'
                  : 'bg-white border-gray-200 text-gray-900'
              )}
            >
              {tier.badge && (
                <span
                  className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2',
                    'text-xs font-bold px-3 py-1 rounded-full',
                    'bg-gray-900 text-white whitespace-nowrap'
                  )}
                >
                  {t(tier.badge)}
                </span>
              )}

              <h3
                className={cn(
                  'text-lg font-bold',
                  tier.accent ? 'text-white' : 'text-gray-900'
                )}
              >
                {t(tier.name)}
              </h3>

              <div>
                <div
                  className={cn(
                    'text-3xl font-black',
                    tier.accent ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {tier.dzd}
                  <span className="text-sm font-medium ms-1">DZD</span>
                </div>
                <div
                  className={cn(
                    'text-xs mt-0.5',
                    tier.accent ? 'text-orange-100' : 'text-gray-400'
                  )}
                >
                  {tier.usd} · {t(T.once)}
                </div>
              </div>

              <Link
                to="/pricing"
                className={cn(
                  'mt-auto text-center text-sm font-semibold py-2.5 rounded-xl transition-all',
                  tier.accent
                    ? 'bg-white text-orange-600 hover:bg-orange-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                )}
              >
                {t(T.cta)}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
