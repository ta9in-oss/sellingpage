import { useRef, useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useStoreMedia } from '@/hooks/useStoreMedia'
import { cn } from '@/lib/utils'
import { Plus, Package, X, ChevronUp, ChevronDown, Upload, Loader2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { ImagePicker } from './ImagePicker'

const MAX_IMAGES = 6

const T = {
  product: { ar: 'المنتج', fr: 'Produit', en: 'Product' },
  productName: { ar: 'اسم المنتج', fr: 'Nom du produit', en: 'Product name' },
  productNamePlaceholder: { ar: 'مثال: حقيبة ظهر فاخرة', fr: 'Ex: Sac à dos de luxe', en: 'Ex: Premium backpack' },
  price: { ar: 'السعر', fr: 'Prix', en: 'Price' },
  productImages: { ar: 'صور المنتج', fr: 'Images du produit', en: 'Product images' },
  addImage: { ar: 'إضافة صورة', fr: 'Ajouter une image', en: 'Add image' },
  editImage: { ar: 'تعديل الصورة', fr: 'Modifier l\'image', en: 'Edit image' },
  imageN: { ar: 'صورة', fr: 'Image', en: 'Image' },
  maxReached: { ar: `الحد الأقصى ${MAX_IMAGES} صور`, fr: `Maximum ${MAX_IMAGES} images`, en: `Max ${MAX_IMAGES} images` },
  noImages: { ar: 'لا توجد صور بعد. أضف صوراً لتظهر في الأقسام', fr: 'Aucune image. Ajoutez-en pour les sections', en: 'No images yet. Add some to use in sections' },
  usedIn: { ar: 'تُستخدم في: البطل، العرض، استمارة الطلب', fr: 'Utilisé dans : Héros, Carrousel, Commande', en: 'Used in: Hero, Carousel, Order form' },
  bulkUpload: { ar: 'رفع عدة صور دفعة واحدة', fr: 'Téléverser plusieurs images', en: 'Upload multiple images' },
  bulkHint: { ar: 'اسحب عدة صور أو انقر لاختيارها معاً', fr: 'Glissez plusieurs images ou cliquez', en: 'Drop several images or click to pick many' },
  uploading: { ar: 'جارٍ الرفع…', fr: 'Téléversement…', en: 'Uploading…' },
}

export function ProductPanel() {
  const { config, updateProduct } = useBuilderStore()
  const { t, dir } = useLang()
  const { name, price, currency, images } = config.product
  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const { storeId } = useBuilderStore()
  const { uploadMany } = useStoreMedia(storeId)
  const bulkInputRef = useRef<HTMLInputElement>(null)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkDragging, setBulkDragging] = useState(false)

  const remainingSlots = MAX_IMAGES - images.filter(Boolean).length

  const handleBulk = async (files: File[]) => {
    if (!storeId || files.length === 0) return
    const imgs = files.filter((f) => f.type.startsWith('image/')).slice(0, remainingSlots)
    if (imgs.length === 0) return
    setBulkUploading(true)
    try {
      const urls = await uploadMany(imgs)
      if (urls.length) {
        const kept = images.filter(Boolean)
        updateProduct({ images: [...kept, ...urls].slice(0, MAX_IMAGES) })
      }
    } finally {
      setBulkUploading(false)
    }
  }

  const addImage = () => {
    if (images.length >= MAX_IMAGES) return
    updateProduct({ images: [...images, ''] })
    setEditingIndex(images.length)
  }

  const updateImage = (i: number, val: string) => {
    const next = images.map((img, idx) => (idx === i ? val : img))
    updateProduct({ images: next })
    if (val) setEditingIndex(null)
  }

  const removeImage = (i: number) => {
    updateProduct({ images: images.filter((_, idx) => idx !== i) })
    setEditingIndex(null)
  }

  const moveImage = (i: number, dir: 'up' | 'down') => {
    const next = [...images]
    const swap = dir === 'up' ? i - 1 : i + 1
    ;[next[i], next[swap]] = [next[swap], next[i]]
    updateProduct({ images: next })
  }

  const filledImages = images.filter(Boolean)

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

      {/* Product Images */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium">{t(T.productImages)}</label>
            <p className="text-[10px] text-zinc-400 mt-0.5">{t(T.usedIn)}</p>
          </div>
          {filledImages.length < MAX_IMAGES && (
            <button
              onClick={addImage}
              className="flex items-center gap-1 text-xs px-2 py-1 border border-zinc-200 rounded hover:border-zinc-900 transition-colors shrink-0"
            >
              <Plus size={12} /> {t(T.addImage)}
            </button>
          )}
          {filledImages.length >= MAX_IMAGES && (
            <span className="text-[10px] text-zinc-400">{t(T.maxReached)}</span>
          )}
        </div>

        {/* Bulk upload — many at once (store required; falls back to single ImageUpload before a store exists) */}
        {storeId && remainingSlots > 0 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setBulkDragging(true) }}
            onDragLeave={() => setBulkDragging(false)}
            onDrop={(e) => { e.preventDefault(); setBulkDragging(false); handleBulk(Array.from(e.dataTransfer.files)) }}
            onClick={() => !bulkUploading && bulkInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-1 p-3 border-2 border-dashed rounded cursor-pointer transition-colors',
              bulkDragging ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400',
            )}
          >
            {bulkUploading ? <Loader2 size={16} className="animate-spin text-zinc-500" /> : <Upload size={16} className="text-zinc-400" />}
            <p className="text-xs text-zinc-600 font-medium">{bulkUploading ? t(T.uploading) : t(T.bulkUpload)}</p>
            <p className="text-[10px] text-zinc-400 text-center">{t(T.bulkHint)}</p>
            <input
              ref={bulkInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { handleBulk(Array.from(e.target.files ?? [])); e.target.value = '' }}
            />
          </div>
        )}

        {/* Thumbnail grid */}
        {filledImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => {
              if (!img) return null
              const isEditing = editingIndex === i
              return (
                <div key={i} className="group relative">
                  <button
                    onClick={() => setEditingIndex(isEditing ? null : i)}
                    className={cn(
                      'w-full aspect-square rounded overflow-hidden border-2 transition-all',
                      isEditing ? 'border-zinc-900' : 'border-zinc-200 hover:border-zinc-400'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                  {/* Overlay controls: reorder + delete */}
                  <div className="absolute top-0.5 end-0.5 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removeImage(i)}
                      className="bg-red-500 text-white rounded p-0.5"
                      title="Remove"
                    ><X size={10} /></button>
                  </div>
                  <div className="absolute bottom-0.5 end-0.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {i > 0 && (
                      <button
                        onClick={() => moveImage(i, 'up')}
                        className="bg-black/60 text-white rounded p-0.5"
                        title="Move left"
                      ><ChevronUp size={10} /></button>
                    )}
                    {i < images.filter(Boolean).length - 1 && (
                      <button
                        onClick={() => moveImage(i, 'down')}
                        className="bg-black/60 text-white rounded p-0.5"
                        title="Move right"
                      ><ChevronDown size={10} /></button>
                    )}
                  </div>
                  {/* Edit overlay */}
                  {isEditing && (
                    <div className="col-span-3 mt-1 border border-zinc-200 rounded p-2 bg-white absolute inset-x-0 top-full z-10 shadow-lg">
                      <ImagePicker
                        mode="single"
                        value={img}
                        onChange={(url) => {
                          if (!url) removeImage(i)
                          else updateImage(i, url)
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Edit panel for selected image */}
        {editingIndex !== null && images[editingIndex] && (
          <div className="border border-zinc-200 rounded p-3 bg-zinc-50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium">{t(T.editImage)} {editingIndex + 1}</p>
              <button onClick={() => setEditingIndex(null)} className="text-zinc-400 hover:text-zinc-700">
                <X size={12} />
              </button>
            </div>
            <ImagePicker
              mode="single"
              value={images[editingIndex]}
              onChange={(url) => {
                if (!url) removeImage(editingIndex)
                else updateImage(editingIndex, url)
              }}
            />
          </div>
        )}

        {/* Empty state + upload first */}
        {filledImages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400 text-center py-2">{t(T.noImages)}</p>
            <ImagePicker
              mode="single"
              value=""
              onChange={(url) => {
                if (url) updateProduct({ images: [url] })
              }}
            />
          </div>
        )}

        {/* Add new slot shown as upload widget when editingIndex points to empty slot */}
        {editingIndex !== null && !images[editingIndex] && (
          <div className="border border-zinc-200 rounded p-3 bg-zinc-50">
            <ImagePicker
              mode="single"
              label={`${t(T.addImage)}`}
              value=""
              onChange={(url) => {
                if (url) updateImage(editingIndex, url)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
