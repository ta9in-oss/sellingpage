import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Star } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const T = {
  testimonials: { ar: 'آراء العملاء', fr: 'Avis clients', en: 'Testimonials' },
  sectionTitle: { ar: 'عنوان القسم', fr: 'Titre de la section', en: 'Section title' },
  review: { ar: 'رأي', fr: 'Avis', en: 'Review' },
  customerName: { ar: 'اسم العميل', fr: 'Nom du client', en: 'Customer name' },
  location: { ar: 'المدينة/الولاية', fr: 'Ville/Wilaya', en: 'City/Region' },
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

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.testimonials)}</p>

      <div className="space-y-1.5">
        <Label className="text-xs">{t(T.sectionTitle)}</Label>
        <Input
          value={section.title ?? ''}
          onChange={(e) => updateSection(section.id, { title: e.target.value })}
          dir={storeDir}
          placeholder={t({ ar: 'ما قالوا الزبائن', fr: 'Avis de nos clients', en: 'What customers say' })}
        />
      </div>

      {items.map((item, index) => (
        <div key={index} className="border border-border rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t(T.review)} {index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => update(items.filter((_, i) => i !== index))} className="text-destructive h-7 w-7 p-0" aria-label={t(T.delete)}>
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.customerName)}</Label>
            <Input value={item.name} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, name: e.target.value } : it))} dir={storeDir} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.location)}</Label>
            <Input value={item.location ?? ''} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, location: e.target.value } : it))} dir={storeDir} placeholder={t({ ar: 'الجزائر العاصمة', fr: 'Alger', en: 'Algiers' })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.reviewText)}</Label>
            <Textarea value={item.text} onChange={(e) => update(items.map((it, i) => i === index ? { ...it, text: e.target.value } : it))} rows={2} className="resize-none" dir={storeDir} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t(T.rating)}</Label>
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
        <Button variant="outline" size="sm" className="w-full gap-2"
          onClick={() => update([...items, { name: t({ ar: 'عميل جديد', fr: 'Nouveau client', en: 'New customer' }), text: t({ ar: 'تجربة رائعة!', fr: 'Expérience fantastique!', en: 'Amazing experience!' }), rating: 5, location: '' }])}>
          <Plus size={14} />{t(T.addReview)}
        </Button>
      )}
    </div>
  )
}
