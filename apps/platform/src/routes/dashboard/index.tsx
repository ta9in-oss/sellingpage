/**
 * /dashboard — main merchant dashboard
 *
 * Flow:
 *   1. Not authed → show AuthModal
 *   2. Authed, no subscription → show SubscriptionGate (pricing page inline)
 *   3. Authed, no CF/InstantDB creds + first visit → show OnboardingWelcome
 *   4. Authed + subscribed + onboarded → show StoresDashboard
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { AuthModal } from '@/components/auth/AuthModal'
import { StoreSettingsModal } from '@/components/dashboard/StoreSettingsModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createSubscriptionCheckout } from '@/server/createSubscriptionCheckout'
import { verifySubscriptionPayment } from '@/server/verifySubscriptionPayment'
import { TIERS as PRICING_TIERS, ONCE_LABEL, contactWhatsappUrl } from '@/config/pricing'
import { FirstBatchCountdown } from '@/components/marketing/FirstBatchCountdown'
import { getDownloadUrl } from '@/server/getDownloadUrl'
import type { DownloadType } from '@/server/getDownloadUrl'
import {
  Plus, Settings, ExternalLink, LogOut, Store, Rocket,
  Download, Package, Smartphone, Code2, Loader2, CheckCircle2,
  Globe, Key, ChevronDown, ChevronUp, Save, AlertCircle, ArrowRight, ArrowLeft,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  validateSearch: (search): { payment?: string; tier?: string; checkout_id?: string; plan?: string } => ({
    payment: search.payment as string | undefined,
    tier: search.tier as string | undefined,
    checkout_id: search.checkout_id as string | undefined,
    plan: search.plan as string | undefined,
  }),
  component: DashboardPage,
})

// ─── Main page ────────────────────────────────────────────────────────────────

const DT = {
  loginTitle: { ar: 'الدخول للوحة التحكم', fr: 'Accès au tableau de bord', en: 'Dashboard Login' },
  loginBtn: { ar: 'تسجيل الدخول', fr: 'Se connecter', en: 'Sign in' },
  choosePlan: { ar: 'اختر باقتك', fr: 'Choisissez votre forfait', en: 'Choose your plan' },
  subscribeNow: { ar: 'اشترك الآن', fr: "S'abonner", en: 'Subscribe now' },
  myStores: { ar: 'متاجرك', fr: 'Mes boutiques', en: 'My stores' },
  newStore: { ar: 'متجر جديد', fr: 'Nouvelle boutique', en: 'New store' },
  live: { ar: 'مباشر', fr: 'En ligne', en: 'Live' },
  draft: { ar: 'مسودة', fr: 'Brouillon', en: 'Draft' },
  edit: { ar: 'تعديل', fr: 'Modifier', en: 'Edit' },
  deploy: { ar: 'نشر', fr: 'Déployer', en: 'Deploy' },
  downloads: { ar: 'التحميلات', fr: 'Téléchargements', en: 'Downloads' },
  logout: { ar: 'خروج', fr: 'Déconnexion', en: 'Sign out' },
  settings: { ar: 'الإعدادات', fr: 'Paramètres', en: 'Settings' },
}

function DashboardPage() {
  const { payment, tier, checkout_id, plan } = Route.useSearch()
  const { isLoading, user } = db.useAuth()
  const { t, dir } = useLang()
  const [showAuth, setShowAuth] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={dir}>
        {showAuth ? (
          <AuthModal
            title={t(DT.loginTitle)}
            subtitle="أدخل معلوماتك لمتابعة"
            onClose={() => setShowAuth(false)}
          />
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
              <Store className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">7aba.store</h1>
            <p className="text-muted-foreground">سجّل دخولك للوصول للوحة التحكم</p>
            <button
              onClick={() => setShowAuth(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              {t(DT.loginBtn)}
            </button>
          </div>
        )}
      </div>
    )
  }

  return <AuthenticatedDashboard email={user.email} autoPlan={plan} payment={payment} paymentTier={tier} checkoutIdParam={checkout_id} />
}

// ─── Authenticated shell ───────────────────────────────────────────────────────

function AuthenticatedDashboard({
  email,
  autoPlan,
  payment,
  paymentTier,
  checkoutIdParam,
}: {
  email: string
  autoPlan?: string
  payment?: string
  paymentTier?: string
  checkoutIdParam?: string
}) {
  const { data, isLoading } = db.useQuery({
    platformUsers: { $: { where: { email } } },
  })
  const navigate = useNavigate()
  const [onboardingSkipped, setOnboardingSkipped] = React.useState(
    () => typeof window !== 'undefined' && localStorage.getItem('7aba:setup_dismissed') === '1'
  )

  const platformUser = (data?.platformUsers ?? [])[0] as
    | { id: string; email: string; tier?: string; checkoutId?: string; cfAccountId?: string; cfApiToken?: string } | undefined

  // Verify Chargily payment on return from checkout
  useEffect(() => {
    const checkoutId = platformUser?.checkoutId || checkoutIdParam
    if (payment === 'success' && paymentTier && checkoutId && email) {
      verifySubscriptionPayment({
        data: {
          checkoutId,
          tier: paymentTier as 'starter' | 'pro' | 'agency',
          userEmail: email,
        },
      }).catch(console.error)
    }
  }, [payment, paymentTier, checkoutIdParam, platformUser?.checkoutId, email])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const tier = platformUser?.tier

  if (!tier) {
    return <SubscriptionGate email={email} autoPlan={autoPlan} />
  }

  // Show onboarding welcome page to new users who haven't configured credentials
  const hasCreds = !!(platformUser?.cfAccountId)

  if (!hasCreds && !onboardingSkipped) {
    return (
      <OnboardingWelcome
        email={email}
        tier={tier}
        platformUserId={platformUser?.id}
        onDone={() => {
          // creds saved → re-render will pick them up via db.useQuery
        }}
        onSkip={() => {
          localStorage.setItem('7aba:setup_dismissed', '1')
          setOnboardingSkipped(true)
        }}
      />
    )
  }

  return <StoresDashboard email={email} tier={tier} platformUserId={platformUser?.id} hasCreds={hasCreds} />
}

// ─── Onboarding welcome ────────────────────────────────────────────────────────

function OnboardingWelcome({
  email,
  tier,
  platformUserId,
  onDone,
  onSkip,
}: {
  email: string
  tier: string
  platformUserId?: string
  onDone: () => void
  onSkip: () => void
}) {
  const navigate = useNavigate()
  const { dir } = useLang()
  const [saving, setSaving] = useState(false)
  const [fields, setFields] = useState({ cfAccountId: '', cfApiToken: '', instantAppId: '', instantAdminToken: '' })

  const handleSave = async () => {
    if (!platformUserId || !fields.cfAccountId || !fields.cfApiToken) return
    setSaving(true)
    try {
      await db.transact(
        (db.tx.platformUsers as any)[platformUserId].update({
          cfAccountId: fields.cfAccountId.trim(),
          cfApiToken: fields.cfApiToken.trim(),
          instantAppId: fields.instantAppId.trim() || null,
          instantAdminToken: fields.instantAdminToken.trim() || null,
        })
      )
      onDone()
      navigate({ to: '/dashboard' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir={dir}>
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-black text-2xl">7</span>
          </div>
          <h1 className="text-2xl font-bold">مرحباً بك في 7aba.store! 🎉</h1>
          <p className="text-muted-foreground text-sm">
            لنشر متاجرك، نحتاج بيانات Cloudflare الخاصة بك مرة واحدة فقط. يمكنك تخطي هذه الخطوة الآن وإضافتها لاحقاً من الإعدادات.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold flex items-center gap-2">
            <Key size={16} className="text-primary" />
            بيانات Cloudflare
          </h2>
          <p className="text-xs text-muted-foreground">
            احصل على البيانات من{" "}
            <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              dash.cloudflare.com/profile/api-tokens
            </a>
          </p>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Account ID <span className="text-destructive">*</span></label>
              <input
                type="text"
                dir="ltr"
                value={fields.cfAccountId}
                onChange={(e) => setFields((f) => ({ ...f, cfAccountId: e.target.value }))}
                placeholder="abc123..."
                className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">API Token <span className="text-destructive">*</span></label>
              <input
                type="password"
                dir="ltr"
                value={fields.cfApiToken}
                onChange={(e) => setFields((f) => ({ ...f, cfApiToken: e.target.value }))}
                placeholder="••••••••"
                className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <h2 className="font-bold flex items-center gap-2 pt-2">
            <Globe size={16} className="text-primary" />
            بيانات InstantDB <span className="text-xs font-normal text-muted-foreground">(اختياري — يُنشأ تلقائياً)</span>
          </h2>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">App ID</label>
              <input
                type="text"
                dir="ltr"
                value={fields.instantAppId}
                onChange={(e) => setFields((f) => ({ ...f, instantAppId: e.target.value }))}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Admin Token</label>
              <input
                type="password"
                dir="ltr"
                value={fields.instantAdminToken}
                onChange={(e) => setFields((f) => ({ ...f, instantAdminToken: e.target.value }))}
                placeholder="••••••••"
                className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !fields.cfAccountId || !fields.cfApiToken}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            حفظ والمتابعة
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            تخطي الآن
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Subscription gate ─────────────────────────────────────────────────────────

// Tiers come from the canonical config (src/config/pricing.ts) so this gate can
// never drift from the marketing pages or the Chargily charge amounts.
const RUN_ONE_MSG_AR = 'مرحباً، أنا مهتم بباقة Run One على 7aba.'

function SubscriptionGate({ email, autoPlan }: { email: string; autoPlan?: string }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { t, dir, lang } = useLang()

  const handleBuy = async (tier: 'starter' | 'pro' | 'agency') => {
    setLoading(tier)
    setError(null)
    try {
      const result = await createSubscriptionCheckout({
        data: { tier, userId: email, userEmail: email },
      })
      window.location.href = result.checkoutUrl
    } catch (e: any) {
      setError(e.message || 'حدث خطأ')
      setLoading(null)
    }
  }

  useEffect(() => {
    // Only auto-start checkout for instant (chargily) tiers. Contact tiers (Run One)
    // must never auto-hit checkout — they route to WhatsApp instead.
    const buyable = PRICING_TIERS.filter((x) => x.checkout === 'chargily').map((x) => x.id)
    if (autoPlan && (buyable as string[]).includes(autoPlan)) {
      handleBuy(autoPlan as 'starter' | 'pro' | 'agency')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlan])

  return (
    <div className="min-h-screen bg-background p-6" dir={dir}>
      <DashboardHeader email={email} />
      <div className="max-w-5xl mx-auto mt-10 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">{t(DT.choosePlan)}</h2>
          <p className="text-muted-foreground">{t(ONCE_LABEL)} — {t({ ar: 'الأسعار ترتفع بعد الدفعة الأولى', fr: 'les tarifs montent après la 1re vague', en: 'prices rise after the first batch' })}</p>
          <div className="flex justify-center">
            <FirstBatchCountdown variant="light" />
          </div>
        </div>
        {error && <p className="text-destructive text-center text-sm">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'rounded-2xl border p-6 space-y-5 flex flex-col',
                tier.accent && 'border-primary shadow-lg',
              )}
            >
              <div>
                <p className="font-bold text-lg">{t(tier.name)}</p>
                <p className="text-2xl font-black mt-1">{t(tier.priceLabel)}</p>
                <p className="text-xs text-muted-foreground">{t(ONCE_LABEL)}</p>
                <p className="text-xs text-red-600 font-bold mt-1.5 line-through">{t(tier.afterLabel)}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {tier.features[lang].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {tier.checkout === 'contact' ? (
                <a
                  href={contactWhatsappUrl(RUN_ONE_MSG_AR)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl font-semibold transition-colors border border-border hover:bg-muted text-center"
                >
                  {t({ ar: 'تواصل معنا', fr: 'Contactez-nous', en: 'Contact us' })}
                </a>
              ) : (
                <button
                  onClick={() => handleBuy(tier.id)}
                  disabled={!!loading}
                  className={cn(
                    'w-full py-3 rounded-xl font-semibold transition-colors',
                    tier.accent
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border hover:bg-muted',
                    loading === tier.id && 'opacity-60 cursor-not-allowed',
                  )}
                >
                  {loading === tier.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    t(DT.subscribeNow)
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Stores dashboard ──────────────────────────────────────────────────────────

interface StoreSettingsData {
  id: string
  name: string
  cfAccountId?: string
  cfApiToken?: string
  instantAppId?: string
  instantAdminToken?: string
}

function StoresDashboard({
  email,
  tier,
  platformUserId,
  hasCreds,
}: {
  email: string
  tier: string
  platformUserId?: string
  hasCreds: boolean
}) {
  const { t, dir } = useLang()
  const navigate = useNavigate()
  const [settingsStore, setSettingsStore] = useState<StoreSettingsData | null>(null)

  const { data, isLoading } = db.useQuery({
    stores: { $: { where: { userId: email } } },
  })
  const stores = (data?.stores ?? []) as any[]

  return (
    <div className="min-h-screen bg-background p-6" dir={dir}>
      <DashboardHeader email={email} tier={tier} />

      <div className="max-w-6xl mx-auto mt-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{t(DT.myStores)}</h2>
            <button
              onClick={() => navigate({ to: '/dashboard/new-store' })}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {t(DT.newStore)}
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : stores.length === 0 ? (
            <EmptyStores onNew={() => navigate({ to: '/dashboard/new-store' })} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stores.map((store: any) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  tier={tier}
                  hasCreds={hasCreds}
                  onSettings={() =>
                    setSettingsStore({
                      id: store.id,
                      name: store.config?.meta?.name ?? store.slug ?? store.id,
                      cfAccountId: store.cfAccountId,
                      cfApiToken: store.cfApiToken,
                      instantAppId: store.instantAppId,
                      instantAdminToken: store.instantAdminToken,
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Downloads panel — pro / agency only */}
        {(tier === 'pro' || tier === 'agency') && (
          <DownloadsPanel tier={tier} userEmail={email} />
        )}
      </div>

      {settingsStore && (
        <StoreSettingsModal
          storeId={settingsStore.id}
          storeName={settingsStore.name}
          initialValues={{
            cfAccountId: settingsStore.cfAccountId,
            cfApiToken: settingsStore.cfApiToken,
            instantAppId: settingsStore.instantAppId,
            instantAdminToken: settingsStore.instantAdminToken,
          }}
          onClose={() => setSettingsStore(null)}
          onDeleted={() => setSettingsStore(null)}
        />
      )}
    </div>
  )
}

