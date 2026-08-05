/**
 * ImagePicker — pick from the store's media library or upload a new image.
 *
 * The library is every image the merchant has uploaded (logo, product photos,
 * section images), stored in InstantDB Storage under `stores/<storeId>/…` and
 * surfaced by {@link useStoreMedia}. Anywhere an image is chosen the merchant can
 * either select an existing upload or add a new one (drop / click / paste URL),
 * and always sees the full list of what they have uploaded.
 *
 * Single-select (default): value is the selected URL, onChange returns one URL.
 * Multi-select: value is string[], onChange returns string[].
 */
import { useRef, useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useStoreMedia } from '@/hooks/useStoreMedia'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { Check, ImageIcon, Loader2, Upload } from 'lucide-react'

const T = {
  library: { ar: 'مكتبة الصور', fr: 'Bibliothèque', en: 'Media library' },
  noImages: { ar: 'لا توجد صور بعد — ارفع أول صورة', fr: 'Aucune image — téléversez la première', en: 'No images yet — upload your first' },
  uploadNew: { ar: 'رفع صورة جديدة', fr: 'Téléverser', en: 'Upload new' },
  dropHere: { ar: 'اسحب صورة أو انقر', fr: 'Glissez ou cliquez', en: 'Drop image or click' },
  orPasteUrl: { ar: 'أو الصق رابط صورة', fr: 'Ou collez une URL', en: 'Or paste an image URL' },
  uploading: { ar: 'جارٍ الرفع…', fr: 'Téléversement…', en: 'Uploading…' },
  uploadFailed: { ar: 'فشل الرفع', fr: 'Échec du téléversement', en: 'Upload failed' },
}

interface SingleImagePickerProps {
  mode?: 'single'
  value: string
  onChange: (url: string) => void
  label?: string
  allowCustom?: boolean
}
interface MultiImagePickerProps {
  mode: 'multi'
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
  allowCustom?: boolean
}
type ImagePickerProps = SingleImagePickerProps | MultiImagePickerProps

/** Every image URL already referenced by the store config (older stores, wizard
 *  uploads, pasted URLs) so the picker shows them even if they never landed in
 *  InstantDB Storage under this store's prefix. */
function useConfigImages(): string[] {
  const config = useBuilderStore((s) => s.config)
  const urls: string[] = []
  const push = (v?: string) => { if (v && !urls.includes(v)) urls.push(v) }
  push(config?.meta?.logo)
  ;(config?.product?.images ?? []).forEach(push)
  for (const s of config?.sections ?? []) {
    if (s.type === 'hero') push(s.image)
    if (s.type === 'product-carousel') (s.images ?? []).forEach(push)
    if (s.type === 'features') (s.items ?? []).forEach((it) => push(it.image))
  }
  return urls
}

export function ImagePicker(props: ImagePickerProps) {
  const { storeId } = useBuilderStore()
  const { media: uploaded, upload } = useStoreMedia(storeId)
  const configImages = useConfigImages()

  // Storage uploads first, then any config-referenced image not already listed.
  const media = [
    ...uploaded,
    ...configImages
      .filter((u) => !uploaded.some((m) => m.url === u))
      .map((u) => ({ id: `cfg:${u}`, path: '', url: u })),
  ]
  const { t, dir } = useLang()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const multi = props.mode === 'multi'
  const allowCustom = props.allowCustom ?? true
  const isSelected = (url: string) =>
    multi ? (props.value as string[]).includes(url) : props.value === url

  const select = (url: string) => {
    if (props.mode === 'multi') {
      const v = props.value
      props.onChange(v.includes(url) ? v.filter((u) => u !== url) : [...v, url])
    } else {
      props.onChange(props.value === url ? '' : url)
    }
  }

  const doUpload = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const url = await upload(file)
      if (url) select(url)
    } catch {
      setError(t(T.uploadFailed))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2" dir={dir}>
      {props.label && <p className="text-sm font-medium">{props.label}</p>}

      {/* Library grid — the merchant's full upload history */}
      {media.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 py-3 border border-dashed border-zinc-200 rounded text-center">
          <ImageIcon size={18} className="text-zinc-300" />
          <p className="text-xs text-zinc-500">{t(T.noImages)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto p-0.5">
          {media.map((m) => {
            const selected = isSelected(m.url)
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => select(m.url)}
                className={cn(
                  'relative aspect-square rounded overflow-hidden border-2 transition-all focus-visible:outline-none',
                  selected ? 'border-zinc-900 ring-2 ring-zinc-900 ring-offset-1' : 'border-zinc-200 hover:border-zinc-400',
                )}
              >
                <img src={m.url} alt="" className="w-full h-full object-cover" loading="lazy" />
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

      {/* Upload dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) doUpload(f) }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'flex items-center justify-center gap-2 p-2.5 border-2 border-dashed rounded cursor-pointer transition-colors text-xs',
          dragging ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400',
        )}
      >
        {uploading ? <Loader2 size={14} className="animate-spin text-zinc-500" /> : <Upload size={14} className="text-zinc-400" />}
        <span className="text-zinc-500">{uploading ? t(T.uploading) : t(T.dropHere)}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = '' }}
      />

      {/* URL paste fallback (single-select only) */}
      {allowCustom && !multi && (
        <input
          type="url"
          value={(props.value as string).startsWith('http') ? (props.value as string) : ''}
          onChange={(e) => (props as SingleImagePickerProps).onChange(e.target.value)}
          placeholder={t(T.orPasteUrl)}
          className="w-full rounded border border-zinc-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono"
          dir="ltr"
        />
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
