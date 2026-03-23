// apps/platform/src/routes/dashboard/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { db } from '@/lib/instantdb'
import { Plus, Store, Pencil, Rocket, LogOut, Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { isLoading, user, error } = db.useAuth()

  if (isLoading) return <FullScreenSpinner />
  if (error) return <FullScreenError message={error.message} />
  if (!user) return <LoginPage />

  return <StoresDashboard userId={user.id} userEmail={user.email ?? ''} />
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginPage() {
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendCode = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await db.auth.sendMagicCode({ email: email.trim().toLowerCase() })
      setCodeSent(true)
    } catch (e: unknown) {
      setError((e as Error).message || 'فشل إرسال الرمز')
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      await db.auth.signInWithMagicCode({ email: email.trim().toLowerCase(), code: code.trim() })
    } catch (e: unknown) {
      setError((e as Error).message || 'رمز غير صحيح')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm border-2 border-black p-8 shadow-[6px_6px_0px_#000] space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black">🏪 لوحة التحكم</h1>
          <p className="text-sm text-zinc-500">سجّل دخولك للوصول إلى متاجرك</p>
        </div>

        {!codeSent ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-bold">البريد الإلكتروني</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                  placeholder="example@email.com"
                  dir="ltr"
                  className="flex-1 border-2 border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-xs">{error}</p>}

            <button
              onClick={sendCode}
              disabled={loading || !email.trim()}
              className={cn(
                'w-full flex items-center justify-center gap-2 border-2 border-black px-4 py-3 font-bold text-sm transition-all',
                'bg-yellow-400 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]',
                (loading || !email.trim()) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              إرسال رمز الدخول
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
              <CheckCircle2 size={16} />
              تم إرسال رمز التحقق إلى {email}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold">رمز التحقق</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verify()}
                placeholder="123456"
                dir="ltr"
                maxLength={8}
                className="w-full border-2 border-black px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {error && <p className="text-red-600 text-xs">{error}</p>}

            <button
              onClick={verify}
              disabled={loading || !code.trim()}
              className={cn(
                'w-full flex items-center justify-center gap-2 border-2 border-black px-4 py-3 font-bold text-sm transition-all',
                'bg-yellow-400 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]',
                (loading || !code.trim()) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              تحقق ودخول
            </button>

            <button
              onClick={() => { setCodeSent(false); setCode(''); setError('') }}
              className="w-full text-xs text-zinc-400 hover:text-zinc-600 underline"
            >
              تغيير البريد الإلكتروني
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Stores Dashboard ─────────────────────────────────────────────────────────

type Store = {
  id: string
  slug: string
  status: string
  deployedUrl?: string
  config?: { plan?: string; meta?: { siteTitle?: string } }
  lastDeployAt?: number
}

function StoresDashboard({ userId, userEmail }: { userId: string; userEmail: string }) {
  const { data } = db.useQuery({
    stores: { $: { where: { userId } } },
  })

  const stores = (data?.stores ?? []) as Store[]

  const signOut = () => db.auth.signOut()

  return (
    <div className="min-h-screen bg-zinc-50" dir="rtl">
      {/* Header */}
      <header className="border-b-2 border-black bg-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black">🏪 7aba.store</span>
            <span className="text-xs text-zinc-400 border border-zinc-200 rounded px-2 py-0.5">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 hidden sm:block">{userEmail}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded px-3 py-1.5 transition-colors"
            >
              <LogOut size={14} />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Page title + Create button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">متاجرك</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {stores.length === 0 ? 'لم تنشئ أي متجر بعد' : `${stores.length} متجر`}
            </p>
          </div>
          <Link
            to="/dashboard/builder"
            search={{ storeId: 'new', plan: 'simple' }}
            className={cn(
              'flex items-center gap-2 border-2 border-black px-4 py-2.5 font-bold text-sm transition-all',
              'bg-yellow-400 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]'
            )}
          >
            <Plus size={16} />
            متجر جديد
          </Link>
        </div>

        {/* Empty state */}
        {stores.length === 0 && (
          <div className="border-2 border-dashed border-zinc-300 rounded-lg p-16 text-center space-y-4">
            <div className="text-5xl">🏪</div>
            <h2 className="text-lg font-bold">أنشئ متجرك الأول</h2>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              ابدأ ببناء متجرك الإلكتروني الآن. يستغرق الأمر أقل من دقيقة.
            </p>
            <Link
              to="/dashboard/builder"
              search={{ storeId: 'new', plan: 'simple' }}
              className={cn(
                'inline-flex items-center gap-2 border-2 border-black px-5 py-2.5 font-bold text-sm mt-2 transition-all',
                'bg-yellow-400 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]'
              )}
            >
              <Plus size={16} />
              أنشئ متجرك الآن
            </Link>
          </div>
        )}

        {/* Stores grid */}
        {stores.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function StoreCard({ store }: { store: Store }) {
  const title = store.config?.meta?.siteTitle || `متجر ${store.slug}`
  const plan = store.config?.plan || 'simple'

  const statusBadge: Record<string, { label: string; cls: string }> = {
    draft: { label: 'مسودة', cls: 'bg-zinc-100 text-zinc-600' },
    deployed: { label: 'منشور ✓', cls: 'bg-green-100 text-green-700' },
    deploying: { label: 'جارٍ النشر...', cls: 'bg-blue-100 text-blue-700' },
    failed: { label: 'فشل النشر', cls: 'bg-red-100 text-red-700' },
  }
  const badge = statusBadge[store.status] ?? statusBadge.draft

  return (
    <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all p-5 space-y-4">
      {/* Store icon + name */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center shrink-0">
            <Store size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm truncate">{title}</h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono truncate">{store.slug}</p>
          </div>
        </div>
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0', badge.cls)}>
          {badge.label}
        </span>
      </div>

      {/* Plan */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <span className="bg-zinc-100 px-2 py-0.5 rounded font-medium">{plan}</span>
        {store.deployedUrl && (
          <a
            href={store.deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate"
          >
            {store.deployedUrl.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Link
          to="/dashboard/builder"
          search={{ storeId: store.id, plan: '' }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 border-2 border-black px-3 py-2 text-xs font-bold transition-all',
            'bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
          )}
        >
          <Pencil size={12} />
          تعديل
        </Link>
        <Link
          to="/dashboard/deploy"
          search={{ storeId: store.id, tier: (plan as 'starter' | 'pro' | 'enterprise') }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 border-2 border-black px-3 py-2 text-xs font-bold transition-all',
            'bg-yellow-400 shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
          )}
        >
          <Rocket size={12} />
          نشر
        </Link>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FullScreenSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-zinc-400" />
    </div>
  )
}

function FullScreenError({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <div className="space-y-2">
        <p className="text-red-600 font-medium">خطأ في التحميل</p>
        <p className="text-sm text-zinc-500">{message}</p>
      </div>
    </div>
  )
}
