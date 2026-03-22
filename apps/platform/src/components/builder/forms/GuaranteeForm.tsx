import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { ShieldCheck, Award, ThumbsUp, Clock, RefreshCw } from 'lucide-react'

const ICON_OPTIONS = [
  { value: 'shield', label: 'درع', Icon: ShieldCheck },
  { value: 'award', label: 'جائزة', Icon: Award },
  { value: 'thumbsup', label: 'إعجاب', Icon: ThumbsUp },
  { value: 'clock', label: 'وقت', Icon: Clock },
  { value: 'refresh', label: 'تجديد', Icon: RefreshCw },
]

export function GuaranteeForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'guarantee') return null

  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)

  return (
    <div className="space-y-4 p-4">
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">الضمان</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium">نص الضمان</label>
        <textarea
          value={section.text}
          onChange={(e) => update({ text: e.target.value })}
          rows={4}
          className={cn(
            'w-full rounded border border-zinc-300 px-3 py-2 text-sm resize-none',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900'
          )}
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">الأيقونة</label>
        <div className="grid grid-cols-5 gap-2">
          {ICON_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => update({ icon: value })}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded border text-xs transition-colors',
                section.icon === value
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 hover:border-zinc-400'
              )}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