// ─── Store card ────────────────────────────────────────────────────────────────

function StoreCard({
  store,
  tier,
  hasCreds,
  onSettings,
}: {
  store: any
  tier: string
  hasCreds: boolean
  onSettings: () => void
}) {
  const navigate = useNavigate()
  const { t, dir } = useLang()
  const isRtl = dir === 'rtl'
  const name = store.config?.meta?.name || store.slug || store.id
  const status = store.status ?? 'draft'

  const handleDeploy = () => {
    if (!hasCreds) {
      navigate({ to: '/dashboard/settings', search: { from: 'deploy' } as any })
      return
    }
    navigate({
      to: '/dashboard/deploy',
      search: { storeId: store.id, tier: tier as 'starter' | 'pro' | 'agency' },
    })
  }

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="font-bold truncate">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">{store.slug}</p>
        </div>
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded-full shrink-0',
            status === 'live'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {status === 'live' ? t(DT.live) : t(DT.draft)}
        </span>
      </div>

      {store.deployedUrl && (
        <a
          href={store.deployedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:underline truncate"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          {store.deployedUrl}
        </a>
      )}

      {!hasCreds && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 border border-border">
          <AlertCircle size={13} className="shrink-0 mt-0.5 text-foreground/60" />
          <span>يلزم إعداد Cloudflare للنشر</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => navigate({ to: '/dashboard/builder', search: { storeId: store.id, plan: '' } })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
        >
          <Store className="h-3.5 w-3.5" />
          {t(DT.edit)}
        </button>
        <button
          onClick={handleDeploy}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm transition-colors',
            hasCreds
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground border border-border hover:bg-accent'
          )}
        >
          <Rocket className="h-3.5 w-3.5" />
          {t(DT.deploy)}
        </button>
        <button
          onClick={onSettings}
          className="p-2 rounded-lg border hover:bg-muted transition-colors"
          title="الإعدادات"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Downloads panel ───────────────────────────────────────────────────────────

function DownloadsPanel({ tier, userEmail }: { tier: string; userEmail: string }) {
  const [downloading, setDownloading] = useState<DownloadType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLang()

  const handleDownload = async (downloadType: DownloadType) => {
    setDownloading(downloadType)
    setError(null)
    try {
      const result = await getDownloadUrl({ data: { downloadType, userEmail } })
      const a = document.createElement('a')
      a.href = result.url
      a.download = ''
      a.click()
    } catch (e: any) {
      setError(e.message || 'حدث خطأ أثناء التحميل')
    } finally {
      setDownloading(null)
    }
  }

  const items: { type: DownloadType; label: string; icon: React.ReactNode; tiers: string[] }[] = [
    { type: 'store-source', label: 'كود المتجر (React)', icon: <Package className="h-5 w-5" />, tiers: ['pro', 'agency'] },
    { type: 'store-app', label: 'كود التطبيق (Mobile)', icon: <Smartphone className="h-5 w-5" />, tiers: ['pro', 'agency'] },
    { type: 'platform-source', label: 'كود المنصة كاملاً', icon: <Code2 className="h-5 w-5" />, tiers: ['agency'] },
  ]

  const available = items.filter((i) => i.tiers.includes(tier))

  return (
    <div className="rounded-2xl border p-6 space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Download className="h-5 w-5 text-primary" />
        {t(DT.downloads)}
      </h3>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {available.map((item) => (
          <button
            key={item.type}
            onClick={() => handleDownload(item.type)}
            disabled={!!downloading}
            className="flex items-center gap-3 p-4 rounded-xl border hover:bg-muted transition-colors text-right disabled:opacity-60"
          >
            <span className="text-primary">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
            {downloading === item.type && (
              <Loader2 className="h-4 w-4 animate-spin mr-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyStores({ onNew }: { onNew: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed p-12 text-center space-y-4">
      <Store className="h-10 w-10 text-muted-foreground mx-auto" />
      <div>
        <p className="font-semibold">لا يوجد متاجر بعد</p>
        <p className="text-sm text-muted-foreground mt-1">أنشئ متجرك الأول الآن</p>
      </div>
      <button
        onClick={onNew}
        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
      >
        إنشاء متجر
      </button>
    </div>
  )
}

// ─── Header ────────────────────────────────────────────────────────────────────

function DashboardHeader({ email, tier }: { email: string; tier?: string }) {
  const { t, setLang, lang } = useLang()
  const navigate = useNavigate()
  const tierLabels: Record<string, { ar: string; fr: string; en: string }> = {
    starter: { ar: 'مبتدئ', fr: 'Starter', en: 'Starter' },
    pro: { ar: 'احترافي', fr: 'Pro', en: 'Pro' },
    agency: { ar: 'وكالة', fr: 'Agence', en: 'Agency' },
  }

  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">
          7
        </div>
        <span className="font-bold text-lg">7aba.store</span>
        {tier && (
          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            {tier in tierLabels ? t(tierLabels[tier]) : tier}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground hidden sm:block">{email}</p>
        <button
          onClick={() => navigate({ to: '/dashboard/settings', search: {} as any })}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={t(DT.settings)}
        >
          <Settings className="h-4 w-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs font-semibold">
              <Globe className="h-4 w-4" />
              {lang.toUpperCase()}
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLang('ar')} className={lang === 'ar' ? 'font-semibold' : ''}>العربية</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('fr')} className={lang === 'fr' ? 'font-semibold' : ''}>Français</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('en')} className={lang === 'en' ? 'font-semibold' : ''}>English</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={() => db.auth.signOut()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t(DT.logout)}
        </button>
      </div>
    </header>
  )
}
