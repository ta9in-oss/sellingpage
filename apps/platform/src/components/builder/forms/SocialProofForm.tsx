import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useLang } from '@/hooks/useLang'

const T = {
  socialProof: { ar: 'شريط الثقة', fr: 'Barre de confiance', en: 'Social Proof Bar' },
  hint: { ar: 'يعرض شريطاً يحتوي على التقييمات، عدد الطلبات، والضمانات. المحتوى ثابت.', fr: 'Affiche une barre avec avis, commandes et garanties. Contenu fixe.', en: 'Displays a bar with ratings, orders, and guarantees. Static content.' },
  ratingLabel: { ar: 'متوسط التقييم', fr: 'Note moyenne', en: 'Average rating' },
  reviewCountLabel: { ar: 'عدد التقييمات', fr: 'Nombre d\'avis', en: 'Review count' },
}

export function SocialProofForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'social-proof') return null

  const s = section as any
  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)
  const inputClass = 'w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.socialProof)}</h2>
      <p className="text-xs text-zinc-400 bg-zinc-50 p-3 rounded border border-zinc-200">{t(T.hint)}</p>
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.ratingLabel)}</label>
        <input type="number" min="1" max="5" step="0.1" value={s.rating ?? 4.9} onChange={(e) => update({ rating: parseFloat(e.target.value) })} className={inputClass} />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.reviewCountLabel)}</label>
        <input type="number" min="0" value={s.reviewCount ?? 300} onChange={(e) => update({ reviewCount: parseInt(e.target.value) })} className={inputClass} />
      </div>
    </div>
  )
}
