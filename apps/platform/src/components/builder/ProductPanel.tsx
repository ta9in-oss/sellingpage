import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import { Plus, Package } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { ImageUpload } from './ImageUpload'

const T = {
  product: { ar: 'المنتج', fr: 'Produit', en: 'Product' },
  productName: { ar: 'اسم المنتج', fr: 'Nom du produit', en: 'Product name' },
  productNamePlaceholder: { ar: 'مثال: حقيبة ظهر فاخرة', fr: 'Ex: Sac à dos de luxe', en: 'Ex: Premium backpack' },
  price: { ar: 'السعر', fr: 'Prix', en: 'Price' },
  productImages: { ar: 'صور المنتج', fr: 'Images du produit', en: 'Product images' },
  addImage: { ar: 'إضافة صورة', fr: 'Ajouter une image', en: 'Add image' },
  imageN: { ar: 'صورة', fr: 'Image', en: 'Image' },
}

export function ProductPanel() {
  const { config, updateProduct } = useBuilderStore()
  const { t, dir } = useLang()
  const { name, price, currency, images } = config.product
  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'

  const updateImage = (i: number, val: string) => {
    const next = images.map((img, idx) => (idx === i ? val : img))
    updateProduct({ images: next })
  }

  const removeImage = (i: number) => {
    updateProduct({ images: images.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-5 p-4" dir={dir}>
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
          dir={storeDir}
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

      {/* Product Images — up to 3, each with upload widget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">{t(T.productImages)}</label>
          {images.length < 3 && (
            <button
              onClick={() => updateProduct({ images: [...images, ''] })}
              className="flex items-center gap-1 text-xs px-2 py-1 border border-zinc-200 rounded hover:border-zinc-900 transition-colors"
            >
              <Plus size={12} /> {t(T.addImage)}
            </button>
          )}
        </div>

        {images.map((img, i) => (
          <div key={i} className="border border-zinc-200 rounded p-3">
            <ImageUpload
              label={`${t(T.imageN)} ${i + 1}`}
              value={img}
              onChange={(url) => {
                if (!url) removeImage(i)
                else updateImage(i, url)
              }}
            />
          </div>
        ))}

        {images.length === 0 && (
          <button
            onClick={() => updateProduct({ images: [''] })}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-200 rounded text-sm text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <Plus size={14} /> {t(T.addImage)}
          </button>
        )}
      </div>
    </div>
  )
}
