/**
 * ImagePicker — pick from uploaded product images (config.product.images).
 *
 * Single-select mode (default): value is the selected URL, onChange returns one URL.
 * Multi-select mode: value is string[], onChange returns string[].
 *
 * If product images are empty, shows a hint pointing to the Product tab.
 * allowCustom (default true) adds a URL/file fallback below the grid.
 */
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { Check, ImageIcon, Plus } from 'lucide-react'
import { ImageUpload } from './ImageUpload'

const T = {
  selectImage: { ar: 'اختر صورة', fr: 'Sélectionner une image', en: 'Select image' },
  noImages: { ar: 'لا توجد صور مضافة بعد', fr: 'Aucune image ajoutée', en: 'No product images yet' },
  addInProductTab: { ar: 'أضف صوراً من تبويب «المنتج» في اليمين', fr: 'Ajoutez des images via l\'onglet Produit', en: 'Add images in the Product tab on the right' },
  customImage: { ar: 'أو استخدم رابطاً مخصصاً', fr: 'Ou utiliser un lien personnalisé', en: 'Or use a custom URL / upload' },
}

/* ── Single-select ─────────────────────────────────────────────────── */
interface SingleImagePickerProps {
  mode?: 'single'
  value: string
  onChange: (url: string) => void
  label?: string
  allowCustom?: boolean
}

/* ── Multi-select ──────────────────────────────────────────────────── */
interface MultiImagePickerProps {
  mode: 'multi'
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
}

type ImagePickerProps = SingleImagePickerProps | MultiImagePickerProps

export function ImagePicker(props: ImagePickerProps) {
  const { config } = useBuilderStore()
  const { t, dir } = useLang()
  const productImages = config.product.images.filter(Boolean)

  if (props.mode === 'multi') {
    const { value, onChange, label } = props
    const toggle = (img: string) => {
      onChange(value.includes(img) ? value.filter((u) => u !== img) : [...value, img])
    }
    return (
      <div className="space-y-2" dir={dir}>
        {label && <p className="text-sm font-medium">{label}</p>}
        {productImages.length === 0 ? (
          <EmptyHint />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {productImages.map((img, i) => {
              const selected = value.includes(img)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(img)}
                  className={cn(
                    'relative aspect-square rounded overflow-hidden border-2 transition-all focus-visible:outline-none',
                    selected
                      ? 'border-zinc-900 ring-2 ring-zinc-900 ring-offset-1'
                      : 'border-zinc-200 hover:border-zinc-400'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {selected && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  /* single-select */
  const { value, onChange, label, allowCustom = true } = props
  const isProductImage = productImages.includes(value)

  return (
    <div className="space-y-3" dir={dir}>
      {label && <p className="text-sm font-medium">{label}</p>}

      {productImages.length === 0 ? (
        <EmptyHint />
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {productImages.map((img, i) => {
            const selected = value === img
            return (
              <button
                key={i}
                type="button"
                onClick={() => onChange(selected ? '' : img)}
                className={cn(
                  'relative aspect-square rounded overflow-hidden border-2 transition-all focus-visible:outline-none',
                  selected
                    ? 'border-zinc-900 ring-2 ring-zinc-900 ring-offset-1'
                    : 'border-zinc-200 hover:border-zinc-400'
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                {selected && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Custom URL / upload fallback */}
      {allowCustom && (
        <details className="text-xs" open={!isProductImage && !!value}>
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
            <Plus size={10} className="inline me-1" />
            {t(T.customImage)}
          </summary>
          <div className="mt-2">
            <ImageUpload
              value={isProductImage ? '' : value}
              onChange={onChange}
            />
          </div>
        </details>
      )}
    </div>
  )
}

function EmptyHint() {
  const { t, dir } = useLang()
  return (
    <div className="flex flex-col items-center gap-1.5 py-4 border border-dashed border-zinc-200 rounded text-center" dir={dir}>
      <ImageIcon size={18} className="text-zinc-300" />
      <p className="text-xs text-zinc-500">{t(T.noImages)}</p>
      <p className="text-[10px] text-zinc-400">{t(T.addInProductTab)}</p>
    </div>
  )
}
