import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'

export function HeroForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'hero') return null

  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)

  return (
    <div className="space-y-4 p-4">
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">قسم البطل</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium">العنوان الرئيسي</label>
        <input
          type="text"
          value={section.headline}
          onChange={(e) => update({ headline: e.target.value })}
          className={cn(
            'w-full rounded border border-zinc-300 px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900'
          )}
          dir="rtl"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">العنوان الفرعي</label>
        <textarea
          value={section.subheadline}
          onChange={(e) => update({ subheadline: e.target.value })}
          rows={3}
          className={cn(
            'w-full rounded border border-zinc-300 px-3 py-2 text-sm resize-none',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900'
          )}
          dir="rtl"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">نص الزر</label>
        <input
          type="text"
          value={section.cta}
          onChange={(e) => update({ cta: e.target.value })}
          className={cn(
            'w-full rounded border border-zinc-300 px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900'
          )}
          dir="rtl"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">رابط الصورة</label>
        <input
          type="url"
          value={section.image ?? ''}
          onChange={(e) => update({ image: e.target.value })}
          placeholder="https://..."
          className={cn(
            'w-full rounded border border-zinc-300 px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900'
          )}
          dir="ltr"
        />
        {section.image && (
          <img
            src={section.image}
            alt="معاينة الصورة"
            className="mt-2 w-full h-32 object-cover rounded border border-zinc-200"
          />
        )}
      </div>
    </div>
  )
}
