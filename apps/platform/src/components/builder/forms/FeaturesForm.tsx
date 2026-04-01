import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Plus, Trash2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const T = {
  features: { ar: 'المميزات', fr: 'Fonctionnalités', en: 'Features' },
  feature: { ar: 'ميزة', fr: 'Fonctionnalité', en: 'Feature' },
  icon: { ar: 'الأيقونة (رمز تعبيري)', fr: 'Icône (emoji)', en: 'Icon (emoji)' },
  title: { ar: 'العنوان', fr: 'Titre', en: 'Title' },
  description: { ar: 'الوصف', fr: 'Description', en: 'Description' },
  addFeature: { ar: 'إضافة ميزة', fr: 'Ajouter une fonctionnalité', en: 'Add feature' },
  delete: { ar: 'حذف', fr: 'Supprimer', en: 'Delete' },
  sectionTitle: { ar: 'عنوان القسم', fr: 'Titre de la section', en: 'Section title' },
}

export function FeaturesForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'features') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const items = section.items
  const update = (newItems: typeof items) => updateSection(section.id, { items: newItems })

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.features)}</p>

      <div className="space-y-1.5">
        <Label>{t(T.sectionTitle)}</Label>
        <Input dir={storeDir} value={section.title ?? ''} onChange={(e) => updateSection(section.id, { title: e.target.value })} />
      </div>

      {items.map((item, index) => (
        <div key={index} className="border border-border rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t(T.feature)} {index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => update(items.filter((_, i) => i !== index))} className="text-destructive h-7 w-7 p-0" aria-label={t(T.delete)}>
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.icon)}</Label>
            <Input value={item.icon} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, icon: e.target.value } : it))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.title)}</Label>
            <Input value={item.title} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, title: e.target.value } : it))} dir={storeDir} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.description)}</Label>
            <Textarea value={item.body} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, body: e.target.value } : it))} rows={2} className="resize-none" dir={storeDir} />
          </div>
        </div>
      ))}

      {items.length < 6 && (
        <Button variant="outline" size="sm" className="w-full gap-2"
          onClick={() => update([...items, { icon: '⭐', title: t({ ar: 'ميزة جديدة', fr: 'Nouvelle fonctionnalité', en: 'New feature' }), body: t({ ar: 'وصف الميزة', fr: 'Description', en: 'Feature description' }) }])}>
          <Plus size={14} />{t(T.addFeature)}
        </Button>
      )}
    </div>
  )
}
