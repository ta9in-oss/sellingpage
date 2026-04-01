import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const T = {
  cta: { ar: 'قسم الدعوة للعمل', fr: 'Section CTA', en: 'Call-to-Action Section' },
  headline: { ar: 'العنوان', fr: 'Titre', en: 'Headline' },
  subheadline: { ar: 'النص الفرعي', fr: 'Sous-titre', en: 'Subheadline' },
  buttonText: { ar: 'نص الزر', fr: 'Texte du bouton', en: 'Button text' },
}

export function CtaForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'cta') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const s = section as any
  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.cta)}</p>
      <div className="space-y-1.5">
        <Label>{t(T.headline)}</Label>
        <Input value={s.headline ?? ''} onChange={(e) => update({ headline: e.target.value })} dir={storeDir} />
      </div>
      <div className="space-y-1.5">
        <Label>{t(T.subheadline)}</Label>
        <Input value={s.subheadline ?? ''} onChange={(e) => update({ subheadline: e.target.value })} dir={storeDir} />
      </div>
      <div className="space-y-1.5">
        <Label>{t(T.buttonText)}</Label>
        <Input value={s.cta ?? ''} onChange={(e) => update({ cta: e.target.value })} dir={storeDir} />
      </div>
    </div>
  )
}
