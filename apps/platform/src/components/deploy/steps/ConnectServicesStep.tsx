import { useState, useEffect, useRef } from 'react'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { ExternalLink, ChevronDown, ChevronUp, Check, Sparkles, Globe } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { autoProvisionInstantDB } from '@/server/autoProvisionInstantDB'
import { Button } from '@/components/ui/button'

interface Props {
  storeId: string
  onContinue: () => void
}

const T = {
  connectServices: { ar: 'ربط الخدمات', fr: 'Connecter les services', en: 'Connect Services' },
  connectServicesDesc: {
    ar: 'اربط حساب Cloudflare لنشر متجرك. قاعدة البيانات تُدار تلقائياً من طرفنا',
    fr: 'Connectez Cloudflare pour déployer. La base de données est gérée automatiquement',
    en: 'Connect Cloudflare to deploy. The database is managed automatically by us',
  },
  cfTitle: { ar: 'Cloudflare', fr: 'Cloudflare', en: 'Cloudflare' },
  cfDescription: {
    ar: 'استضافة المتجر على شبكة Cloudflare العالمية',
    fr: 'Hébergement sur le réseau mondial Cloudflare',
    en: 'Store hosted on Cloudflare\'s global network',
  },
  cfOAuth: { ar: 'ربط Cloudflare', fr: 'Connecter Cloudflare', en: 'Connect Cloudflare' },
  cfManual: { ar: 'إدخال يدوي', fr: 'Saisie manuelle', en: 'Manual entry' },
  cfAccountIdLabel: { ar: 'Account ID', fr: 'Account ID', en: 'Account ID' },
  cfApiTokenLabel: { ar: 'API Token', fr: 'API Token', en: 'API Token' },
  cfTokenHint: {
    ar: 'من My Profile → API Tokens. صلاحية: Edit Workers & Pages + Zone Read + DNS Edit',
    fr: 'Dans My Profile → API Tokens. Permission : Edit Workers & Pages + Zone Read + DNS Edit',
    en: 'From My Profile → API Tokens. Permission: Edit Workers & Pages + Zone Read + DNS Edit',
  },
  cfOAuthNotConfigured: {
    ar: 'ربط OAuth غير مهيأ. استخدم الإدخال اليدوي',
    fr: 'OAuth non configuré. Utilisez la saisie manuelle',
    en: 'OAuth not configured. Use manual entry',
  },
  fromAccountCreds: {
    ar: 'من إعدادات الحساب',
    fr: 'Depuis les paramètres du compte',
    en: 'From account settings',
  },
  saveToAccount: {
    ar: 'حفظ هذه البيانات في إعدادات الحساب (لجميع المتاجر)',
    fr: 'Sauvegarder dans les paramètres du compte (tous les projets)',
    en: 'Save to account settings (use for all stores)',
  },
  instantTitle: { ar: 'قاعدة البيانات (InstantDB)', fr: 'Base de données (InstantDB)', en: 'Database (InstantDB)' },
  instantAutoDesc: {
    ar: 'سيتم إنشاء قاعدة البيانات تلقائياً عند النشر. لا تحتاج لإجراء أي شيء',
    fr: 'La base de données sera créée automatiquement lors du déploiement',
    en: 'The database will be created automatically at deployment. No action needed',
  },
  instantAutoManaged: { ar: 'مُدارة تلقائياً بواسطة 7aba', fr: 'Gérée automatiquement par 7aba', en: 'Auto-managed by 7aba' },
  instantAdvanced: {
    ar: 'استخدام قاعدة بيانات خاصة بي (متقدم)',
    fr: 'Utiliser ma propre base de données (avancé)',
    en: 'Use my own database (advanced)',
  },
  instantAppIdLabel: { ar: 'App ID', fr: 'App ID', en: 'App ID' },
  instantAdminTokenLabel: { ar: 'Admin Token', fr: 'Admin Token', en: 'Admin Token' },
  connectInstant: { ar: 'ربط InstantDB', fr: 'Connecter InstantDB', en: 'Connect InstantDB' },
  instantOwnAccount: {
    ar: 'سيتم إنشاء قاعدة البيانات في حسابك على InstantDB',
    fr: 'La base de données sera créée dans votre compte InstantDB',
    en: 'The database will be created in your own InstantDB account',
  },
  connected: { ar: 'متصل ✓', fr: 'Connecté ✓', en: 'Connected ✓' },
  notConnected: { ar: 'غير متصل', fr: 'Non connecté', en: 'Not connected' },
  saving: { ar: 'جارٍ الحفظ...', fr: 'Enregistrement...', en: 'Saving...' },
  continue: { ar: 'تابع →', fr: 'Continuer →', en: 'Continue →' },
  whereToFind: { ar: 'كيفية الحصول عليها', fr: 'Comment obtenir', en: 'How to get it' },
  error: { ar: 'خطأ', fr: 'Erreur', en: 'Error' },
}

