import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Package } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

const T = {
  product: { ar: 'المنتج', fr: 'Produit', en: 'Product' },
  productName: { ar: 'اسم المنتج', fr: 'Nom du produit', en: 'Product name' },
  productNamePlaceholder: { ar: 'مثال: حقيبة ظهر فاخرة', fr: 'Ex: Sac à dos de luxe', en: 'Ex: Premium backpack' },
  price: { ar: 'السعر', fr: 'Prix', en: 'Price' },
  productImages: { ar: 'صور المنتج', fr: 'Images du produit', en: 'Product images' },
  addImageUrl: { ar: 'إضافة رابط', fr: 'Ajouter un lien', en: 'Add URL' },
  noImages: { ar: 'أضف رابط صورة لعرض صور المنتج في المعاينة', fr: "Ajoutez une URL d'image pour afficher les images dans l'aperçu", en: 'Add an image URL to show product images in the preview' },
}

export function ProductPanel() {
  const { config, updateProduct } = useBuilderStore()
  const { t } = useLang()
  const { name, price, currency, images } = config.product

  const addImage = () => {
    updateProduct({ images: [...images, ''] })
  }

  const updateImage = (i: number, val: string) => {
    const next = images.map((img, idx) => (idx === i ? val : img))
    updateProduct({ images: next })
  }

  const removeImage = (i: number) => {
    updateProduct({ images: images.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-5 p-4" dir="rtl">
      <div className="flex items-center gap-2 pb-1 border-b border-zinc-100">
        <Package size={14} className="text-zinc-400" />
        <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.product)}</h2>
      </div>

      {/* Product Name */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.productName)}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => updateProduct({ name: e.target.value })}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          placeholder={t(T.productNamePlaceholder)}
          dir="rtl"
        />
      </div>

      {/* Price + Currency */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.price)}</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => updateProduct({ price: Number(e.target.value) })}
            className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            placeholder="2500"
          />
          <div className="flex rounded border border-zinc-300 overflow-hidden text-sm font-medium">
            {(['DZD', 'USD'] as const).map((c) => (
              <button
                key={c}
                onClick={() => updateProduct({ currency: c })}
                className={cn(
                  'px-3 py-2 transition-colors',
                  currency === c ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">{t(T.productImages)}</label>
          <button
            onClick={addImage}
            disabled={images.length >= 8}
            className={cn(
              'flex items-center gap-1 text-xs px-2 py-1 border border-zinc-200 rounded transition-colors',
              images.length >= 8 ? 'opacity-40 cursor-not-allowed' : 'hover:border-zinc-900'
            )}
          >
            <Plus size={12} /> {t(T.addImageUrl)}
          </button>
        </div>

        {images.length === 0 && (
          <p className="text-xs text-zinc-400 text-center py-3 border border-dashed border-zinc-200 rounded">
            {t(T.noImages)}
          </p>
        )}

        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => updateImage(i, e.target.value)}
                  className="w-full rounded border border-zinc-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  placeholder="https://example.com/image.jpg"
                  dir="ltr"
                />
                {img && (
                  <img
                    src={img}
                    alt=""
                    className="w-full h-20 object-cover rounded border border-zinc-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}
              </div>
              <button
                onClick={() => removeImage(i)}
                className="mt-1 text-red-400 hover:text-red-600 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
