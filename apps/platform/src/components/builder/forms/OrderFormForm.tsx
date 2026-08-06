import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'

const T = {
  orderForm: { ar: 'نموذج الطلب', fr: 'Formulaire de commande', en: 'Order Form' },
  sectionTitle: { ar: 'عنوان القسم', fr: 'Titre de la section', en: 'Section title' },
  submitLabel: { ar: 'نص زر الإرسال', fr: 'Texte du bouton d\'envoi', en: 'Submit button text' },
  fixedFieldsNote: {
    ar: 'حقول النموذج ثابتة: الاسم الكامل، رقم الهاتف، الولاية، البلدية والعنوان. مُصمَّمة للتوصيل الجزائري.',
    fr: 'Les champs du formulaire sont fixes : nom, téléphone, wilaya, commune et adresse. Conçus pour la livraison algérienne.',
    en: 'Form fields are fixed: full name, phone, wilaya, commune, address. Designed for Algerian delivery.',
  },
  requiredTitle: { ar: 'الحقول الإجبارية', fr: 'Champs obligatoires', en: 'Required fields' },
  requiredHint: {
    ar: 'كل حقل تطفئه يبقى ظاهراً لكن الزبون يقدر يتخطاه. أقل حقول = طلبات أكثر.',
    fr: 'Un champ désactivé reste visible mais le client peut le laisser vide. Moins de champs = plus de commandes.',
    en: 'A field you switch off still shows, but the buyer can leave it empty. Fewer required fields means more orders.',
  },
  fName: { ar: 'الاسم الكامل', fr: 'Nom complet', en: 'Full name' },
  fPhone: { ar: 'رقم الهاتف', fr: 'Téléphone', en: 'Phone' },
  fEmail: { ar: 'البريد الإلكتروني', fr: 'E-mail', en: 'Email' },
  fMessage: { ar: 'ملاحظة الزبون', fr: 'Message du client', en: 'Customer note' },
  locationNote: {
    ar: 'الولاية والدائرة والبلدية إجبارية دائماً — بدونها ما نقدروش نوصّلوا الطلب.',
    fr: 'Wilaya, daïra et commune sont toujours obligatoires — sans elles, pas de livraison.',
    en: 'Wilaya, daira and commune are always required — without them the parcel cannot be delivered.',
  },
  emailForcedNote: {
    ar: 'الدفع الإلكتروني مفعّل، لهذا البريد الإلكتروني إجباري (يُرسل إليه وصل الدفع).',
    fr: 'Le paiement en ligne est actif : l\'e-mail est donc obligatoire (le reçu y est envoyé).',
    en: 'Online payment is active, so email is required — the receipt is sent there.',
  },
}

const FIELD_DEFAULTS = { name: true, phone: true, email: false, message: false }

export function OrderFormForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'order-form') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)

  const req = { ...FIELD_DEFAULTS, ...(section.requiredFields ?? {}) }
  const setRequired = (key: keyof typeof FIELD_DEFAULTS, value: boolean) =>
    update({ requiredFields: { ...req, [key]: value } })
  // Chargily mails the receipt, so the store's payment setting wins over this
  // toggle. Show it locked rather than letting the merchant set something the
  // storefront will silently override.
  const emailLocked = (config.payment?.activeMethod ?? 'cod') !== 'cod'

  const toggles = [
    { key: 'name' as const, label: t(T.fName), locked: false },
    { key: 'phone' as const, label: t(T.fPhone), locked: false },
    { key: 'email' as const, label: t(T.fEmail), locked: emailLocked },
    { key: 'message' as const, label: t(T.fMessage), locked: false },
  ]

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.orderForm)}</p>

      <div className="space-y-1.5">
        <Label className="text-xs">{t(T.sectionTitle)}</Label>
        <Input
          value={(section as any).title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          dir={storeDir}
          placeholder={t({ ar: 'اطلب الآن', fr: 'Commander maintenant', en: 'Order now' })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t(T.submitLabel)}</Label>
        <Input
          value={section.submitLabel}
          onChange={(e) => update({ submitLabel: e.target.value })}
          dir={storeDir}
        />
      </div>

      <div className="space-y-2 pt-2">
        <Label className="text-xs">{t(T.requiredTitle)}</Label>
        <p className="text-[11px] text-muted-foreground">{t(T.requiredHint)}</p>
        <div className="rounded-md border border-border divide-y divide-border">
          {toggles.map((f) => (
            <label
              key={f.key}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 text-xs ${f.locked ? 'opacity-60' : 'cursor-pointer'}`}
            >
              <span className="font-medium">{f.label}</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={f.locked ? true : req[f.key]}
                disabled={f.locked}
                onChange={(e) => setRequired(f.key, e.target.checked)}
              />
            </label>
          ))}
        </div>
        {emailLocked && (
          <p className="text-[11px] text-amber-600 dark:text-amber-500">{t(T.emailForcedNote)}</p>
        )}
        <p className="text-[11px] text-muted-foreground">{t(T.locationNote)}</p>
      </div>

      <div className="flex gap-2.5 p-3 rounded-md bg-muted border border-border">
        <Info size={14} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">{t(T.fixedFieldsNote)}</p>
      </div>
    </div>
  )
}
