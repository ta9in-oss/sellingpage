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
import { trackPixel } from '@/lib/pixel'
import { TIERS as PRICING_TIERS, ONCE_LABEL, contactWhatsappUrl } from '@/config/pricing'
import { FirstBatchCountdown } from '@/components/marketing/FirstBatchCountdown'
import { LanguageSelect } from '@/components/marketing/LanguageSelect'
import { getDownloadUrl } from '@/server/getDownloadUrl'
import { saveMerchantSecrets } from '@/server/saveMerchantSecrets'
import type { DownloadType } from '@/server/getDownloadUrl'
import {
  Plus, Settings, ExternalLink, LogOut, Store, Rocket,
  Download, Package, Smartphone, Code2, Loader2, CheckCircle2,
  Globe, Key, ChevronDown, ChevronUp, Save, AlertCircle, ArrowRight, ArrowLeft, Sparkles, Award,
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

const RUN_ONE_MSG = {
  ar: 'مرحباً، أنا مهتم بباقة Run One على 7aba.',
  fr: 'Bonjour, je suis intéressé par le forfait Run One sur 7aba.',
  en: 'Hi, I am interested in the Run One plan on 7aba.',
}

const DT = {
  loginTitle: { ar: 'الدخول للوحة التحكم', fr: 'Accès au tableau de bord', en: 'Dashboard Login' },
  loginBtn: { ar: 'تسجيل الدخول', fr: 'Se connecter', en: 'Sign in' },
  choosePlan: { ar: 'اختر باقتك', fr: 'Choisissez votre forfait', en: 'Choose your plan' },
  subscribeNow: { ar: 'اشترك الآن', fr: "S'abonner", en: 'Subscribe now' },
  myStores: { ar: 'متاجرك', fr: 'Mes boutiques', en: 'My stores' },
  newStore: { ar: 'متجر جديد', fr: 'Nouvelle boutique', en: 'New store' },
  live: { ar: 'شغّال', fr: 'En ligne', en: 'Live' },
  whatsNew: { ar: 'ما الجديد', fr: 'Nouveautés', en: "What's new" },
  founderCertificate: {
    ar: 'شهادة العضو المؤسس',
    fr: 'Certificat de membre fondateur',
    en: 'Founding member certificate',
  },
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
            <h1 className="text-2xl font-bold">7aba.app</h1>
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
  const navigate = useNavigate()
  const { data, isLoading } = db.useQuery({
    platformUsers: { $: { where: { email } } },
  })
  const platformUser = (data?.platformUsers ?? [])[0] as
    | { id: string; email: string; tier?: string; checkoutId?: string; cfAccountId?: string; cfApiToken?: string; founderCode?: string; founderBatch?: string; purchasedAt?: number } | undefined

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
      })
        .then((r) => {
          if ((r as any)?.success) {
            const price = PRICING_TIERS.find((x) => x.id === paymentTier)?.priceDzd
            trackPixel('Purchase', { value: price, currency: 'DZD', content_name: paymentTier })
            // Verification is what mints the founder code, so this is the first
            // moment the certificate exists. Hand it to the buyer immediately;
            // `replace` keeps the payment query params out of history, so a
            // back-navigation can't re-trigger verification.
            navigate({ to: '/dashboard/certificate', replace: true })
          }
        })
        .catch(console.error)
    }
  }, [payment, paymentTier, checkoutIdParam, platformUser?.checkoutId, email, navigate])

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

  // New merchants land straight on their (empty) dashboard; the dashboard itself
  // prompts them to connect Cloudflare/InstantDB, and publish enforces it.
  const hasCreds = !!(platformUser?.cfAccountId)

  return (
    <StoresDashboard
      email={email}
      tier={tier}
      platformUserId={platformUser?.id}
      hasCreds={hasCreds}
      founderCode={platformUser?.founderCode}
    />
  )
}

