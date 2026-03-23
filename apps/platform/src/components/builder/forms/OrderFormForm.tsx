import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { FormField } from '@7aba/store-ui'

export function OrderFormForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'order-form') return null

  const fields = section.fields
  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)

  const addField = () => {
    update({
      fields: [
        ...fields,
        { id: nanoid(), label: 'حقل جديد', type: 'text', required: false } satisfies FormField,
      ],
    })
  }

  const removeField = (id: string) =>
    update({ fields: fields.filter((f) => f.id !== id) })

  const updateField = (id: string, patch: Partial<FormField>) =>
    update({ fields: fields.map((f) => (f.id === id ? { ...f, ...patch } : f)) })

  return (
    <div className="space-y-4 p-4">
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">نموذج الطلب</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium">نص زر الإرسال</label>
        <input
          type="text"
          value={section.submitLabel}
          onChange={(e) => update({ submitLabel: e.target.value })}
          className={cn(
            'w-full rounded border border-zinc-300 px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900'
          )}
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">الحقول</label>

        {fields.map((field) => (
          <div key={field.id} className="border border-zinc-200 rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">حقل</span>
              <button
                onClick={() => removeField(field.id)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="حذف"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium">التسمية</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                className={cn(
                  'w-full rounded border border-zinc-300 px-2 py-1 text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900'
                )}
                dir="rtl"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-medium">النوع</label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    updateField(field.id, {
                      type: e.target.value as FormField['type'],
                    })
                  }
                  className={cn(
                    'w-full rounded border border-zinc-300 px-2 py-1 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900'
                  )}
                >
                  <option value="text">نص</option>
                  <option value="phone">هاتف</option>
                  <option value="select">قائمة</option>
                </select>
              </div>

              <div className="flex items-end pb-1 gap-1">
                <input
                  type="checkbox"
                  id={`req-${field.id}`}
                  checked={field.required}
                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  className="rounded border-zinc-300"
                />
                <label htmlFor={`req-${field.id}`} className="text-xs font-medium">
                  إلزامي
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addField}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-300',
            'rounded text-sm text-zinc-500 hover:border-zinc-500 hover:text-zinc-700 transition-colors'
          )}
        >
          <Plus size={14} />
          إضافة حقل
        </button>
      </div>
    </div>
  )
}
