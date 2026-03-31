import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLang } from '@/hooks/useLang'

const T = {
  title: { ar: 'صور المنتج', fr: 'Carrousel produit', en: 'Product Carousel' },
  carouselTitle: { ar: 'عنوان القسم', fr: 'Titre de la section', en: 'Section title' },
  note: { ar: 'يعرض هذا القسم صور المنتج المضافة في لوحة المنتج', fr: 'Cette section affiche les images du produit ajoutées dans le panneau produit', en: 'This section displays product images added in the product panel' },
}

interface ProductCarouselFormProps {
  sectionId: string
}

export function ProductCarouselForm({ sectionId }: ProductCarouselFormProps) {
  const { config, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'

  const section = config.sections.find((s) => s.id === sectionId) as any
  if (!section) return null

  return (
    <div className="space-y-4" dir={dir}>
      <h3 className="font-semibold text-sm">{t(T.title)}</h3>
      <p className="text-xs text-gray-500">{t(T.note)}</p>

      <div className="space-y-1">
        <Label className="text-xs">{t(T.carouselTitle)}</Label>
        <Input
          dir={storeDir}
          value={section.title ?? ''}
          onChange={(e) => updateSection(sectionId, { title: e.target.value })}
          className="text-sm"
        />
      </div>
    </div>
  )
}
