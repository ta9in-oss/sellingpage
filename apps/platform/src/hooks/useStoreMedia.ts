/**
 * useStoreMedia — a per-store media library backed by InstantDB Storage ($files).
 *
 * Every image a merchant uploads (logo, product photos, section images) is stored
 * under `stores/<storeId>/…` in InstantDB Storage and gets a permanent public URL.
 * The builder's image pickers read this list so a merchant can either pick a
 * previously-uploaded image or upload a new one — and always see everything they
 * have uploaded, in one place.
 *
 * Scoping is by path prefix. Files are resized to <=1280px webp before upload to
 * keep them small (they are baked into the deployed store as plain <img src> URLs).
 */
import { useCallback } from 'react'
import { db } from '@/lib/instantdb'

export interface MediaItem {
  id: string
  path: string
  url: string
}

const prefix = (storeId: string) => `stores/${storeId}/`

/** Resize an image file to at most `maxWidth` and return a webp Blob. */
function resizeToWebpBlob(file: File, maxWidth = 1280): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Non-raster files (svg) upload as-is; canvas can't reliably rasterize them.
    if (file.type === 'image/svg+xml' || !file.type.startsWith('image/')) {
      resolve(file)
      return
    }
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
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('resize failed'))),
        'image/webp',
        0.85,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('could not load image'))
    }
    img.src = objectUrl
  })
}

function safeName(name: string): string {
  const dot = name.lastIndexOf('.')
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[^a-zA-Z0-9-_]+/g, '-').slice(0, 40) || 'image'
  return base
}

export function useStoreMedia(storeId: string | null) {
  const { data, isLoading } = db.useQuery(
    storeId
      ? { $files: { $: { where: { path: { $like: `${prefix(storeId)}%` } }, order: { serverCreatedAt: 'desc' } } } }
      : null,
  )

  const media: MediaItem[] = ((data?.$files as any[]) ?? []).map((f) => ({
    id: f.id,
    path: f.path,
    url: f.url,
  }))

  /** Resize + upload a file; resolves to its permanent public URL. */
  const upload = useCallback(
    async (file: File): Promise<string> => {
      if (!storeId) throw new Error('no store selected')
      const blob = await resizeToWebpBlob(file)
      const ext = blob.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'img')
      const path = `${prefix(storeId)}${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeName(file.name)}.${ext}`
      await db.storage.uploadFile(path, blob, { contentType: blob.type })
      // uploadFile only returns { data: { id } } — no url. The public url lives on
      // the $files record, so fetch it back by path.
      const { data } = await db.queryOnce({
        $files: { $: { where: { path } } },
      })
      const url = (data?.$files as any[])?.[0]?.url ?? ''
      if (!url) throw new Error('upload succeeded but url not found')
      return url
    },
    [storeId],
  )

  /** Upload many files in parallel; resolves to their permanent public URLs (skips failures). */
  const uploadMany = useCallback(
    async (files: File[]): Promise<string[]> => {
      const results = await Promise.allSettled(files.map((f) => upload(f)))
      return results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && !!r.value)
        .map((r) => r.value)
    },
    [upload],
  )

  const remove = useCallback(async (path: string) => {
    await db.storage.delete(path)
  }, [])

  return { media, upload, uploadMany, remove, isLoading }
}
