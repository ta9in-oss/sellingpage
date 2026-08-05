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
import { Save, Loader2, Check } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useLang } from '@/hooks/useLang'
import { saveMerchantSecrets } from '@/server/saveMerchantSecrets'

/** Official Cloudflare cloud mark (simple-icons path), brand orange. */
function CloudflareLogo() {
  return (
    <span className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-5 h-5" role="img" aria-label="Cloudflare">
        <path
          fill="#F38020"
          d="M16.509 16.845c.148-.507.091-.971-.155-1.316-.225-.316-.605-.499-1.063-.52l-8.677-.113a.156.156 0 0 1-.133-.071.167.167 0 0 1-.019-.152c.018-.071.084-.123.155-.135l8.757-.112c1.039-.048 2.162-.887 2.554-1.905l.497-1.292a.29.29 0 0 0 .016-.169C18.878 8.253 16.611 6.365 13.9 6.365c-2.499 0-4.618 1.61-5.38 3.847-.492-.367-1.121-.566-1.799-.499-1.207.12-2.176 1.089-2.296 2.296a2.68 2.68 0 0 0 .066.897C1.68 12.681 0 14.408 0 16.529c0 .192.014.381.041.567a.19.19 0 0 0 .18.154h15.99a.226.226 0 0 0 .216-.166l.082-.293z"
        />
        <path
          fill="#FAAE40"
          d="M19.598 11.276c-.08 0-.16.002-.239.007a.14.14 0 0 0-.115.096l-.34.94c-.148.406-.09.783.155 1.061.226.256.606.404 1.064.425l1.85.113c.056.003.104.028.133.07a.166.166 0 0 1 .019.152.19.19 0 0 1-.155.135l-1.922.112c-1.044.048-2.163.887-2.555 1.905l-.138.36a.115.115 0 0 0 .102.156h6.615a.19.19 0 0 0 .184-.138 4.75 4.75 0 0 0 .174-1.278c0-2.638-2.148-4.783-4.786-4.783z"
        />
      </svg>
    </span>
  )
}

/** InstantDB mark — black rounded square with a white bolt. */
function InstantDbLogo() {
  return (
    <span className="w-7 h-7 rounded-md bg-black flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" role="img" aria-label="InstantDB">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="#fff" />
      </svg>
    </span>
  )
}

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
  overrideNote: {
    ar: 'اختياري: هذه البيانات تخص هذا المتجر فقط وتتجاوز إعدادات حسابك. اتركها فارغة لاستخدام Cloudflare و InstantDB من إعدادات حسابك. إن لم تُضبط في الحساب أيضاً، يُنشئ النظام تطبيق InstantDB تلقائياً عند النشر.',
    fr: 'Optionnel : ces identifiants ne concernent que cette boutique et remplacent ceux de votre compte. Laissez vide pour utiliser Cloudflare et InstantDB de votre compte. Si le compte n\'en a pas non plus, une app InstantDB est créée automatiquement au déploiement.',
    en: 'Optional: these credentials apply to THIS store only and override your account settings. Leave blank to use the Cloudflare & InstantDB from your account. If your account has none either, an InstantDB app is auto-created on deploy.',
  },
  usingAccount: { ar: 'يستخدم بيانات حسابك', fr: 'Utilise les identifiants du compte', en: 'Using your account credentials' },
  usingOverride: { ar: 'يستخدم بيانات خاصة بهذا المتجر', fr: 'Utilise des identifiants propres à cette boutique', en: 'Using store-specific credentials' },
  instantAutoProvision: { ar: 'يُنشأ تلقائياً عند النشر', fr: 'Créé automatiquement au déploiement', en: 'Auto-created on publish' },
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

  const isStoreTarget = 'storeId' in target

  return (
    <div className="space-y-6">
      {isStoreTarget && (
        <div className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg px-3 py-2.5 leading-relaxed">
          {t(T.overrideNote)}
        </div>
      )}
      {/* Cloudflare */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CloudflareLogo />
          <h3 className="font-semibold text-sm">{t(T.cfSettings)}</h3>
          {isStoreTarget && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfTokenOnFile ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {cfTokenOnFile ? t(T.usingOverride) : t(T.usingAccount)}
            </span>
          )}
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
            <Input type="password" value={cfApiToken} onChange={(e) => setCfApiToken(e.target.value)} placeholder={cfTokenOnFile ? t(T.secretOnFile) : 'abcdef123456...'} dir="ltr" className="text-sm font-mono" />
            <p className="text-[11px] text-muted-foreground">{t(T.cfApiTokenHint)} <strong>Cloudflare Pages: Edit</strong> {t(T.cfApiTokenHint2)}</p>
          </div>
        </div>
      </section>

      {/* InstantDB */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <InstantDbLogo />
          <h3 className="font-semibold text-sm">{t(T.instantSettings)} <span className="text-[11px] font-normal text-muted-foreground">{t(T.instantOptional)}</span></h3>
          {isStoreTarget && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${instantTokenOnFile ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {instantTokenOnFile ? t(T.usingOverride) : t(T.instantAutoProvision)}
            </span>
          )}
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
            <Input type="password" value={instantAdminToken} onChange={(e) => setInstantAdminToken(e.target.value)} placeholder={instantTokenOnFile ? t(T.secretOnFile) : 'your-admin-token...'} dir="ltr" className="text-sm font-mono" />
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
