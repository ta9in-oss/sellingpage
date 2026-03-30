/**
 * /dashboard — main merchant dashboard
 *
 * Flow:
 *   1. Not authed → show AuthModal
 *   2. Authed, no subscription → show SubscriptionGate (pricing page inline)
 *   3. Authed + subscribed → show StoresDashboard + DownloadsPanel
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { id } from '@instantdb/react'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { AuthModal } from '@/components/auth/AuthModal'
import { StoreSettingsModal } from '@/components/dashboard/StoreSettingsModal'
import { createSubscriptionCheckout } from '@/server/createSubscriptionCheckout'
import { verifySubscriptionPayment } from '@/server/verifySubscriptionPayment'
import { getDownloadUrl } from '@/server/getDownloadUrl'
import type { DownloadType } from '@/server/getDownloadUrl'
import {
  Plus, Settings, ExternalLink, LogOut, Store, Rocket,
  Download, Package, Smartphone, Code2, Loader2, CheckCircle2,
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
}

function DashboardPage() {
  const { payment, tier, checkout_id, plan } = Route.useSearch()
  const { isLoading, user } = db.useAuth()
  const { t, dir } = useLang()
  const [showAuth, setShowAuth] = useState(false)

  // Verify Chargily payment on return from checkout
  useEffect(() => {
    if (payment === 'success' && tier && checkout_id && user?.email) {
      verifySubscriptionPayment({
        data: {
          checkoutId: checkout_id,
          tier: tier as 'starter' | 'pro' | 'agency',
          userEmail: user.email,
        },
      }).catch(console.error)
    }
  }, [payment, tier, checkout_id, user?.email])

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

  return <AuthenticatedDashboard email={user.email} autoPlan={plan} />
}

// ─── Authenticated shell ───────────────────────────────────────────────────────

function AuthenticatedDashboard({ email, autoPlan }: { email: string; autoPlan?: string }) {
  const { data, isLoading } = db.useQuery({
    platformUsers: { $: { where: { email } } },
  })

  const platformUser = (data?.platformUsers ?? [])[0] as
    | { id: string; email: string; tier?: string } | undefined

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

  return <StoresDashboard email={email} tier={tier} />
}

// ─── Subscription gate ─────────────────────────────────────────────────────────

const TIERS: {
  id: 'starter' | 'pro' | 'agency'
  name: { ar: string; fr: string; en: string }
  price: string
  accent: boolean
  features: { ar: string[]; fr: string[]; en: string[] }
}[] = [
  {
    id: 'starter',
    name: { ar: 'مبتدئ', fr: 'Starter', en: 'Starter' },
    price: '3,900 دج',
    accent: false,
    features: {
      ar: ['إنشاء ونشر المتاجر', 'نطاق مخصص (Cloudflare)', 'لوحة إدارة الطلبات', 'دفع نقدي + Chargily', 'Google Analytics'],
      fr: ['Créer et publier des boutiques', 'Domaine personnalisé (Cloudflare)', 'Tableau de bord commandes', 'Paiement cash + Chargily', 'Google Analytics'],
      en: ['Create and publish stores', 'Custom domain (Cloudflare)', 'Orders dashboard', 'Cash + Chargily payment', 'Google Analytics'],
    },
  },
  {
    id: 'pro',
    name: { ar: 'احترافي', fr: 'Pro', en: 'Pro' },
    price: '14,900 دج',
    accent: true,
    features: {
      ar: ['كل ما في مبتدئ', 'تحميل كود المتجر', 'تحميل كود التطبيق', 'دعم ذو أولوية'],
      fr: ['Tout Starter', 'Télécharger code boutique', 'Télécharger code app', 'Support prioritaire'],
      en: ['Everything in Starter', 'Download store code', 'Download app code', 'Priority support'],
    },
  },
  {
    id: 'agency',
    name: { ar: 'وكالة', fr: 'Agence', en: 'Agency' },
    price: '49,000 دج',
    accent: false,
    features: {
      ar: ['كل ما في احترافي', 'كود المنصة كاملاً', 'متاجر غير محدودة', 'دعم مباشر'],
      fr: ['Tout Pro', 'Code plateforme complet', 'Boutiques illimitées', 'Support direct'],
      en: ['Everything in Pro', 'Full platform source code', 'Unlimited stores', 'Direct support'],
    },
  },
]

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

  // Auto-trigger checkout if plan was passed from pricing page
  useEffect(() => {
    const validPlans = ['starter', 'pro', 'agency'] as const
    if (autoPlan && (validPlans as readonly string[]).includes(autoPlan)) {
      handleBuy(autoPlan as 'starter' | 'pro' | 'agency')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlan])

  return (
    <div className="min-h-screen bg-background p-6" dir={dir}>
      <DashboardHeader email={email} />
      <div className="max-w-5xl mx-auto mt-10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{t(DT.choosePlan)}</h2>
          <p className="text-muted-foreground">اشترك الآن للبدء في بناء متجرك الإلكتروني</p>
        </div>
        {error && <p className="text-destructive text-center text-sm">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'rounded-2xl border p-6 space-y-5 flex flex-col',
                tier.accent && 'border-primary shadow-lg',
              )}
            >
              <div>
                <p className="font-bold text-lg">{t(tier.name)}</p>
                <p className="text-2xl font-black mt-1">{tier.price}</p>
                <p className="text-xs text-muted-foreground">دفعة واحدة</p>
              </div>
              <ul className="space-y-2 flex-1">
                {(lang === 'ar' ? tier.features.ar : lang === 'fr' ? tier.features.fr : tier.features.en).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
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

function StoresDashboard({ email, tier }: { email: string; tier: string }) {
  const navigate = useNavigate()
  const { t, dir } = useLang()
  const [settingsStore, setSettingsStore] = useState<StoreSettingsData | null>(null)

  const { data, isLoading } = db.useQuery({
    stores: { $: { where: { userId: email } } },
  })
  const stores = (data?.stores ?? []) as any[]

  const handleNewStore = async () => {
    const storeId = id()
    await db.transact(
      db.tx.stores[storeId].update({
        userId: email,
        slug: `store-${storeId.slice(0, 8)}`,
        status: 'draft',
        config: {
          meta: { name: 'متجر جديد', description: '' },
          theme: 'brutalist',
          sections: ['hero', 'order'],
          product: {},
          payment: { method: 'cod' },
        },
      }),
    )
    navigate({ to: '/dashboard/builder', search: { storeId, plan: '' } })
  }

  return (
    <div className="min-h-screen bg-background p-6" dir={dir}>
      <DashboardHeader email={email} tier={tier} />

      <div className="max-w-6xl mx-auto mt-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{t(DT.myStores)}</h2>
            <button
              onClick={handleNewStore}
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
            <EmptyStores onNew={handleNewStore} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stores.map((store: any) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  tier={tier}
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
        />
      )}
    </div>
  )
}

// ─── Store card ────────────────────────────────────────────────────────────────

function StoreCard({
  store,
  tier,
  onSettings,
}: {
  store: any
  tier: string
  onSettings: () => void
}) {
  const navigate = useNavigate()
  const { t } = useLang()
  const name = store.config?.meta?.name || store.slug || store.id
  const status = store.status ?? 'draft'

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="font-bold truncate">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">/{store.slug}</p>
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

      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => navigate({ to: '/dashboard/builder', search: { storeId: store.id, plan: '' } })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
        >
          <Store className="h-3.5 w-3.5" />
          {t(DT.edit)}
        </button>
        <button
          onClick={() =>
            navigate({
              to: '/dashboard/deploy',
              search: { storeId: store.id, tier: tier as 'starter' | 'pro' | 'agency' },
            })
          }
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
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
  const { t } = useLang()
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
