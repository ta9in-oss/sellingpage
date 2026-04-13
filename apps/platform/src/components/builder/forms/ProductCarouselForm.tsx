import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useLang } from '@/hooks/useLang'
import { ImagePicker } from '../ImagePicker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const T = {
  title: { ar: 'صور المنتج', fr: 'Carrousel produit', en: 'Product Carousel' },
  sectionTitle: { ar: 'عنوان القسم (اختياري)', fr: 'Titre de section (optionnel)', en: 'Section title (optional)' },
  selectImages: { ar: 'اختر الصور التي ستظهر (اتركها فارغة لعرض الكل)', fr: 'Choisissez les images à afficher (vide = toutes)', en: 'Select images to show (empty = show all)' },
}

interface ProductCarouselFormProps {
  sectionId: string
}

export function ProductCarouselForm({ sectionId }: ProductCarouselFormProps) {
  const { config, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section || section.type !== 'product-carousel') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const selectedImages: string[] = section.images ?? []

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.title)}</p>

      <div className="space-y-1.5">
        <Label>{t(T.sectionTitle)}</Label>
        <Input
          value={section.title ?? ''}
          onChange={(e) => updateSection(sectionId, { title: e.target.value || undefined })}
          dir={storeDir}
          placeholder="-"
        />
      </div>

      <ImagePicker
        mode="multi"
        label={t(T.selectImages)}
        value={selectedImages}
        onChange={(urls) => updateSection(sectionId, { images: urls.length > 0 ? urls : undefined })}
      />
    </div>
  )
}
