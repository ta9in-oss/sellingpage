import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Star } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

const T = {
  testimonials: { ar: 'آراء العملاء', fr: 'Avis clients', en: 'Testimonials' },
  review: { ar: 'رأي', fr: 'Avis', en: 'Review' },
  customerName: { ar: 'اسم العميل', fr: 'Nom du client', en: 'Customer name' },
  reviewText: { ar: 'نص الرأي', fr: 'Texte de l\'avis', en: 'Review text' },
  rating: { ar: 'التقييم', fr: 'Note', en: 'Rating' },
  addReview: { ar: 'إضافة رأي', fr: 'Ajouter un avis', en: 'Add review' },
  delete: { ar: 'حذف', fr: 'Supprimer', en: 'Delete' },
  stars: { ar: 'نجوم', fr: 'étoiles', en: 'stars' },
}

export function TestimonialsForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'testimonials') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const items = section.items
  const update = (newItems: typeof items) => updateSection(section.id, { items: newItems })
  const inputClass = 'w-full rounded border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.testimonials)}</h2>

      {items.map((item, index) => (
        <div key={index} className="border border-zinc-200 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">{t(T.review)} {index + 1}</span>
            <button onClick={() => update(items.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 p-1" aria-label={t(T.delete)}>
              <Trash2 size={14} />
            </button>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.customerName)}</label>
            <input type="text" value={item.name} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, name: e.target.value } : it))} className={inputClass} dir={storeDir} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.reviewText)}</label>
            <textarea value={item.text} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, text: e.target.value } : it))} rows={2} className={cn(inputClass, 'resize-none')} dir={storeDir} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">{t(T.rating)}</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <button key={star} onClick={() => update(items.map((it, i) => i === index ? { ...it, rating: star } : it))} className="p-0.5" aria-label={`${star} ${t(T.stars)}`}>
                  <Star size={18} className={cn(star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300')} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {items.length < 8 && (
        <button onClick={() => update([...items, { name: t({ ar: 'عميل جديد', fr: 'Nouveau client', en: 'New customer' }), text: t({ ar: 'تجربة رائعة!', fr: 'Expérience fantastique!', en: 'Amazing experience!' }), rating: 5 }])}
          className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-300 rounded text-sm text-zinc-500 hover:border-zinc-500 transition-colors">
          <Plus size={14} />{t(T.addReview)}
        </button>
      )}
    </div>
  )
}
