import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { comparisonTable as locale } from '@/locales'

export function ComparisonTable() {
  const { t } = useLang()

  return (
    <section className="py-24 px-4 bg-white border-y-2 border-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-black text-center text-black mb-12">
          {t(locale.title)}
        </h2>

        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-start px-6 py-4 font-semibold text-black w-1/4">
                  {t(locale.feature)}
                </th>
                {/* 7aba column — highlighted */}
                <th className="px-6 py-4 bg-yellow-400 border-x-2 border-black text-center">
                  <span className="font-black text-black text-base">7aba</span>
                  <div className="text-xs text-black/60 font-medium mt-0.5">
                    {t(locale.oncePayment)}
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
              {locale.features.map((row, i) => (
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
