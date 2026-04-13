import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Banknote, CreditCard, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'

const T = {
  paymentMethod: { ar: 'طريقة الدفع', fr: 'Méthode de paiement', en: 'Payment method' },
  paymentHint: { ar: 'اختر طريقة الدفع المفعّلة في متجرك. لن يرى المشتري هذا الخيار، يُطبَّق تلقائيًا عند الطلب.', fr: "Choisissez la méthode de paiement activée dans votre boutique. L'acheteur ne verra pas ce choix, il s'applique automatiquement à la commande.", en: 'Choose the active payment method for your store. The buyer will not see this option, it is applied automatically at checkout.' },
  cod: { ar: 'الدفع عند الاستلام', fr: 'Paiement à la livraison', en: 'Cash on delivery' },
  online: { ar: 'دفع إلكتروني', fr: 'Paiement en ligne', en: 'Online payment' },
  both: { ar: 'كلاهما', fr: 'Les deux', en: 'Both' },
  bothHint: { ar: 'الزبون يختار بين النقدي والإلكتروني', fr: 'Le client choisit entre espèces et en ligne', en: 'Customer chooses between cash and online' },
  chargilyApiKey: { ar: 'مفتاح Chargily API', fr: 'Clé API Chargily', en: 'Chargily API key' },
  chargilyHint: { ar: 'احصل على المفتاح من', fr: 'Obtenez la clé depuis', en: 'Get the key from' },
  chargilyHint2: { ar: '. يُخزَّن بأمان ويُرسَل كـ Worker secret عند النشر.', fr: '. Stocké en toute sécurité et envoyé comme secret Worker lors du déploiement.', en: '. Stored securely and sent as a Worker secret on deploy.' },
}

type Method = 'cod' | 'chargily' | 'both'

const METHODS: { id: Method; icon: React.ElementType; label: (typeof T)['cod']; sub?: (typeof T)['bothHint'] }[] = [
  { id: 'cod', icon: Banknote, label: T.cod },
  { id: 'chargily', icon: CreditCard, label: T.online },
  { id: 'both', icon: Check, label: T.both, sub: T.bothHint },
]

export function PaymentPanel() {
  const { config, updatePayment } = useBuilderStore()
  const { t } = useLang()
  const activeMethod = (config.payment?.activeMethod ?? 'cod') as Method
  const chargilyApiKey = config.payment?.chargilyApiKey ?? ''
  const showChargilyKey = activeMethod === 'chargily' || activeMethod === 'both'

  return (
    <div className="p-4 space-y-5">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t(T.paymentMethod)}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{t(T.paymentHint)}</p>
      </div>

      {/* Method selector */}
      <div className="grid grid-cols-3 gap-2">
        {METHODS.map(({ id, icon: Icon, label, sub }) => {
          const selected = activeMethod === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => updatePayment({ activeMethod: id })}
              className={cn(
                'flex flex-col items-center gap-1.5 border rounded-md p-3 text-xs font-medium transition-all',
                selected
                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              <Icon size={18} />
              <span>{t(label)}</span>
              {sub && <span className="text-[10px] opacity-60 text-center leading-tight">{t(sub)}</span>}
            </button>
          )
        })}
      </div>

      {/* Chargily API key — shown when chargily or both is selected */}
      {showChargilyKey && (
        <div className="space-y-2 rounded-md border border-border p-3 bg-muted/30">
          <Label className="text-xs font-medium">{t(T.chargilyApiKey)}</Label>
          <Input
            type="password"
            value={chargilyApiKey}
            onChange={(e) => updatePayment({ chargilyApiKey: e.target.value })}
            placeholder="chlg_live_..."
            className="text-sm font-mono"
            dir="ltr"
          />
          <p className="text-[11px] text-muted-foreground">
            {t(T.chargilyHint)}{' '}
            <a
              href="https://pay.chargily.net/test/dashboard/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              لوحة Chargily
            </a>
            {t(T.chargilyHint2)}
          </p>
        </div>
      )}
    </div>
  )
}
