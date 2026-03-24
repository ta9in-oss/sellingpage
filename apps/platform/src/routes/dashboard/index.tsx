import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

import { db } from '@/lib/instantdb'
import { id } from '@instantdb/react'
import { cn } from '@/lib/utils'
import { AuthModal } from '@/components/auth/AuthModal'
import { StoreSettingsModal } from '@/components/dashboard/StoreSettingsModal'
import { createSubscriptionCheckout } from '@/server/createSubscriptionCheckout'
import { verifySubscriptionPayment } from '@/server/verifySubscriptionPayment'
import {
  Plus, Settings, ExternalLink, LogOut, Store, Rocket, ChevronRight,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  validateSearch: (search): { payment?: string; tier?: string; checkout_id?: string } => ({
    payment: (search.payment as string) || undefined,
    tier: (search.tier as string) || undefined,
    checkout_id: (search.checkout_id as string) || undefined,
  }),
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <>
      <DashboardInner />
    </>
  )
}

function DashboardInner() {
  const { user, isLoading } = db.useAuth()
  const search = Route.useSearch()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-spin">⏳</div>
          <p className="text-zinc-500 text-sm">جارٍ التحقق من الحساب...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <SubscriptionGate
      userId={user.id}
      userEmail={user.email ?? ''}
      paymentStatus={search.payment}
      paymentTier={search.tier}
      checkoutId={search.checkout_id}
    />
  )
}

// ─── Auth screen ──────────────────────────────────────────────────────────────

function AuthScreen() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center" dir="rtl">
      <div className="text-center mb-8">
        <Link to="/">
          <img src="/assets/logo/7aba_store_logo_i1.svg" alt="7aba.store" className="h-12 mx-auto mb-4"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/logo/7aba_store_logo_i1.png' }} />
        </Link>
        <h1 className="text-2xl font-black">لوحة التحكم</h1>
        <p className="text-sm text-zinc-500 mt-1">سجّل دخولك للمتابعة</p>
      </div>
      <AuthModal
        title="تسجيل الدخول"
        subtitle="أنشئ حساباً أو ادخل بحسابك لإدارة متاجرك"
      />
    </div>
  )
}

// ─── Subscription gate ────────────────────────────────────────────────────────

