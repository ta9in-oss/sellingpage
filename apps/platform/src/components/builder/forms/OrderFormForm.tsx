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
}

export function OrderFormForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'order-form') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)

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

      <div className="flex gap-2.5 p-3 rounded-md bg-muted border border-border">
        <Info size={14} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">{t(T.fixedFieldsNote)}</p>
      </div>
    </div>
  )
}
