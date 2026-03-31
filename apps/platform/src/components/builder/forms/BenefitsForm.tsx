import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

const T = {
  benefits: { ar: 'فوائد المنتج', fr: 'Avantages du produit', en: 'Product Benefits' },
  benefit: { ar: 'فائدة', fr: 'Avantage', en: 'Benefit' },
  icon: { ar: 'الأيقونة (رمز)', fr: 'Icône (emoji)', en: 'Icon (emoji)' },
  title: { ar: 'العنوان', fr: 'Titre', en: 'Title' },
  description: { ar: 'الوصف', fr: 'Description', en: 'Description' },
  add: { ar: 'إضافة فائدة', fr: 'Ajouter un avantage', en: 'Add benefit' },
  delete: { ar: 'حذف', fr: 'Supprimer', en: 'Delete' },
}

export function BenefitsForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'benefits') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const items: { icon: string; title: string; description: string }[] = (section as any).items ?? []
  const update = (newItems: typeof items) => updateSection(section.id, { items: newItems })
  const inputClass = 'w-full rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.benefits)}</h2>

      {items.map((item, index) => (
        <div key={index} className="border border-zinc-200 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">{t(T.benefit)} {index + 1}</span>
            <button onClick={() => update(items.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 p-1" aria-label={t(T.delete)}><Trash2 size={14} /></button>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.icon)}</label>
            <input type="text" value={item.icon} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, icon: e.target.value } : it))} className={cn(inputClass, 'text-lg')} style={{ fontFamily: 'Segoe UI Emoji, sans-serif' }} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.title)}</label>
            <input type="text" value={item.title} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, title: e.target.value } : it))} className={inputClass} dir={storeDir} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.description)}</label>
            <input type="text" value={item.description} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, description: e.target.value } : it))} className={inputClass} dir={storeDir} />
          </div>
        </div>
      ))}

      {items.length < 6 && (
        <button onClick={() => update([...items, { icon: '✅', title: t({ ar: 'فائدة جديدة', fr: 'Nouvel avantage', en: 'New benefit' }), description: t({ ar: 'وصف الفائدة', fr: 'Description', en: 'Description' }) }])}
          className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-300 rounded text-sm text-zinc-500 hover:border-zinc-500 transition-colors">
          <Plus size={14} />{t(T.add)}
        </button>
      )}
    </div>
  )
}
