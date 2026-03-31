import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
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
  const inputClass = 'w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.heroSection)}</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.headline)}</label>
        <input
          type="text"
          value={section.headline}
          onChange={(e) => update({ headline: e.target.value })}
          className={inputClass}
          dir={storeDir}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.subheadline)}</label>
        <textarea
          value={section.subheadline}
          onChange={(e) => update({ subheadline: e.target.value })}
          rows={3}
          className={cn(inputClass, 'resize-none')}
          dir={storeDir}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.ctaButton)}</label>
        <input
          type="text"
          value={section.cta}
          onChange={(e) => update({ cta: e.target.value })}
          className={inputClass}
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
