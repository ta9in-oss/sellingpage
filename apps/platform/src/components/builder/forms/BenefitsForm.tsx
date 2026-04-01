import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Plus, Trash2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.benefits)}</p>

      {items.map((item, index) => (
        <div key={index} className="border border-border rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t(T.benefit)} {index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => update(items.filter((_, i) => i !== index))} className="text-destructive h-7 w-7 p-0" aria-label={t(T.delete)}><Trash2 size={14} /></Button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.icon)}</Label>
            <Input value={item.icon} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, icon: e.target.value } : it))} className="text-lg" style={{ fontFamily: 'Segoe UI Emoji, sans-serif' }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.title)}</Label>
            <Input value={item.title} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, title: e.target.value } : it))} dir={storeDir} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.description)}</Label>
            <Input value={item.description} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, description: e.target.value } : it))} dir={storeDir} />
          </div>
        </div>
      ))}

      {items.length < 6 && (
        <Button variant="outline" size="sm" className="w-full gap-2"
          onClick={() => update([...items, { icon: '✅', title: t({ ar: 'فائدة جديدة', fr: 'Nouvel avantage', en: 'New benefit' }), description: t({ ar: 'وصف الفائدة', fr: 'Description', en: 'Description' }) }])}>
          <Plus size={14} />{t(T.add)}
        </Button>
      )}
    </div>
  )
}
