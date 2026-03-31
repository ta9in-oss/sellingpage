import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

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
  const inputClass = 'w-full rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.faq)}</h2>

      {items.map((item, index) => (
        <div key={index} className="border border-zinc-200 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">{t(T.question)} {index + 1}</span>
            <button onClick={() => update(items.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 p-1" aria-label={t(T.delete)}>
              <Trash2 size={14} />
            </button>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.questionLabel)}</label>
            <input type="text" value={item.q} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, q: e.target.value } : it))} className={inputClass} dir={storeDir} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.answerLabel)}</label>
            <textarea value={item.a} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, a: e.target.value } : it))} rows={3} className={cn(inputClass, 'resize-none')} dir={storeDir} />
          </div>
        </div>
      ))}

      {items.length < 10 && (
        <button onClick={() => update([...items, { q: t({ ar: 'سؤال جديد؟', fr: 'Nouvelle question?', en: 'New question?' }), a: t({ ar: 'الإجابة هنا.', fr: 'La réponse ici.', en: 'Answer here.' }) }])}
          className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-300 rounded text-sm text-zinc-500 hover:border-zinc-500 transition-colors">
          <Plus size={14} />{t(T.addQuestion)}
        </button>
      )}
    </div>
  )
}
