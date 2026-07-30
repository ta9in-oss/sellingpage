/**
 * CredentialsForm — the single, reusable Cloudflare + InstantDB credentials form.
 *
 * One component, one design (design-system Input/Label + eye toggles + "on file"
 * hints), one save path (saveMerchantSecrets). Targets either a store row
 * ({ storeId }) or the account ({ platformUserId }). Used by the account
 * settings page and the per-store settings modal so the two never drift.
 *
 * Secrets are encrypted at rest and never returned to the browser: the token
 * fields start empty, the *OnFile hint shows "saved", and an empty field on save
 * means "keep the stored value".
 */
import { useState } from 'react'
import { Eye, EyeOff, Save, Loader2, Check } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useLang } from '@/hooks/useLang'
import { saveMerchantSecrets } from '@/server/saveMerchantSecrets'

export interface CredentialsInitial {
  cfAccountId?: string
  cfApiToken?: string
  instantAppId?: string
  instantAdminToken?: string
}

interface CredentialsFormProps {
  target: { storeId: string } | { platformUserId: string }
  initialValues: CredentialsInitial
  onSaved?: () => void
  /** Render the built-in save button (default true). */
  showSaveButton?: boolean
}

const T = {
  cfSettings: { ar: 'إعدادات Cloudflare', fr: 'Paramètres Cloudflare', en: 'Cloudflare' },
  cfAccountIdHint: { ar: 'من', fr: 'Depuis', en: 'From' },
  cfAccountIdHint2: { ar: '← Workers & Pages ← نظرة عامة ← Account ID', fr: '← Workers & Pages ← Aperçu ← Account ID', en: '← Workers & Pages ← Overview ← Account ID' },
  cfApiTokenHint: { ar: 'يجب أن يكون لديه صلاحية', fr: 'Doit avoir la permission', en: 'Must have permission' },
  cfApiTokenHint2: { ar: '(Profile → API Tokens → Create Token)', fr: '(Profile → API Tokens → Create Token)', en: '(Profile → API Tokens → Create Token)' },
  instantSettings: { ar: 'إعدادات InstantDB', fr: 'Paramètres InstantDB', en: 'InstantDB' },
  instantAppIdHint: { ar: 'من', fr: 'Depuis', en: 'From' },
  instantAppIdHint2: { ar: '← اختر تطبيقك ← App Settings', fr: '← Votre application ← App Settings', en: '← Choose your app ← App Settings' },
  instantAdminTokenHint: { ar: 'Admin token للوصول الخلفي إلى بيانات متجرك.', fr: 'Admin token pour l\'accès backend.', en: 'Admin token for backend access to your store data.' },
  instantOptional: { ar: '(اختياري — يُنشأ تلقائياً عند النشر)', fr: '(optionnel — auto-créé au déploiement)', en: '(optional — auto-created on publish)' },
  secretOnFile: {
    ar: '•••••••• محفوظ ومشفّر — اتركه فارغاً للإبقاء عليه',
    fr: '•••••••• enregistré — laissez vide pour le conserver',
    en: '•••••••• saved & encrypted — leave blank to keep it',
  },
  save: { ar: 'حفظ', fr: 'Enregistrer', en: 'Save' },
  saving: { ar: 'جارٍ الحفظ...', fr: 'Enregistrement...', en: 'Saving...' },
  saved: { ar: 'تم الحفظ', fr: 'Enregistré', en: 'Saved' },
  saveFailed: { ar: 'تعذر الحفظ. حاول مجدداً.', fr: 'Échec. Réessayez.', en: 'Failed to save. Try again.' },
}

