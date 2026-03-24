import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Banknote, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PaymentPanel() {
  const { config, updatePayment } = useBuilderStore()
  const activeMethod = config.payment?.activeMethod ?? 'cod'
  const chargilyApiKey = config.payment?.chargilyApiKey ?? ''

  return (
    <div className="p-4 space-y-5" dir="rtl">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">طريقة الدفع</p>
      <p className="text-xs text-zinc-400">
        اختر طريقة الدفع المفعّلة في متجرك. لن يرى المشتري هذا الخيار — يُطبَّق تلقائيًا عند الطلب.
      </p>

      {/* Method selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => updatePayment({ activeMethod: 'cod' })}
          className={cn(
            'flex flex-col items-center gap-2 border-2 p-4 text-sm font-bold transition-all',
            activeMethod === 'cod'
              ? 'border-black bg-yellow-400 shadow-[3px_3px_0px_#000]'
              : 'border-zinc-300 bg-white hover:border-zinc-500'
          )}
        >
          <Banknote size={20} />
          <span>الدفع عند الاستلام</span>
          <span className="text-[10px] font-normal text-zinc-500">COD</span>
        </button>

        <button
          type="button"
          onClick={() => updatePayment({ activeMethod: 'chargily' })}
          className={cn(
            'flex flex-col items-center gap-2 border-2 p-4 text-sm font-bold transition-all',
            activeMethod === 'chargily'
              ? 'border-black bg-yellow-400 shadow-[3px_3px_0px_#000]'
              : 'border-zinc-300 bg-white hover:border-zinc-500'
          )}
        >
          <CreditCard size={20} />
          <span>دفع إلكتروني</span>
          <span className="text-[10px] font-normal text-zinc-500">Chargily Pay</span>
        </button>
      </div>

      {/* Chargily API key — only shown when chargily is selected */}
      {activeMethod === 'chargily' && (
        <div className="space-y-2 border-2 border-black p-4 bg-zinc-50">
          <Label className="text-xs font-bold">مفتاح Chargily API</Label>
          <Input
            type="password"
            value={chargilyApiKey}
            onChange={(e) => updatePayment({ chargilyApiKey: e.target.value })}
            placeholder="chlg_live_..."
            className="text-sm font-mono"
            dir="ltr"
          />
          <p className="text-[11px] text-zinc-400">
            احصل على المفتاح من{' '}
            <a
              href="https://pay.chargily.net/test/dashboard/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-zinc-600"
            >
              لوحة Chargily
            </a>
            . يُخزَّن بأمان ويُرسَل كـ Worker secret عند النشر.
          </p>
        </div>
      )}
    </div>
  )
}
