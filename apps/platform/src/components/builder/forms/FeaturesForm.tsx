import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

const T = {
  features: { ar: 'المميزات', fr: 'Fonctionnalités', en: 'Features' },
  feature: { ar: 'ميزة', fr: 'Fonctionnalité', en: 'Feature' },
  icon: { ar: 'الأيقونة (رمز تعبيري)', fr: 'Icône (emoji)', en: 'Icon (emoji)' },
  title: { ar: 'العنوان', fr: 'Titre', en: 'Title' },
  description: { ar: 'الوصف', fr: 'Description', en: 'Description' },
  addFeature: { ar: 'إضافة ميزة', fr: 'Ajouter une fonctionnalité', en: 'Add feature' },
  delete: { ar: 'حذف', fr: 'Supprimer', en: 'Delete' },
}

export function FeaturesForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'features') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const items = section.items
  const update = (newItems: typeof items) => updateSection(section.id, { items: newItems })
  const inputClass = 'w-full rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.features)}</h2>

      {items.map((item, index) => (
        <div key={index} className="border border-zinc-200 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">{t(T.feature)} {index + 1}</span>
            <button onClick={() => update(items.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 p-1" aria-label={t(T.delete)}>
              <Trash2 size={14} />
            </button>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.icon)}</label>
            <input type="text" value={item.icon} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, icon: e.target.value } : it))} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.title)}</label>
            <input type="text" value={item.title} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, title: e.target.value } : it))} className={inputClass} dir={storeDir} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.description)}</label>
            <textarea value={item.body} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, body: e.target.value } : it))} rows={2} className={cn(inputClass, 'resize-none')} dir={storeDir} />
          </div>
        </div>
      ))}

      {items.length < 6 && (
        <button onClick={() => update([...items, { icon: '⭐', title: t({ ar: 'ميزة جديدة', fr: 'Nouvelle fonctionnalité', en: 'New feature' }), body: t({ ar: 'وصف الميزة', fr: 'Description', en: 'Feature description' }) }])}
          className={cn('w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-300 rounded text-sm text-zinc-500 hover:border-zinc-500 hover:text-zinc-700 transition-colors')}>
          <Plus size={14} />{t(T.addFeature)}
        </button>
      )}
    </div>
  )
}
