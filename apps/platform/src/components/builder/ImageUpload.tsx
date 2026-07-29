/**
 * ImageUpload — single image field with upload + URL paste.
 *
 * When a store exists, uploads go to InstantDB Storage (via {@link useStoreMedia})
 * and the value is a permanent public URL, so the image also joins the store's
 * media library. Before a store exists (mid-creation), it falls back to an inline
 * resized base64 data URL so the creation wizard still works offline.
 */
import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useStoreMedia } from '@/hooks/useStoreMedia'

const T = {
  dropHere: { ar: 'اسحب صورة أو انقر للاختيار', fr: 'Glissez une image ou cliquez pour choisir', en: 'Drop image or click to upload' },
  maxSize: { ar: '(الحد الأقصى 4 ميجابايت)', fr: '(Max 4 Mo)', en: '(Max 4MB)' },
  remove: { ar: 'حذف', fr: 'Supprimer', en: 'Remove' },
  preview: { ar: 'معاينة', fr: 'Aperçu', en: 'Preview' },
  orPasteUrl: { ar: 'أو الصق رابط صورة', fr: 'Ou collez une URL d\'image', en: 'Or paste an image URL' },
  uploading: { ar: 'جارٍ الرفع…', fr: 'Téléversement…', en: 'Uploading…' },
}

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

function resizeImageToBase64(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.naturalWidth)
      const w = Math.round(img.naturalWidth * scale)
      const h = Math.round(img.naturalHeight * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(objectUrl)
      resolve(canvas.toDataURL('image/webp', 0.82))
    }
    img.onerror = reject
    img.src = objectUrl
  })
}

export function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const { t } = useLang()
  const { storeId } = useBuilderStore()
  const { upload } = useStoreMedia(storeId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    if (!file.type.startsWith('image/')) { setError('File must be an image'); return }
    if (file.size > 4 * 1024 * 1024) { setError('Max file size is 4MB'); return }
    setUploading(true)
    try {
      if (storeId) {
        const url = await upload(file)
        if (url) onChange(url)
      } else {
        onChange(await resizeImageToBase64(file))
      }
    } catch {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }, [onChange, storeId, upload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const isBase64 = value?.startsWith('data:')

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="block text-sm font-medium">{label}</label>}

      {value && (
        <div className="relative group">
          <img
            src={value}
            alt={t(T.preview)}
            className="w-full h-32 object-cover rounded border border-zinc-200"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <button
            onClick={() => onChange('')}
            className="absolute top-1 end-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={t(T.remove)}
          >
            <X size={12} />
          </button>
          {isBase64 && <span className="absolute bottom-1 start-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">base64</span>}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-1.5 p-4 border-2 border-dashed rounded cursor-pointer transition-colors',
          isDragging ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400',
        )}
      >
        {uploading ? <Loader2 size={16} className="animate-spin text-zinc-500" /> : isDragging ? <Upload size={16} className="text-zinc-500" /> : <ImageIcon size={16} className="text-zinc-400" />}
        <p className="text-xs text-zinc-500 text-center">{uploading ? t(T.uploading) : t(T.dropHere)}</p>
        <p className="text-[10px] text-zinc-400 text-center">{t(T.maxSize)}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />

      <div className="space-y-1">
        <p className="text-[10px] text-zinc-400">{t(T.orPasteUrl)}</p>
        <input
          type="url"
          value={isBase64 ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded border border-zinc-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono"
          dir="ltr"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
