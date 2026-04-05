import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const ICON_OPTIONS = [
  { value: 'truck', emoji: '🚚', label: { ar: 'توصيل', fr: 'Livraison', en: 'Delivery' } },
  { value: 'refresh', emoji: '🔄', label: { ar: 'إرجاع', fr: 'Retour', en: 'Return' } },
  { value: 'shield', emoji: '🛡️', label: { ar: 'ضمان', fr: 'Garantie', en: 'Guarantee' } },
  { value: 'award', emoji: '🏆', label: { ar: 'جودة', fr: 'Qualité', en: 'Quality' } },
  { value: 'credit', emoji: '💳', label: { ar: 'دفع', fr: 'Paiement', en: 'Payment' } },
  { value: 'check', emoji: '✅', label: { ar: 'تأكيد', fr: 'Confirmé', en: 'Confirmed' } },
]

const T = {
  guarantees: { ar: 'الضمانات', fr: 'Garanties', en: 'Guarantees' },
  sectionTitle: { ar: 'عنوان القسم', fr: 'Titre de la section', en: 'Section title' },
  guarantee: { ar: 'ضمان', fr: 'Garantie', en: 'Guarantee' },
  titleLabel: { ar: 'العنوان', fr: 'Titre', en: 'Title' },
  descriptionLabel: { ar: 'الوصف', fr: 'Description', en: 'Description' },
  iconLabel: { ar: 'الأيقونة', fr: 'Icône', en: 'Icon' },
  add: { ar: 'إضافة', fr: 'Ajouter', en: 'Add' },
  delete: { ar: 'حذف', fr: 'Supprimer', en: 'Delete' },
}

export function GuaranteeForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'guarantee') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const items = section.items ?? []
  const update = (newItems: typeof items) => updateSection(section.id, { items: newItems })

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.guarantees)}</p>
        <Button variant="outline" size="sm"
          onClick={() => { if (items.length < 6) update([...items, { title: t({ ar: 'ضمان جديد', fr: 'Nouvelle garantie', en: 'New guarantee' }), description: t({ ar: 'اكتب الوصف', fr: 'Description', en: 'Description' }), icon: 'shield' }]) }}
          disabled={items.length >= 6}
          className="gap-1">
          <Plus size={12} /> {t(T.add)}
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t(T.sectionTitle)}</Label>
        <Input
          value={section.title ?? ''}
          onChange={(e) => updateSection(section.id, { title: e.target.value })}
          dir={storeDir}
          placeholder={t({ ar: 'الضمانات ديالنا', fr: 'Nos garanties', en: 'Our guarantees' })}
        />
      </div>

      {items.map((item, i) => (
        <div key={i} className="border border-border rounded p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t(T.guarantee)} {i + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => { if (items.length > 1) update(items.filter((_, idx) => idx !== i)) }} disabled={items.length <= 1} className="text-destructive h-7 w-7 p-0"><Trash2 size={14} /></Button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.titleLabel)}</Label>
            <Input value={item.title} onChange={(e) => update(items.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))} dir={storeDir} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.descriptionLabel)}</Label>
            <Textarea value={item.description} onChange={(e) => update(items.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} rows={2} className="resize-none" dir={storeDir} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.iconLabel)}</Label>
            <div className="grid grid-cols-3 gap-1">
              {ICON_OPTIONS.map(({ value, emoji, label }) => (
                <button key={value} onClick={() => update(items.map((it, idx) => idx === i ? { ...it, icon: value } : it))}
                  className={cn('text-xs px-2 py-1.5 rounded border transition-colors flex items-center gap-1', item.icon === value ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 hover:border-zinc-400')}>
                  <span>{emoji}</span> <span>{t(label)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