export function CredentialsForm({ target, initialValues, onSaved, showSaveButton = true }: CredentialsFormProps) {
  const { t } = useLang()
  const [cfAccountId, setCfAccountId] = useState(initialValues.cfAccountId ?? '')
  const [cfApiToken, setCfApiToken] = useState('')
  const cfTokenOnFile = Boolean(initialValues.cfApiToken)
  const [instantAppId, setInstantAppId] = useState(initialValues.instantAppId ?? '')
  const [instantAdminToken, setInstantAdminToken] = useState('')
  const instantTokenOnFile = Boolean(initialValues.instantAdminToken)
  const [showCfToken, setShowCfToken] = useState(false)
  const [showInstantToken, setShowInstantToken] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await saveMerchantSecrets({
        data: {
          ...target,
          cfAccountId: cfAccountId.trim(),
          cfApiToken: cfApiToken.trim() || undefined,
          instantAppId: instantAppId.trim(),
          instantAdminToken: instantAdminToken.trim() || undefined,
        },
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      onSaved?.()
    } catch (e: unknown) {
      setError((e as Error)?.message ?? t(T.saveFailed))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cloudflare */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-[#F6821F] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">CF</span>
          </div>
          <h3 className="font-semibold text-sm">{t(T.cfSettings)}</h3>
        </div>
        <div className="bg-muted/40 rounded-xl p-4 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-bold">Account ID</Label>
            <Input value={cfAccountId} onChange={(e) => setCfAccountId(e.target.value)} placeholder="ab523bcff1d5e827..." dir="ltr" className="text-sm font-mono" />
            <p className="text-[11px] text-muted-foreground">
              {t(T.cfAccountIdHint)}{' '}
              <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="underline">dash.cloudflare.com</a>{' '}
              {t(T.cfAccountIdHint2)}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold">API Token</Label>
            <div className="relative">
              <Input type={showCfToken ? 'text' : 'password'} value={cfApiToken} onChange={(e) => setCfApiToken(e.target.value)} placeholder={cfTokenOnFile ? t(T.secretOnFile) : 'abcdef123456...'} dir="ltr" className="text-sm font-mono pe-10" />
              <button type="button" onClick={() => setShowCfToken(!showCfToken)} className="absolute inset-y-0 end-2.5 flex items-center text-muted-foreground hover:text-foreground">
                {showCfToken ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">{t(T.cfApiTokenHint)} <strong>Cloudflare Pages: Edit</strong> {t(T.cfApiTokenHint2)}</p>
          </div>
        </div>
      </section>

      {/* InstantDB */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">DB</span>
          </div>
          <h3 className="font-semibold text-sm">{t(T.instantSettings)} <span className="text-[11px] font-normal text-muted-foreground">{t(T.instantOptional)}</span></h3>
        </div>
        <div className="bg-muted/40 rounded-xl p-4 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-bold">App ID</Label>
            <Input value={instantAppId} onChange={(e) => setInstantAppId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" dir="ltr" className="text-sm font-mono" />
            <p className="text-[11px] text-muted-foreground">
              {t(T.instantAppIdHint)}{' '}
              <a href="https://instantdb.com/dash" target="_blank" rel="noopener noreferrer" className="underline">instantdb.com/dash</a>{' '}
              {t(T.instantAppIdHint2)}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold">Admin Token</Label>
            <div className="relative">
              <Input type={showInstantToken ? 'text' : 'password'} value={instantAdminToken} onChange={(e) => setInstantAdminToken(e.target.value)} placeholder={instantTokenOnFile ? t(T.secretOnFile) : 'your-admin-token...'} dir="ltr" className="text-sm font-mono pe-10" />
              <button type="button" onClick={() => setShowInstantToken(!showInstantToken)} className="absolute inset-y-0 end-2.5 flex items-center text-muted-foreground hover:text-foreground">
                {showInstantToken ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">{t(T.instantAdminTokenHint)}</p>
          </div>
        </div>
      </section>

      {error && <div className="border border-destructive/40 bg-destructive/10 rounded-lg p-3 text-sm text-destructive">{error}</div>}

      {showSaveButton && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saving ? <><Loader2 size={16} className="animate-spin" />{t(T.saving)}</> : saved ? <><Check size={16} />{t(T.saved)}</> : <><Save size={16} />{t(T.save)}</>}
        </button>
      )}
    </div>
  )
}
