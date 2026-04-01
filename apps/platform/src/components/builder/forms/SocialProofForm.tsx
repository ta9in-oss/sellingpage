import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.socialProof)}</p>
      <p className="text-xs text-muted-foreground bg-muted p-3 rounded border">{t(T.hint)}</p>
      <div className="space-y-1.5">
        <Label>{t(T.ratingLabel)}</Label>
        <Input type="number" min="1" max="5" step="0.1" value={s.rating ?? 4.9} onChange={(e) => update({ rating: parseFloat(e.target.value) })} />
      </div>
      <div className="space-y-1.5">
        <Label>{t(T.reviewCountLabel)}</Label>
        <Input type="number" min="0" value={s.reviewCount ?? 300} onChange={(e) => update({ reviewCount: parseInt(e.target.value) })} />
      </div>
    </div>
  )
}
