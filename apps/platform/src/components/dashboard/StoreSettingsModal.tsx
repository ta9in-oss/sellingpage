/**
 * Per-store settings modal — lets the merchant configure:
 * - Cloudflare Account ID + API token (for deployment)
 * - InstantDB App ID + Admin token (for the store's live DB)
 */
import { useState, useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { X, Eye, EyeOff, Save, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useLang } from '@/hooks/useLang'

interface StoreSettingsModalProps {
  storeId: string
  storeName: string
  initialValues: {
    cfAccountId?: string
    cfApiToken?: string
    instantAppId?: string
    instantAdminToken?: string
  }
  onClose: () => void
}

const T = {
  deploySettings: { ar: 'إعدادات النشر', fr: 'Paramètres de déploiement', en: 'Deployment settings' },
  close: { ar: 'إغلاق', fr: 'Fermer', en: 'Close' },
  cfSettings: { ar: 'إعدادات Cloudflare', fr: 'Paramètres Cloudflare', en: 'Cloudflare settings' },
  cfAccountIdHint: { ar: 'من', fr: 'Depuis', en: 'From' },
  cfAccountIdHint2: { ar: '← Workers & Pages ← نظرة عامة ← Account ID', fr: '← Workers & Pages ← Vue d\'ensemble ← Account ID', en: '← Workers & Pages ← Overview ← Account ID' },
  cfApiTokenHint: { ar: 'يجب أن يكون لديه صلاحية', fr: 'Doit avoir la permission', en: 'Must have permission' },
  cfApiTokenHint2: { ar: '(Profile → API Tokens → Create Token)', fr: '(Profile → API Tokens → Créer un token)', en: '(Profile → API Tokens → Create Token)' },
  instantSettings: { ar: 'إعدادات InstantDB', fr: 'Paramètres InstantDB', en: 'InstantDB settings' },
  instantAppIdHint: { ar: 'من', fr: 'Depuis', en: 'From' },
  instantAppIdHint2: { ar: '← اختر تطبيقك ← App Settings', fr: '← Choisissez votre application ← App Settings', en: '← Choose your app ← App Settings' },
  instantAdminTokenHint: { ar: 'Admin token للوصول الخلفي إلى بيانات متجرك.', fr: 'Admin token pour l\'accès backend aux données de votre boutique.', en: 'Admin token for backend access to your store data.' },
  cancel: { ar: 'إلغاء', fr: 'Annuler', en: 'Cancel' },
  savingSettings: { ar: 'جارٍ الحفظ...', fr: 'Enregistrement...', en: 'Saving...' },
  savedSettings: { ar: '✓ تم الحفظ', fr: '✓ Enregistré', en: '✓ Saved' },
  saveSettings: { ar: 'حفظ الإعدادات', fr: 'Enregistrer', en: 'Save settings' },
  saveFailed: { ar: 'تعذر الحفظ. حاول مجدداً.', fr: 'Impossible d\'enregistrer. Réessayez.', en: 'Failed to save. Please try again.' },
}

export function StoreSettingsModal({
  storeId,
  storeName,
  initialValues,
  onClose,
}: StoreSettingsModalProps) {
  const { t } = useLang()
  const [cfAccountId, setCfAccountId] = useState(initialValues.cfAccountId ?? '')
  const [cfApiToken, setCfApiToken] = useState(initialValues.cfApiToken ?? '')
  const [instantAppId, setInstantAppId] = useState(initialValues.instantAppId ?? '')
  const [instantAdminToken, setInstantAdminToken] = useState(initialValues.instantAdminToken ?? '')
  const [showCfToken, setShowCfToken] = useState(false)
  const [showInstantToken, setShowInstantToken] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await db.transact(
        db.tx.stores[storeId].update({
          cfAccountId: cfAccountId.trim(),
          cfApiToken: cfApiToken.trim(),
          instantAppId: instantAppId.trim(),
          instantAdminToken: instantAdminToken.trim(),
        })
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e: unknown) {
      setError((e as Error)?.message ?? t(T.saveFailed))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      dir="rtl"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-black">
          <div>
            <h2 className="text-lg font-black">{t(T.deploySettings)}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{storeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-transparent hover:border-black transition-colors"
            aria-label={t(T.close)}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Cloudflare section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-[#F6821F] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-black">CF</span>
              </div>
              <h3 className="font-black text-sm">{t(T.cfSettings)}</h3>
            </div>
            <div className="border-2 border-black p-4 space-y-3 bg-zinc-50">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Account ID</Label>
                <Input
                  value={cfAccountId}
                  onChange={(e) => setCfAccountId(e.target.value)}
                  placeholder="ab523bcff1d5e827..."
                  dir="ltr"
                  className="text-sm font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  {t(T.cfAccountIdHint)}{' '}
                  <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="underline">
                    dash.cloudflare.com
                  </a>{' '}
                  {t(T.cfAccountIdHint2)}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">API Token</Label>
                <div className="relative">
                  <Input
                    type={showCfToken ? 'text' : 'password'}
                    value={cfApiToken}
                    onChange={(e) => setCfApiToken(e.target.value)}
                    placeholder="abcdef123456..."
                    dir="ltr"
                    className="text-sm font-mono pe-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCfToken(!showCfToken)}
                    className="absolute inset-y-0 end-2.5 flex items-center text-zinc-400 hover:text-black"
                  >
                    {showCfToken ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {t(T.cfApiTokenHint)} <strong>Cloudflare Pages: Edit</strong> {t(T.cfApiTokenHint2)}
                </p>
              </div>
            </div>
          </section>

          {/* InstantDB section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-black flex items-center justify-center shrink-0">
                <span className="text-yellow-400 text-xs font-black">DB</span>
              </div>
              <h3 className="font-black text-sm">{t(T.instantSettings)}</h3>
            </div>
            <div className="border-2 border-black p-4 space-y-3 bg-zinc-50">
              <div className="space-y-1">
                <Label className="text-xs font-bold">App ID</Label>
                <Input
                  value={instantAppId}
                  onChange={(e) => setInstantAppId(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  dir="ltr"
                  className="text-sm font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  {t(T.instantAppIdHint)}{' '}
                  <a href="https://instantdb.com/dash" target="_blank" rel="noopener noreferrer" className="underline">
                    instantdb.com/dash
                  </a>{' '}
                  {t(T.instantAppIdHint2)}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Admin Token</Label>
                <div className="relative">
                  <Input
                    type={showInstantToken ? 'text' : 'password'}
                    value={instantAdminToken}
                    onChange={(e) => setInstantAdminToken(e.target.value)}
                    placeholder="your-admin-token..."
                    dir="ltr"
                    className="text-sm font-mono pe-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInstantToken(!showInstantToken)}
                    className="absolute inset-y-0 end-2.5 flex items-center text-zinc-400 hover:text-black"
                  >
                    {showInstantToken ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">{t(T.instantAdminTokenHint)}</p>
              </div>
            </div>
          </section>

          {error && (
            <div className="border-2 border-red-400 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t-2 border-black">
          <button onClick={onClose} className="text-sm font-bold text-zinc-500 hover:text-black">
            {t(T.cancel)}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 border-2 border-black text-sm font-black transition-all',
              saved
                ? 'bg-green-400 text-black'
                : 'bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]',
              saving && 'opacity-60 cursor-not-allowed'
            )}
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" /> {t(T.savingSettings)}</>
            ) : saved ? (
              t(T.savedSettings)
            ) : (
              <><Save size={14} /> {t(T.saveSettings)}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
