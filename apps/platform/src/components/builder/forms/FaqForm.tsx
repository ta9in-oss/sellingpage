import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Plus, Trash2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const T = {
  faq: { ar: 'الأسئلة الشائعة', fr: 'FAQ', en: 'FAQ' },
  question: { ar: 'سؤال', fr: 'Question', en: 'Question' },
  questionLabel: { ar: 'السؤال', fr: 'La question', en: 'Question' },
  answerLabel: { ar: 'الإجابة', fr: 'La réponse', en: 'Answer' },
  addQuestion: { ar: 'إضافة سؤال', fr: 'Ajouter une question', en: 'Add question' },
  delete: { ar: 'حذف', fr: 'Supprimer', en: 'Delete' },
}

export function FaqForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'faq') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const items = section.items
  const update = (newItems: typeof items) => updateSection(section.id, { items: newItems })

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.faq)}</p>

      {items.map((item, index) => (
        <div key={index} className="border border-border rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t(T.question)} {index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => update(items.filter((_, i) => i !== index))} className="text-destructive h-7 w-7 p-0" aria-label={t(T.delete)}>
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.questionLabel)}</Label>
            <Input value={item.q} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, q: e.target.value } : it))} dir={storeDir} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.answerLabel)}</Label>
            <Textarea value={item.a} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, a: e.target.value } : it))} rows={3} className="resize-none" dir={storeDir} />
          </div>
        </div>
      ))}

      {items.length < 10 && (
        <Button variant="outline" size="sm" className="w-full gap-2"
          onClick={() => update([...items, { q: t({ ar: 'سؤال جديد؟', fr: 'Nouvelle question?', en: 'New question?' }), a: t({ ar: 'الإجابة هنا.', fr: 'La réponse ici.', en: 'Answer here.' }) }])}>
          <Plus size={14} />{t(T.addQuestion)}
        </Button>
      )}
    </div>
  )
}
