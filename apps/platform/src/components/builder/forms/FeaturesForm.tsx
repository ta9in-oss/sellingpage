import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'

export function FeaturesForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'features') return null

  const items = section.items
  const update = (newItems: typeof items) => updateSection(section.id, { items: newItems })

  const addItem = () => {
    if (items.length >= 6) return
    update([...items, { icon: '⭐', title: 'ميزة جديدة', body: 'وصف الميزة' }])
  }

  const removeItem = (index: number) =>
    update(items.filter((_, i) => i !== index))

  const updateItem = (index: number, patch: Partial<(typeof items)[0]>) =>
    update(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))

  return (
    <div className="space-y-4 p-4">
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">المميزات</h2>

      {items.map((item, index) => (
        <div key={index} className="border border-zinc-200 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">ميزة {index + 1}</span>
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700 p-1"
              aria-label="حذف"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">الأيقونة</label>
            <input
              type="text"
              value={item.icon}
              onChange={(e) => updateItem(index, { icon: e.target.value })}
              className={cn(
                'w-full rounded border border-zinc-300 px-2 py-1 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900'
              )}
              dir="rtl"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">العنوان</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
              className={cn(
                'w-full rounded border border-zinc-300 px-2 py-1 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900'
              )}
              dir="rtl"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">الوصف</label>
            <textarea
              value={item.body}
              onChange={(e) => updateItem(index, { body: e.target.value })}
              rows={2}
              className={cn(
                'w-full rounded border border-zinc-300 px-2 py-1 text-sm resize-none',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900'
              )}
              dir="rtl"
            />
          </div>
        </div>
      ))}

      {items.length < 6 && (
        <button
          onClick={addItem}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-300',
            'rounded text-sm text-zinc-500 hover:border-zinc-500 hover:text-zinc-700 transition-colors'
          )}
        >
          <Plus size={14} />
          إضافة ميزة
        </button>
      )}
    </div>
  )
}
