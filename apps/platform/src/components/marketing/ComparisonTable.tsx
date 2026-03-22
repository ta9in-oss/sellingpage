import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

const T = {
  title: { ar: 'لماذا 7aba أفضل؟', fr: 'Pourquoi 7aba est meilleur?' },
  feature: { ar: 'الميزة', fr: 'Caractéristique' },
}

const features = [
  {
    label: { ar: 'رسوم شهرية', fr: 'Frais mensuels' },
    haba: { text: { ar: '✓ لا يوجد', fr: '✓ Aucun' }, good: true },
    ayor: { text: { ar: '3,900–7,900 DZD/شهر', fr: '3 900–7 900 DZD/mois' }, good: false },
    shopify: { text: { ar: '$29–$299/شهر', fr: '$29–$299/mois' }, good: false },
  },
  {
    label: { ar: 'تملك الكود المصدري', fr: 'Propriété du code source' },
    haba: { text: { ar: '✓ نعم (Pro)', fr: '✓ Oui (Pro)' }, good: true },
    ayor: { text: { ar: '✗ لا', fr: '✗ Non' }, good: false },
    shopify: { text: { ar: '✗ لا', fr: '✗ Non' }, good: false },
  },
  {
    label: { ar: 'إنفراستراكتشر خاص', fr: 'Infrastructure privée' },
    haba: { text: { ar: '✓ Cloudflare', fr: '✓ Cloudflare' }, good: true },
    ayor: { text: { ar: '✗ مشترك', fr: '✗ Partagée' }, good: false },
    shopify: { text: { ar: '✗ مشترك', fr: '✗ Partagée' }, good: false },
  },
  {
    label: { ar: 'بدون عمولة على المبيعات', fr: 'Sans commission sur ventes' },
    haba: { text: { ar: '✓ دائماً', fr: '✓ Toujours' }, good: true },
    ayor: { text: { ar: '✓', fr: '✓' }, good: true },
    shopify: { text: { ar: '✗ 2%', fr: '✗ 2%' }, good: false },
  },
  {
    label: { ar: 'السعر', fr: 'Prix' },
    haba: { text: { ar: '3,900 DZD مرة واحدة', fr: '3 900 DZD une fois' }, good: true, highlight: true },
    ayor: { text: { ar: '3,900+ DZD/شهر', fr: '3 900+ DZD/mois' }, good: false },
    shopify: { text: { ar: '$29+/شهر', fr: '$29+/mois' }, good: false },
  },
]

export function ComparisonTable() {
  const { t } = useLang()

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-black text-center text-gray-900 mb-12">
          {t(T.title)}
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-start px-6 py-4 font-semibold text-gray-500 w-1/4">
                  {t(T.feature)}
                </th>
                {/* 7aba column — highlighted */}
                <th className="px-6 py-4 bg-orange-50 border-x border-orange-200 text-center">
                  <span className="font-black text-orange-600 text-base">7aba</span>
                  <div className="text-xs text-orange-500 font-medium mt-0.5">
                    {t({ ar: 'دفع مرة واحدة', fr: 'Paiement unique' })}
                  </div>
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">
                  Ayor.ai
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">
                  Shopify
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-gray-100 last:border-0',
                    'hover:bg-gray-50/50 transition-colors'
                  )}
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {t(row.label)}
                  </td>
                  {/* 7aba */}
                  <td className="px-6 py-4 bg-orange-50/50 border-x border-orange-100 text-center">
                    <span
                      className={cn(
                        'font-semibold',
                        row.haba.highlight
                          ? 'text-orange-600 text-base font-black'
                          : 'text-green-600'
                      )}
                    >
                      {t(row.haba.text)}
                    </span>
                  </td>
                  {/* Ayor */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        'font-medium',
                        row.ayor.good ? 'text-green-600' : 'text-red-500'
                      )}
                    >
                      {t(row.ayor.text)}
                    </span>
                  </td>
                  {/* Shopify */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        'font-medium',
                        row.shopify.good ? 'text-green-600' : 'text-red-500'
                      )}
                    >
                      {t(row.shopify.text)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
