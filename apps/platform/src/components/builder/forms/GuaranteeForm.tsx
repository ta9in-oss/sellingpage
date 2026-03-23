import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'

const ICON_OPTIONS = [
  { value: 'truck', label: '🚚 توصيل' },
  { value: 'refresh', label: '🔄 إرجاع' },
  { value: 'shield', label: '🛡️ ضمان' },
  { value: 'award', label: '🏆 جودة' },
  { value: 'credit', label: '💳 دفع' },
  { value: 'check', label: '✅ تأكيد' },
]

export function GuaranteeForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'guarantee') return null

  const items = section.items ?? []
  const update = (newItems: typeof items) => updateSection(section.id, { items: newItems })

  const updateItem = (i: number, patch: Partial<(typeof items)[0]>) => {
    const next = items.map((item, idx) => (idx === i ? { ...item, ...patch } : item))
    update(next)
  }

  const addItem = () => {
    if (items.length >= 6) return
    update([...items, { title: 'ضمان جديد', description: 'اكتب وصف الضمان هنا', icon: 'shield' }])
  }

  const removeItem = (i: number) => {
    if (items.length <= 1) return
    update(items.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">الضمانات</h2>
        <button
          onClick={addItem}
          disabled={items.length >= 6}
          className={cn(
            'flex items-center gap-1 text-xs px-2 py-1 border border-zinc-200 rounded transition-colors',
            items.length >= 6 ? 'opacity-40 cursor-not-allowed' : 'hover:border-zinc-900 hover:bg-zinc-50'
          )}
        >
          <Plus size={12} /> إضافة
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border border-zinc-200 rounded p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">ضمان {i + 1}</span>
              <button
                onClick={() => removeItem(i)}
                disabled={items.length <= 1}
                className="text-red-400 hover:text-red-600 disabled:opacity-30"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium">العنوان</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(i, { title: e.target.value })}
                className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                dir="rtl"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium">الوصف</label>
              <textarea
                value={item.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                rows={2}
                className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
                dir="rtl"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium">الأيقونة</label>
              <div className="grid grid-cols-3 gap-1">
                {ICON_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateItem(i, { icon: value })}
                    className={cn(
                      'text-xs px-2 py-1.5 rounded border transition-colors',
                      item.icon === value
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 hover:border-zinc-400'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
