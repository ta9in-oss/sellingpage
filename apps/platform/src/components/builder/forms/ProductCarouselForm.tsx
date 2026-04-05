import { useLang } from '@/hooks/useLang'
import { Package } from 'lucide-react'

const T = {
  title: { ar: 'صور المنتج', fr: 'Carrousel produit', en: 'Product Carousel' },
  note: { ar: 'يعرض هذا القسم صور المنتج التي تضيفها من لوحة "المنتج" في الشريط العلوي. أضف صور المنتج من هناك.', fr: 'Cette section affiche les images du produit ajoutées via l\'onglet "Produit". Ajoutez les images depuis là.', en: 'This section displays product images added via the "Product" tab. Add images from there.' },
  goToProduct: { ar: 'لوحة المنتج ← في الشريط الجانبي', fr: 'Panneau Produit ← dans la barre latérale', en: 'Product Panel ← in the right sidebar' },
}

interface ProductCarouselFormProps {
  sectionId: string
}

export function ProductCarouselForm({ sectionId: _ }: ProductCarouselFormProps) {
  const { t, dir } = useLang()

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(T.title)}</p>
      <div className="flex gap-3 p-3 rounded-md bg-muted border border-border">
        <Package size={16} className="text-muted-foreground shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-foreground">{t(T.note)}</p>
          <p className="text-xs font-mono text-muted-foreground">{t(T.goToProduct)}</p>
        </div>
      </div>
    </div>
  )
}
