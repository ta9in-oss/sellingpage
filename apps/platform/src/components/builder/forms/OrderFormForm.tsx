import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { FormField } from '@7aba/store-ui'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const T = {
  orderForm: { ar: 'نموذج الطلب', fr: 'Formulaire de commande', en: 'Order Form' },
  submitLabel: { ar: 'نص زر الإرسال', fr: 'Texte du bouton', en: 'Submit button text' },
  fields: { ar: 'الحقول', fr: 'Champs', en: 'Fields' },
  field: { ar: 'حقل', fr: 'Champ', en: 'Field' },
  fieldLabel: { ar: 'التسمية', fr: 'Étiquette', en: 'Label' },
  fieldType: { ar: 'النوع', fr: 'Type', en: 'Type' },
  required: { ar: 'إلزامي', fr: 'Requis', en: 'Required' },
  addField: { ar: 'إضافة حقل', fr: 'Ajouter un champ', en: 'Add field' },
  delete: { ar: 'حذف', fr: 'Supprimer', en: 'Delete' },
  typeText: { ar: 'نص', fr: 'Texte', en: 'Text' },
  typePhone: { ar: 'هاتف', fr: 'Téléphone', en: 'Phone' },
  typeSelect: { ar: 'قائمة', fr: 'Liste', en: 'Select' },
}

export function OrderFormForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'order-form') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const fields = section.fields
  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.orderForm)}</p>

      <div className="space-y-1.5">
        <Label>{t(T.submitLabel)}</Label>
        <Input value={section.submitLabel} onChange={(e) => update({ submitLabel: e.target.value })} dir={storeDir} />
      </div>

      <div className="space-y-2">
        <Label>{t(T.fields)}</Label>

        {fields.map((field) => (
          <div key={field.id} className="border border-border rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">{t(T.field)}</span>
              <Button variant="ghost" size="sm" onClick={() => update({ fields: fields.filter((f) => f.id !== field.id) })} className="text-destructive h-7 w-7 p-0" aria-label={t(T.delete)}>
                <Trash2 size={14} />
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t(T.fieldLabel)}</Label>
              <Input value={field.label} onChange={(e) => update({ fields: fields.map((f) => f.id === field.id ? { ...f, label: e.target.value } : f) })} dir={storeDir} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs">{t(T.fieldType)}</Label>
                <select value={field.type} onChange={(e) => update({ fields: fields.map((f) => f.id === field.id ? { ...f, type: e.target.value as FormField['type'] } : f) })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="text">{t(T.typeText)}</option>
                  <option value="phone">{t(T.typePhone)}</option>
                  <option value="select">{t(T.typeSelect)}</option>
                </select>
              </div>
              <div className="flex items-end pb-1 gap-1">
                <input type="checkbox" id={`req-${field.id}`} checked={field.required} onChange={(e) => update({ fields: fields.map((f) => f.id === field.id ? { ...f, required: e.target.checked } : f) })} className="rounded border-zinc-300" />
                <label htmlFor={`req-${field.id}`} className="text-xs font-medium">{t(T.required)}</label>
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" size="sm" className="w-full gap-2"
          onClick={() => update({ fields: [...fields, { id: nanoid(), label: t({ ar: 'حقل جديد', fr: 'Nouveau champ', en: 'New field' }), type: 'text', required: false } satisfies FormField] })}>
          <Plus size={14} />{t(T.addField)}
        </Button>
      </div>
    </div>
  )
}
