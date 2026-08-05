/**
 * Per-store settings modal — Cloudflare + InstantDB credentials (via the shared
 * CredentialsForm) plus the danger zone (delete store). The credential UI is the
 * exact same component the account settings page uses, so they never diverge.
 */
import { useState, useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { X, Loader2, Trash2, Save, Check, BarChart3 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { CredentialsForm, type CredentialsInitial } from '@/components/settings/CredentialsForm'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface StoreAnalyticsInitial {
  googleAnalyticsId?: string
  clarityId?: string
  metaPixelId?: string
  customDomain?: string
}

interface StoreSettingsModalProps {
  storeId: string
  storeName: string
  initialValues: CredentialsInitial
  initialAnalytics?: StoreAnalyticsInitial
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
  analytics: { ar: 'التحليلات والنطاق', fr: 'Analytics & domaine', en: 'Analytics & domain' },
  analyticsHint: { ar: 'تُطبَّق عند النشر القادم للمتجر.', fr: 'Appliqué au prochain déploiement.', en: 'Applied on the next store deploy.' },
  gaId: { ar: 'معرّف Google Analytics', fr: 'ID Google Analytics', en: 'Google Analytics ID' },
  clarityId: { ar: 'معرّف Microsoft Clarity', fr: 'ID Microsoft Clarity', en: 'Microsoft Clarity ID' },
  metaId: { ar: 'معرّف Meta Pixel', fr: 'ID Meta Pixel', en: 'Meta Pixel ID' },
  domain: { ar: 'النطاق المخصص', fr: 'Domaine personnalisé', en: 'Custom domain' },
  domainHint: { ar: 'أضِف النطاق أيضاً في Cloudflare Pages للمتجر.', fr: 'Ajoutez aussi le domaine dans Cloudflare Pages.', en: 'Also add the domain in the store\'s Cloudflare Pages project.' },
  save: { ar: 'حفظ', fr: 'Enregistrer', en: 'Save' },
  saving: { ar: 'جارٍ الحفظ...', fr: 'Enregistrement...', en: 'Saving...' },
  saved: { ar: 'تم الحفظ', fr: 'Enregistré', en: 'Saved' },
}

export function StoreSettingsModal({ storeId, storeName, initialValues, initialAnalytics, onClose, onDeleted }: StoreSettingsModalProps) {
  const { t, dir } = useLang()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ga, setGa] = useState(initialAnalytics?.googleAnalyticsId ?? '')
  const [clarity, setClarity] = useState(initialAnalytics?.clarityId ?? '')
  const [metaPixel, setMetaPixel] = useState(initialAnalytics?.metaPixelId ?? '')
  const [domain, setDomain] = useState(initialAnalytics?.customDomain ?? '')
  const [savingA, setSavingA] = useState(false)
  const [savedA, setSavedA] = useState(false)

  const saveAnalytics = async () => {
    setSavingA(true)
    setError(null)
    try {
      await db.transact(
        db.tx.stores[storeId].update({
          googleAnalyticsId: ga.trim(),
          clarityId: clarity.trim(),
          metaPixelId: metaPixel.trim(),
          customDomain: domain.trim(),
        }),
      )
      setSavedA(true)
      setTimeout(() => setSavedA(false), 2500)
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to save')
    } finally {
      setSavingA(false)
    }
  }

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

          {/* Analytics & custom domain (non-secret; applied on next deploy) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-muted-foreground" />
              <h3 className="font-semibold text-sm">{t(T.analytics)}</h3>
            </div>
            <div className="bg-muted/40 rounded-xl p-4 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">{t(T.gaId)}</Label>
                <Input value={ga} onChange={(e) => setGa(e.target.value)} placeholder="G-XXXXXXXXXX" dir="ltr" className="text-sm font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">{t(T.clarityId)}</Label>
                <Input value={clarity} onChange={(e) => setClarity(e.target.value)} placeholder="xxxxxxxxxx" dir="ltr" className="text-sm font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">{t(T.metaId)}</Label>
                <Input value={metaPixel} onChange={(e) => setMetaPixel(e.target.value)} placeholder="123456789012345" dir="ltr" className="text-sm font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">{t(T.domain)}</Label>
                <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="shop.example.com" dir="ltr" className="text-sm font-mono" />
                <p className="text-[11px] text-muted-foreground">{t(T.domainHint)}</p>
              </div>
              <p className="text-[11px] text-muted-foreground">{t(T.analyticsHint)}</p>
              <button
                onClick={saveAnalytics}
                disabled={savingA}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {savingA ? <><Loader2 size={14} className="animate-spin" />{t(T.saving)}</> : savedA ? <><Check size={14} />{t(T.saved)}</> : <><Save size={14} />{t(T.save)}</>}
              </button>
            </div>
          </section>

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