// ─── Onboarding welcome ────────────────────────────────────────────────────────

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
      const price = PRICING_TIERS.find((x) => x.id === tier)?.priceDzd
      trackPixel('InitiateCheckout', { value: price, currency: 'DZD', content_name: tier })
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
      <DashboardHeader email={email} showSettings={false} />
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
                <p className="text-sm text-muted-foreground line-through mt-1">{t(tier.normalPriceLabel)}</p>
                <p className="text-2xl font-black -mt-0.5">{t(tier.priceLabel)}</p>
                <p className="text-xs text-muted-foreground">{t(ONCE_LABEL)}</p>
                <p className="text-sm text-red-600 font-bold -mt-0.5">{t(tier.afterLabel)}</p>
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
                  href={contactWhatsappUrl(t(RUN_ONE_MSG))}
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
  googleAnalyticsId?: string
  clarityId?: string
  metaPixelId?: string
  customDomain?: string
  chargilyPublicKey?: string
  hasChargilySecret?: boolean
}

function StoresDashboard({
  email,
  tier,
  platformUserId,
  hasCreds,
  founderCode,
}: {
  email: string
  tier: string
  platformUserId?: string
  hasCreds: boolean
  founderCode?: string
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
      <DashboardHeader email={email} tier={tier} hasCertificate={!!founderCode} />

      <div className="max-w-6xl mx-auto mt-8 space-y-8">
        {!hasCreds && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-bold text-sm">اربط Cloudflare و InstantDB</p>
              <p className="text-xs text-muted-foreground">
                تحتاجها مرة واحدة لنشر متاجرك. يمكنك بناء متجرك الآن وإضافتها قبل النشر.
              </p>
            </div>
            <button
              onClick={() => navigate({ to: '/dashboard/settings' })}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
            >
              اربط الآن
            </button>
          </div>
        )}

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
                      googleAnalyticsId: store.googleAnalyticsId,
                      clarityId: store.clarityId,
                      metaPixelId: store.metaPixelId,
                      customDomain: store.customDomain,
                      chargilyPublicKey: store.chargilyPublicKey,
                      // Presence only — the stored value is ciphertext and the
                      // modal must never render it back.
                      hasChargilySecret: !!store.chargilyApiKey,
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
          initialAnalytics={{
            googleAnalyticsId: settingsStore.googleAnalyticsId,
            clarityId: settingsStore.clarityId,
            metaPixelId: settingsStore.metaPixelId,
            customDomain: settingsStore.customDomain,
            chargilyPublicKey: settingsStore.chargilyPublicKey,
            hasChargilySecret: settingsStore.hasChargilySecret,
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
  // A store is live once the daemon reports it: it writes deployStatus:'live' +
  // status:'published' + deployedUrl. The card must accept any of those, not the
  // literal 'live' status (which the daemon never writes).
  const isLive =
    store.deployStatus === 'live' ||
    store.status === 'published' ||
    store.status === 'live' ||
    !!store.deployedUrl

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
            isLive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {isLive ? t(DT.live) : t(DT.draft)}
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

function DashboardHeader({
  email,
  tier,
  showSettings = true,
  hasCertificate = false,
}: {
  email: string
  tier?: string
  showSettings?: boolean
  hasCertificate?: boolean
}) {
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
        <span className="font-bold text-lg">7aba.app</span>
        {tier && (
          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            {tier in tierLabels ? t(tierLabels[tier]) : tier}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground hidden sm:block">{email}</p>
        {hasCertificate && (
          <button
            onClick={() => navigate({ to: '/dashboard/certificate' })}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={t(DT.founderCertificate)}
          >
            <Award className="h-4 w-4" />
          </button>
        )}
        {showSettings && (
          <button
            onClick={() => navigate({ to: '/dashboard/whats-new' })}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={t(DT.whatsNew)}
          >
            <Sparkles className="h-4 w-4" />
          </button>
        )}
        {showSettings && (
          <button
            onClick={() => navigate({ to: '/dashboard/settings', search: {} as any })}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={t(DT.settings)}
          >
            <Settings className="h-4 w-4" />
          </button>
        )}
        <LanguageSelect />
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
