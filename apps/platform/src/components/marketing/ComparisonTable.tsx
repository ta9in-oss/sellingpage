import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

const T = {
  title: { ar: 'لماذا 7aba أفضل؟', fr: 'Pourquoi 7aba est meilleur?', en: 'Why is 7aba better?' },
  feature: { ar: 'الميزة', fr: 'Caractéristique', en: 'Feature' },
}

const features = [
  {
    label: { ar: 'رسوم شهرية', fr: 'Frais mensuels', en: 'Monthly fees' },
    haba: { text: { ar: '✓ لا يوجد', fr: '✓ Aucun', en: '✓ None' }, good: true },
    ayor: { text: { ar: '3,900–7,900 DZD/شهر', fr: '3 900–7 900 DZD/mois', en: '3,900–7,900 DZD/mo' }, good: false },
    shopify: { text: { ar: '$29–$299/شهر', fr: '$29–$299/mois', en: '$29–$299/mo' }, good: false },
  },
  {
    label: { ar: 'تملك الكود المصدري', fr: 'Propriété du code source', en: 'Own source code' },
    haba: { text: { ar: '✓ نعم (Pro)', fr: '✓ Oui (Pro)', en: '✓ Yes (Pro)' }, good: true },
    ayor: { text: { ar: '✗ لا', fr: '✗ Non', en: '✗ No' }, good: false },
    shopify: { text: { ar: '✗ لا', fr: '✗ Non', en: '✗ No' }, good: false },
  },
  {
    label: { ar: 'إنفراستراكتشر خاص', fr: 'Infrastructure privée', en: 'Private infrastructure' },
    haba: { text: { ar: '✓ Cloudflare', fr: '✓ Cloudflare', en: '✓ Cloudflare' }, good: true },
    ayor: { text: { ar: '✗ مشترك', fr: '✗ Partagée', en: '✗ Shared' }, good: false },
    shopify: { text: { ar: '✗ مشترك', fr: '✗ Partagée', en: '✗ Shared' }, good: false },
  },
  {
    label: { ar: 'بدون عمولة على المبيعات', fr: 'Sans commission sur ventes', en: 'No sales commission' },
    haba: { text: { ar: '✓ دائماً', fr: '✓ Toujours', en: '✓ Always' }, good: true },
    ayor: { text: { ar: '✓', fr: '✓', en: '✓' }, good: true },
    shopify: { text: { ar: '✗ 2%', fr: '✗ 2%', en: '✗ 2%' }, good: false },
  },
  {
    label: { ar: 'السعر', fr: 'Prix', en: 'Price' },
    haba: { text: { ar: '3,900 DZD مرة واحدة', fr: '3 900 DZD une fois', en: '3,900 DZD one-time' }, good: true, highlight: true },
    ayor: { text: { ar: '3,900+ DZD/شهر', fr: '3 900+ DZD/mois', en: '3,900+ DZD/mo' }, good: false },
    shopify: { text: { ar: '$29+/شهر', fr: '$29+/mois', en: '$29+/mo' }, good: false },
  },
]

export function ComparisonTable() {
  const { t } = useLang()

  return (
    <section className="py-24 px-4 bg-white border-y-2 border-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-black text-center text-black mb-12">
          {t(T.title)}
        </h2>

        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-start px-6 py-4 font-semibold text-black w-1/4">
                  {t(T.feature)}
                </th>
                {/* 7aba column — highlighted */}
                <th className="px-6 py-4 bg-yellow-400 border-x-2 border-black text-center">
                  <span className="font-black text-black text-base">7aba</span>
                  <div className="text-xs text-black/60 font-medium mt-0.5">
                    {t({ ar: 'دفع مرة واحدة', fr: 'Paiement unique', en: 'One-time payment' })}
                  </div>
                </th>
                <th className="px-6 py-4 text-center font-semibold text-black">
                  Ayor.ai
                </th>
                <th className="px-6 py-4 text-center font-semibold text-black">
                  Shopify
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr
                  key={i}
                  className="border-b-2 border-black last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-black">
                    {t(row.label)}
                  </td>
                  {/* 7aba */}
                  <td className="px-6 py-4 bg-yellow-50 border-x-2 border-black text-center">
                    <span
                      className={cn(
                        'font-semibold',
                        row.haba.highlight
                          ? 'font-black text-black'
                          : 'text-green-700'
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
                        row.ayor.good ? 'text-green-700' : 'text-red-600'
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
                        row.shopify.good ? 'text-green-700' : 'text-red-600'
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
