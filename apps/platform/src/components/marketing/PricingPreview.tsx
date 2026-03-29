import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { pricingPreview as locale } from '@/locales'

export function PricingPreview() {
  const { t } = useLang()

  return (
    <section className="py-24 px-4 bg-white border-y-2 border-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-black mb-3">
            {t(locale.title)}
          </h2>
          <p className="text-lg text-black/60">{t(locale.sub)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {locale.tiers.map((tier, i) => (
            <div
              key={i}
              className={cn(
                'relative p-6 flex flex-col gap-4',
                tier.accent
                  ? 'bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_0px_#000] text-black'
                  : 'bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] text-black'
              )}
            >
              {tier.badge && (
                <span
                  className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2',
                    'text-xs font-bold px-3 py-1',
                    'bg-black text-yellow-400 whitespace-nowrap'
                  )}
                >
                  {t(tier.badge)}
                </span>
              )}

              <h3 className="text-lg font-bold text-black">
                {t(tier.name)}
              </h3>

              <div>
                <div className="text-3xl font-black text-black">
                  {tier.dzd}
                  <span className="text-sm font-medium ms-1 text-black/60">DZD</span>
                </div>
                <div className="text-xs mt-0.5 text-black/60">
                  {tier.usd} · {t(locale.once)}
                </div>
              </div>

              <Link
                to="/dashboard/builder"
                search={{ storeId: 'new', plan: tier.id }}
                className={cn(
                  'mt-auto text-center text-sm font-black py-2.5 border-2 border-black transition-all',
                  tier.accent
                    ? 'bg-black text-yellow-400 hover:bg-zinc-900'
                    : 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
                )}
              >
                {t(locale.cta)}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
