import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { ImageIcon } from 'lucide-react'

const T = {
  heroSection: { ar: 'قسم البطل', fr: 'Section héros', en: 'Hero Section' },
  headline: { ar: 'العنوان الرئيسي', fr: 'Titre principal', en: 'Main headline' },
  subheadline: { ar: 'العنوان الفرعي', fr: 'Sous-titre', en: 'Subheadline' },
  ctaButton: { ar: 'نص الزر', fr: 'Texte du bouton', en: 'Button text' },
  heroImage: { ar: 'رابط صورة المنتج', fr: 'URL de l\'image produit', en: 'Product image URL' },
  heroImageHint: { ar: 'الصق رابط الصورة (https://...)', fr: 'Collez l\'URL de l\'image', en: 'Paste an image URL (https://...)' },
  imagePreview: { ar: 'معاينة الصورة', fr: 'Aperçu de l\'image', en: 'Image preview' },
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

      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.heroImage)}</label>
        <input
          type="url"
          value={section.image ?? ''}
          onChange={(e) => update({ image: e.target.value })}
          placeholder="https://..."
          className={inputClass}
          dir="ltr"
        />
        <p className="text-[11px] text-zinc-400">{t(T.heroImageHint)}</p>
        {section.image ? (
          <img
            src={section.image}
            alt={t(T.imagePreview)}
            className="mt-2 w-full h-32 object-cover rounded border border-zinc-200"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="mt-2 w-full h-20 border-2 border-dashed border-zinc-200 rounded flex items-center justify-center text-zinc-300">
            <ImageIcon size={24} />
          </div>
        )}
      </div>
    </div>
  )
}