function SubscriptionGate({
  userId,
  userEmail,
  paymentStatus,
  paymentTier,
  checkoutId,
}: {
  userId: string
  userEmail: string
  paymentStatus?: string
  paymentTier?: string
  checkoutId?: string
}) {
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const { data } = db.useQuery({
    platformUsers: { $: { where: { id: userId } } },
  })

  const platformUser = (data as any)?.platformUsers?.[0]
  const tier: string | undefined = platformUser?.tier

  // Handle Chargily return with payment=success
  useEffect(() => {
    if (paymentStatus !== 'success' || !paymentTier || !checkoutId || tier) return
    ;(async () => {
      setVerifying(true)
      setVerifyError(null)
      try {
        const result = await verifySubscriptionPayment({
          data: { checkoutId, tier: paymentTier as 'starter' | 'pro' | 'agency', userEmail },
        })
        if (!result.success) {
          setVerifyError('لم يتم تأكيد الدفع بعد. إذا دفعت بالفعل، انتظر لحظة ثم أعد تحديث الصفحة.')
        } else {
          // Clear URL search params
          navigate({ to: '/dashboard', replace: true })
        }
      } catch (e: unknown) {
        setVerifyError((e as Error)?.message ?? 'خطأ في التحقق من الدفع.')
      } finally {
        setVerifying(false)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus, paymentTier, checkoutId])

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-3">
          <div className="text-3xl animate-spin">⏳</div>
          <p className="font-black">جارٍ التحقق من الدفع...</p>
          <p className="text-sm text-zinc-500">الرجاء الانتظار</p>
        </div>
      </div>
    )
  }

  if (!tier) {
    return (
      <PaywallDashboard
        userId={userId}
        userEmail={userEmail}
        verifyError={verifyError}
        paymentFailed={paymentStatus === 'failed'}
      />
    )
  }

  return <StoresDashboard userId={userId} userEmail={userEmail} tier={tier} />
}

// ─── Paywall ──────────────────────────────────────────────────────────────────

const TIER_DEFS = [
  {
    id: 'starter' as const,
    name: 'مبتدئ',
    price: '3,900 DZD',
    accent: false,
    badge: null,
    features: ['إنشاء ونشر المتاجر', 'لوحة إدارة الطلبات', 'دفع COD + Chargily'],
  },
  {
    id: 'pro' as const,
    name: 'احترافي',
    price: '14,900 DZD',
    accent: true,
    badge: 'الأكثر شيوعاً',
    features: ['كل ما في مبتدئ', 'تحميل كود المتجر', 'تحميل كود التطبيق'],
  },
  {
    id: 'agency' as const,
    name: 'وكالة',
    price: '49,000 DZD',
    accent: false,
    badge: null,
    features: ['كل ما في احترافي', 'كود المنصة كاملاً', 'حق إعادة البيع'],
  },
]

function PaywallDashboard({
  userId,
  userEmail,
  verifyError,
  paymentFailed,
}: {
  userId: string
  userEmail: string
  verifyError: string | null
  paymentFailed: boolean
}) {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleBuy = async (tierId: 'starter' | 'pro' | 'agency') => {
    setCheckoutLoading(tierId)
    setCheckoutError(null)
    try {
      const result = await createSubscriptionCheckout({ data: { tier: tierId, userId, userEmail } })
      window.location.href = result.checkoutUrl
    } catch (e: unknown) {
      setCheckoutError((e as Error)?.message ?? 'تعذر إنشاء الدفع. حاول مجدداً.')
    } finally {
      setCheckoutLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50" dir="rtl">
      <DashboardHeader userEmail={userEmail} showLogout />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-2">اختر باقتك</h1>
          <p className="text-zinc-500">دفع مرة واحدة — بدون اشتراكات شهرية</p>
        </div>

        {(verifyError || paymentFailed || checkoutError) && (
          <div className="border-2 border-red-400 bg-red-50 p-4 text-sm text-red-700 mb-8 max-w-md mx-auto">
            {verifyError ?? (paymentFailed ? 'فشل الدفع. حاول مجدداً.' : checkoutError)}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIER_DEFS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'border-2 border-black p-7 shadow-[4px_4px_0px_0px_#000] flex flex-col relative',
                tier.accent ? 'bg-yellow-400 shadow-[6px_6px_0px_0px_#000]' : 'bg-white'
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-yellow-400 text-xs font-black px-3 py-0.5 whitespace-nowrap">
                  {tier.badge}
                </span>
              )}
              <h2 className="text-xl font-black mb-1">{tier.name}</h2>
              <p className="text-2xl font-black mb-5">{tier.price}</p>
              <ul className="flex-1 space-y-2 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuy(tier.id)}
                disabled={!!checkoutLoading}
                className={cn(
                  'w-full py-3 border-2 border-black text-sm font-black transition-all',
                  tier.accent
                    ? 'bg-black text-yellow-400 hover:bg-zinc-900'
                    : 'bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]',
                  checkoutLoading === tier.id && 'opacity-60 cursor-not-allowed'
                )}
              >
                {checkoutLoading === tier.id ? 'جارٍ التحويل...' : 'اشترك الآن'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

function StoresDashboard({ userId, userEmail, tier }: { userId: string; userEmail: string; tier: string }) {
  const navigate = useNavigate()
  const [settingsStore, setSettingsStore] = useState<null | {
    id: string; name: string
    cfAccountId?: string; cfApiToken?: string
    instantAppId?: string; instantAdminToken?: string
  }>(null)

  const { data } = db.useQuery({ stores: { $: { where: { userId } } } })
  const stores = ((data as any)?.stores ?? []) as any[]

  const handleNewStore = () => {
    navigate({ to: '/dashboard/builder', search: { storeId: 'new', plan: tier } })
  }

  return (
    <div className="min-h-screen bg-zinc-50" dir="rtl">
      <DashboardHeader userEmail={userEmail} tier={tier} showLogout />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">متاجري</h1>
            <p className="text-sm text-zinc-500 mt-0.5">{stores.length} {stores.length === 1 ? 'متجر' : 'متاجر'}</p>
          </div>
          <button
            onClick={handleNewStore}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-black text-sm font-black bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <Plus size={15} /> متجر جديد
          </button>
        </div>

        {stores.length === 0 ? (
          <EmptyStores onNew={handleNewStore} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stores.map((store: any) => (
              <StoreCard
                key={store.id}
                store={store}
                onSettings={() => setSettingsStore({
                  id: store.id,
                  name: store.config?.meta?.name ?? store.slug ?? store.id,
                  cfAccountId: store.cfAccountId,
                  cfApiToken: store.cfApiToken,
                  instantAppId: store.instantAppId,
                  instantAdminToken: store.instantAdminToken,
                })}
              />
            ))}
          </div>
        )}
      </main>

      {settingsStore && (
        <StoreSettingsModal
          storeId={settingsStore.id}
          storeName={settingsStore.name}
          initialValues={settingsStore}
          onClose={() => setSettingsStore(null)}
        />
      )}
    </div>
  )
}

// ─── Store card ───────────────────────────────────────────────────────────────

function StoreCard({ store, onSettings }: { store: any; onSettings: () => void }) {
  const navigate = useNavigate()
  const name: string = store.config?.meta?.name ?? store.slug ?? store.id
  const slug: string = store.slug ?? ''
  const status: string = store.status ?? 'draft'
  const deployedUrl: string | undefined = store.deployedUrl

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col">
      <div className="p-5 border-b-2 border-black flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 border-2 border-black bg-yellow-400 flex items-center justify-center shrink-0">
            <Store size={16} />
          </div>
          <div className="min-w-0">
            <p className="font-black text-sm truncate">{name}</p>
            <p className="text-xs text-zinc-400 font-mono truncate">{slug}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {deployedUrl && (
        <div className="px-5 py-2.5 border-b border-zinc-100">
          <a href={deployedUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-mono truncate">
            <ExternalLink size={11} />{deployedUrl.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}

      <div className="p-4 flex gap-2 mt-auto">
        <button
          onClick={() => navigate({ to: '/dashboard/builder', search: { storeId: store.id, plan: '' } })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold border-2 border-black bg-white hover:bg-yellow-400 transition-colors"
        >
          <ChevronRight size={12} /> المحرر
        </button>
        <button
          onClick={() => navigate({ to: '/dashboard/deploy', search: { storeId: store.id, tier: 'starter' } })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold border-2 border-black bg-white hover:bg-yellow-400 transition-colors"
        >
          <Rocket size={12} /> نشر
        </button>
        <button
          onClick={onSettings}
          className="w-9 flex items-center justify-center border-2 border-black bg-white hover:bg-zinc-100 transition-colors"
          title="إعدادات النشر"
          aria-label="إعدادات النشر"
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    live: 'bg-green-100 text-green-800 border-green-300',
    draft: 'bg-zinc-100 text-zinc-600 border-zinc-300',
    deploying: 'bg-blue-100 text-blue-800 border-blue-300',
    failed: 'bg-red-100 text-red-700 border-red-300',
  }
  const labels: Record<string, string> = { live: 'مباشر', draft: 'مسودة', deploying: 'جارٍ النشر', failed: 'فشل' }
  return (
    <span className={cn('text-[10px] font-bold px-2 py-0.5 border rounded-full shrink-0', styles[status] ?? styles.draft)}>
      {labels[status] ?? status}
    </span>
  )
}

function EmptyStores({ onNew }: { onNew: () => void }) {
  return (
    <div className="border-2 border-dashed border-zinc-300 py-20 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 border-2 border-black bg-yellow-400 flex items-center justify-center">
        <Store size={28} />
      </div>
      <div>
        <p className="font-black text-lg">لا توجد متاجر بعد</p>
        <p className="text-sm text-zinc-500 mt-1">أنشئ متجرك الأول في دقائق</p>
      </div>
      <button
        onClick={onNew}
        className="flex items-center gap-2 px-5 py-2.5 border-2 border-black text-sm font-black bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
      >
        <Plus size={15} /> إنشاء متجر
      </button>
    </div>
  )
}

// ─── Shared header ────────────────────────────────────────────────────────────

function DashboardHeader({ userEmail, tier, showLogout }: { userEmail: string; tier?: string; showLogout?: boolean }) {
  const TIER_LABELS: Record<string, string> = { starter: 'مبتدئ', pro: 'احترافي', agency: 'وكالة' }
  return (
    <header className="h-14 border-b-2 border-black bg-white flex items-center px-5 gap-4" dir="rtl">
      <Link to="/">
        <img src="/assets/logo/7aba_store_logo_i1.svg" alt="7aba.store" className="h-7 w-auto"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/logo/7aba_store_logo_i1.png' }} />
      </Link>
      <div className="ms-auto flex items-center gap-3">
        {tier && (
          <span className="text-[10px] font-black px-2 py-0.5 border-2 border-black bg-yellow-400">
            {TIER_LABELS[tier] ?? tier}
          </span>
        )}
        <span className="text-xs text-zinc-500 hidden sm:block">{userEmail}</span>
        {showLogout && (
          <button onClick={() => db.auth.signOut()}
            className="p-1.5 border-2 border-transparent hover:border-black transition-colors text-zinc-400 hover:text-black"
            title="خروج" aria-label="خروج">
            <LogOut size={14} />
          </button>
        )}
      </div>
    </header>
  )
}
