import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { FormField } from '@7aba/store-ui'
import { useLang } from '@/hooks/useLang'

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
  const inputClass = 'w-full rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.orderForm)}</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.submitLabel)}</label>
        <input type="text" value={section.submitLabel} onChange={(e) => update({ submitLabel: e.target.value })} className={inputClass} dir={storeDir} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t(T.fields)}</label>

        {fields.map((field) => (
          <div key={field.id} className="border border-zinc-200 rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">{t(T.field)}</span>
              <button onClick={() => update({ fields: fields.filter((f) => f.id !== field.id) })} className="text-red-500 hover:text-red-700 p-1" aria-label={t(T.delete)}>
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">{t(T.fieldLabel)}</label>
              <input type="text" value={field.label} onChange={(e) => update({ fields: fields.map((f) => f.id === field.id ? { ...f, label: e.target.value } : f) })} className={inputClass} dir={storeDir} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-medium">{t(T.fieldType)}</label>
                <select value={field.type} onChange={(e) => update({ fields: fields.map((f) => f.id === field.id ? { ...f, type: e.target.value as FormField['type'] } : f) })} className={inputClass}>
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

        <button onClick={() => update({ fields: [...fields, { id: nanoid(), label: t({ ar: 'حقل جديد', fr: 'Nouveau champ', en: 'New field' }), type: 'text', required: false } satisfies FormField] })}
          className={cn('w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-300 rounded text-sm text-zinc-500 hover:border-zinc-500 transition-colors')}>
          <Plus size={14} />{t(T.addField)}
        </button>
      </div>
    </div>
  )
}
