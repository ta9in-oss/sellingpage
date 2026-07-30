/**
 * Per-store settings modal — Cloudflare + InstantDB credentials (via the shared
 * CredentialsForm) plus the danger zone (delete store). The credential UI is the
 * exact same component the account settings page uses, so they never diverge.
 */
import { useState, useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { X, Loader2, Trash2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { CredentialsForm, type CredentialsInitial } from '@/components/settings/CredentialsForm'

interface StoreSettingsModalProps {
  storeId: string
  storeName: string
  initialValues: CredentialsInitial
  onClose: () => void
  onDeleted?: () => void
}

const T = {
  deploySettings: { ar: 'إعدادات النشر', fr: 'Paramètres de déploiement', en: 'Deployment settings' },
  close: { ar: 'إغلاق', fr: 'Fermer', en: 'Close' },
  cancel: { ar: 'إغلاق', fr: 'Fermer', en: 'Close' },
  deleteStore: { ar: 'حذف المتجر', fr: 'Supprimer la boutique', en: 'Delete store' },
  deleteConfirm: { ar: 'هل أنت متأكد؟ سيتم حذف المتجر بشكل نهائي.', fr: 'Êtes-vous sûr? Suppression définitive.', en: 'Are you sure? The store will be permanently deleted.' },
  confirmDelete: { ar: 'نعم، احذف المتجر', fr: 'Oui, supprimer', en: 'Yes, delete store' },
  deleting: { ar: 'جارٍ الحذف...', fr: 'Suppression...', en: 'Deleting...' },
  dangerZone: { ar: 'منطقة الخطر', fr: 'Zone dangereuse', en: 'Danger Zone' },
}

export function StoreSettingsModal({ storeId, storeName, initialValues, onClose, onDeleted }: StoreSettingsModalProps) {
  const { t, dir } = useLang()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await db.transact(db.tx.stores[storeId].delete())
      onDeleted?.()
      onClose()
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to delete')
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" dir={dir} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">{t(T.deploySettings)}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{storeName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors" aria-label={t(T.close)}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <CredentialsForm target={{ storeId }} initialValues={initialValues} />

          {error && <div className="border border-destructive/40 bg-destructive/10 rounded-lg p-3 text-sm text-destructive">{error}</div>}

          {/* Danger zone */}
          <section className="border border-destructive/30 bg-destructive/5 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm text-destructive">{t(T.dangerZone)}</h3>
            {showDeleteConfirm ? (
              <div className="space-y-3">
                <p className="text-sm text-destructive/80">{t(T.deleteConfirm)}</p>
                <div className="flex gap-2">
                  <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-destructive bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-60 transition-colors">
                    {deleting ? <><Loader2 size={14} className="animate-spin" />{t(T.deleting)}</> : t(T.confirmDelete)}
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                    {t(T.cancel)}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-sm font-bold text-destructive hover:opacity-80 transition-opacity">
                <Trash2 size={14} />
                {t(T.deleteStore)}
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