export function ConnectServicesStep({ storeId, onContinue }: Props) {
  const { t } = useLang()
  const { user } = db.useAuth()

  const [cfAccountId, setCfAccountId] = useState('')
  const [cfApiToken, setCfApiToken] = useState('')
  const [cfConnected, setCfConnected] = useState(false)
  const [showManualCF, setShowManualCF] = useState(false)
  const [usingAccountCreds, setUsingAccountCreds] = useState(false)
  const [saveToAccount, setSaveToAccount] = useState(false)

  const [useOwnInstant, setUseOwnInstant] = useState(false)
  const [instantAppId, setInstantAppId] = useState('')
  const [instantAdminToken, setInstantAdminToken] = useState('')
  const [instantProvisionError, setInstantProvisionError] = useState('')
  const [instantOAuthToken, setInstantOAuthToken] = useState('')
  const [instantConnected, setInstantConnected] = useState(false)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const popupRef = useRef<Window | null>(null)
  const instantPopupRef = useRef<Window | null>(null)

  const cfClientId = typeof window !== 'undefined'
    ? (import.meta.env.VITE_CF_OAUTH_CLIENT_ID as string | undefined)
    : undefined
  const cfOAuthAvailable = Boolean(cfClientId)

  const instantClientId = typeof window !== 'undefined'
    ? ((import.meta as any).env?.VITE_INSTANTDB_OAUTH_CLIENT_ID as string | undefined)
    : undefined
  const instantOAuthAvailable = Boolean(instantClientId)

  const { data: storeData } = db.useQuery({
    stores: { $: { where: { id: storeId } } },
  })

  const { data: userData } = db.useQuery(
    user?.email
      ? { platformUsers: { $: { where: { email: user.email } } } }
      : null
  )

  // Hydrate: prefer per-store creds, fall back to account-level creds
  useEffect(() => {
    const store = storeData?.stores?.[0]
    const platformUser = (userData as any)?.platformUsers?.[0]

    if (store?.cfAccountId) {
      setCfAccountId(store.cfAccountId as string)
      setCfApiToken((store.cfApiToken as string) ?? '')
      setCfConnected(true)
      setUsingAccountCreds(false)
    } else if (platformUser?.cfAccountId) {
      setCfAccountId(platformUser.cfAccountId as string)
      setCfApiToken((platformUser.cfApiToken as string) ?? '')
      setCfConnected(true)
      setUsingAccountCreds(true)
      setShowManualCF(true)
    }

    if (store?.instantAppId) {
      setInstantAppId(store.instantAppId as string)
      setInstantAdminToken((store.instantAdminToken as string) ?? '')
    }
  }, [storeData, userData])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === 'cloudflare_connected') {
        const { accountId, apiToken } = e.data as { accountId: string; apiToken: string }
        setCfAccountId(accountId)
        setCfApiToken(apiToken)
        setCfConnected(true)
        setUsingAccountCreds(false)
        popupRef.current?.close()
      }
      if (e.data?.type === 'instantdb_connected') {
        const { token } = e.data as { token: string; refreshToken?: string }
        setInstantOAuthToken(token)
        setInstantConnected(true)
        instantPopupRef.current?.close()
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const openCFOAuth = () => {
    if (!cfClientId) return
    const redirectUri = `${window.location.origin}/auth/cloudflare`
    const scopes = 'account:read user:read workers:write workers_routes:write zone:read dns:write'
    const url = `https://dash.cloudflare.com/oauth2/auth?response_type=code&client_id=${encodeURIComponent(cfClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`
    popupRef.current = window.open(url, 'cf-oauth', 'width=640,height=720,noopener')
  }

  const openInstantOAuth = () => {
    if (!instantClientId) return
    const redirectUri = `${window.location.origin}/auth/instantdb`
    const scopes = 'apps-read apps-write'
    const url = `https://api.instantdb.com/platform/oauth/start?response_type=code&client_id=${encodeURIComponent(instantClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`
    instantPopupRef.current = window.open(url, 'instant-oauth', 'width=640,height=720,noopener')
  }

  const canContinue = cfConnected || (cfAccountId.trim() !== '' && cfApiToken.trim() !== '')

  const handleContinue = async () => {
    setSaving(true)
    setSaveError('')
    setInstantProvisionError('')
    try {
      let appId = instantAppId
      let adminToken = instantAdminToken

      const alreadyProvisioned = storeData?.stores?.[0]?.instantAppId
      if (!useOwnInstant && !alreadyProvisioned) {
        const store = storeData?.stores?.[0]
        const slug = (store?.slug as string) ?? storeId
        const provisioned = await autoProvisionInstantDB({ data: { storeSlug: slug, merchantToken: instantOAuthToken || undefined } })
        appId = provisioned.appId
        adminToken = provisioned.adminToken
      }

      await db.transact(
        db.tx.stores[storeId].update({
          cfAccountId: cfAccountId.trim(),
          cfApiToken: cfApiToken.trim(),
          instantAppId: appId.trim(),
          instantAdminToken: adminToken.trim(),
        })
      )

      // Optionally persist to account-level platformUsers
      const platformUser = (userData as any)?.platformUsers?.[0]
      if (saveToAccount && user?.email && platformUser?.id) {
        await db.transact(
          (db.tx.platformUsers as any)[platformUser.id].update({
            cfAccountId: cfAccountId.trim(),
            cfApiToken: cfApiToken.trim(),
          })
        )
      }

      onContinue()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('InstantDB') || msg.includes('INSTANTDB')) {
        setInstantProvisionError(msg)
      } else {
        setSaveError(msg)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">{t(T.connectServices)}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t(T.connectServicesDesc)}</p>
      </div>

      {/* ── InstantDB card ── */}
      <div className="border rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <InstantIcon />
            <div>
              <p className="font-semibold text-sm">{t(T.instantTitle)}</p>
              <p className="text-xs text-muted-foreground">{t(T.instantAutoDesc)}</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 shrink-0">
            <Check size={12} />
            {t(T.instantAutoManaged)}
          </span>
        </div>

        {instantOAuthAvailable && (
          <div className="space-y-1.5">
            <Button variant="default" size="sm" onClick={openInstantOAuth} className="w-full gap-2" disabled={instantConnected}>
              <InstantIcon size={14} />
              {instantConnected ? t(T.connected) : t(T.connectInstant)}
            </Button>
            {instantConnected && (
              <p className="text-xs text-green-600">{t(T.instantOwnAccount)}</p>
            )}
          </div>
        )}

        <button
          onClick={() => setUseOwnInstant(!useOwnInstant)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {useOwnInstant ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {t(T.instantAdvanced)}
        </button>

        {useOwnInstant && (
          <div className="space-y-3 pt-1">
            <ManualField label={t(T.instantAppIdLabel)} value={instantAppId} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" onChange={setInstantAppId} />
            <ManualField label={t(T.instantAdminTokenLabel)} value={instantAdminToken} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" onChange={setInstantAdminToken} isSecret />
          </div>
        )}

        {instantProvisionError && <p className="text-xs text-red-500 mt-1">{instantProvisionError}</p>}
      </div>

      {/* ── Cloudflare card ── */}
      <div className="border rounded-xl p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <CFIcon />
            <div>
              <p className="font-semibold text-sm">{t(T.cfTitle)}</p>
              <p className="text-xs text-muted-foreground">{t(T.cfDescription)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={cn('flex items-center gap-1.5 text-xs font-medium', cfConnected ? 'text-green-600' : 'text-muted-foreground')}>
              <span className={cn('w-2 h-2 rounded-full', cfConnected ? 'bg-green-500' : 'bg-gray-300')} />
              {cfConnected ? t(T.connected) : t(T.notConnected)}
            </span>
            {usingAccountCreds && cfConnected && (
              <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                <Globe size={10} />
                {t(T.fromAccountCreds)}
              </span>
            )}
          </div>
        </div>

        {cfOAuthAvailable ? (
          <Button variant="default" size="sm" onClick={openCFOAuth} className="w-full gap-2" disabled={cfConnected}>
            <CFIcon size={14} />
            {cfConnected ? t(T.connected) : t(T.cfOAuth)}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="gap-1.5 opacity-60">{t(T.cfOAuth)}</Button>
            <p className="text-xs text-muted-foreground">{t(T.cfOAuthNotConfigured)}</p>
          </div>
        )}

        <button
          onClick={() => setShowManualCF(!showManualCF)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showManualCF ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {t(T.cfManual)}
        </button>

        {(showManualCF || !cfOAuthAvailable) && (
          <div className="space-y-3">
            <ManualField
              label={t(T.cfAccountIdLabel)}
              value={cfAccountId}
              placeholder="abc123..."
              onChange={(v) => { setCfAccountId(v); setUsingAccountCreds(false); setCfConnected(v.trim() !== '' && cfApiToken.trim() !== '') }}
            />
            <div>
              <ManualField
                label={t(T.cfApiTokenLabel)}
                value={cfApiToken}
                placeholder="••••••••••••••••••••"
                onChange={(v) => { setCfApiToken(v); setUsingAccountCreds(false); setCfConnected(cfAccountId.trim() !== '' && v.trim() !== '') }}
                isSecret
              />
              <p className="text-xs text-muted-foreground mt-1">{t(T.cfTokenHint)}</p>
            </div>
            <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <ExternalLink size={11} />
              {t(T.whereToFind)}
            </a>
          </div>
        )}
      </div>

      {cfConnected && !usingAccountCreds && (
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={saveToAccount} onChange={(e) => setSaveToAccount(e.target.checked)} className="rounded border-border" />
          <span className="text-muted-foreground">{t(T.saveToAccount)}</span>
        </label>
      )}

      {saveError && <p className="text-xs text-red-500">{t(T.error)}: {saveError}</p>}

      <Button onClick={handleContinue} disabled={!canContinue || saving} className="w-full" size="lg">
        {saving ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            {t(T.saving)}
          </span>
        ) : t(T.continue)}
      </Button>
    </div>
  )
}

function ManualField({ label, value, placeholder, onChange, isSecret }: { label: string; value: string; placeholder: string; onChange: (v: string) => void; isSecret?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <input
        type={isSecret ? 'password' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 transition-colors font-mono"
        placeholder={placeholder}
        dir="ltr"
        autoComplete={isSecret ? 'new-password' : 'off'}
      />
    </div>
  )
}

function CFIcon({ size }: { size?: number }) {
  if (size) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#F6821F">
        <path d="M16.5 16.5c.3-1 .2-1.9-.3-2.5-.4-.6-1.1-.9-2-.9H4.3l-.3 1.1c-.3 1-.2 1.9.3 2.5.4.6 1.1.9 2 .9h10l.2-1.1zm1.3-4.5c.3-1 .1-1.8-.3-2.4-.4-.6-1.1-.9-2-.9H5.6l-.3 1.1c-.3 1-.1 1.8.3 2.4.4.6 1.1.9 2 .9H18l-.2-1.1z" />
      </svg>
    )
  }
  return <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold">CF</div>
}

function InstantIcon({ size }: { size?: number } = {}) {
  if (size) {
    return <Sparkles size={size} className="text-purple-600" />
  }
  return (
    <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
      <Sparkles size={16} className="text-white" />
    </div>
  )
}
