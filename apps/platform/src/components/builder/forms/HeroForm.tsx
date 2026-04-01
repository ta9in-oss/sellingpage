import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '../ImageUpload'

const T = {
  heroSection: { ar: 'قسم البطل', fr: 'Section héros', en: 'Hero Section' },
  headline: { ar: 'العنوان الرئيسي', fr: 'Titre principal', en: 'Main headline' },
  subheadline: { ar: 'العنوان الفرعي', fr: 'Sous-titre', en: 'Subheadline' },
  ctaButton: { ar: 'نص الزر', fr: 'Texte du bouton', en: 'Button text' },
  heroImage: { ar: 'صورة المنتج', fr: 'Image du produit', en: 'Product image' },
}

export function HeroForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'hero') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.heroSection)}</p>

      <div className="space-y-1.5">
        <Label>{t(T.headline)}</Label>
        <Input
          value={section.headline}
          onChange={(e) => update({ headline: e.target.value })}
          dir={storeDir}
        />
      </div>

      <div className="space-y-1.5">
        <Label>{t(T.subheadline)}</Label>
        <Textarea
          value={section.subheadline}
          onChange={(e) => update({ subheadline: e.target.value })}
          rows={3}
          className="resize-none"
          dir={storeDir}
        />
      </div>

      <div className="space-y-1.5">
        <Label>{t(T.ctaButton)}</Label>
        <Input
          value={section.cta}
          onChange={(e) => update({ cta: e.target.value })}
          dir={storeDir}
        />
      </div>

      <ImageUpload
        label={t(T.heroImage)}
        value={section.image ?? ''}
        onChange={(url) => update({ image: url })}
      />
    </div>
  )
}
