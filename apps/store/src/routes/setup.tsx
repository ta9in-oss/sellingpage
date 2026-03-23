import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { checkSetupNeeded, setupFirstUser } from '@/server/setupFirstUser'

export const Route = createFileRoute('/setup')({
  component: SetupPage,
})

type PageState = 'loading' | 'setup' | 'already-setup' | 'done' | 'error'

function SetupPage() {
  const navigate = useNavigate()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [email, setEmail] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    checkSetupNeeded()
      .then((result) => {
        setPageState(result.needsSetup ? 'setup' : 'already-setup')
      })
      .catch(() => {
        setPageState('error')
        setError('تعذّر الاتصال بالخادم. تأكد من أن متغيرات البيئة مضبوطة.')
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')
    setError('')
    try {
      const result = await setupFirstUser({ data: { email } })
      if (result.success) {
        setPageState('done')
      } else {
        setError(result.error ?? 'حدث خطأ غير متوقع')
        setSubmitStatus('idle')
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم')
      setSubmitStatus('idle')
    }
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <p className="text-zinc-500 text-sm animate-pulse">⏳ جارٍ التحقق...</p>
      </div>
    )
  }

  if (pageState === 'already-setup') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000]">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-black mb-2">المتجر جاهز</h1>
          <p className="text-zinc-600 mb-6">
            تم إعداد المتجر بالفعل. يمكنك تسجيل الدخول للوحة التحكم.
          </p>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="w-full bg-black text-white font-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_#facc15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            الذهاب إلى لوحة التحكم
          </button>
        </div>
      </div>
    )
  }

  if (pageState === 'done') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000]">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-2xl font-black mb-2">تم الإعداد بنجاح!</h1>
          <p className="text-zinc-600 mb-2">
            تمت إضافة <strong className="font-black">{email}</strong> كمدير للمتجر.
          </p>
          <p className="text-zinc-500 text-sm mb-6">
            ستصلك رسالة تحقق على بريدك الإلكتروني عند أول تسجيل دخول.
          </p>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="w-full bg-yellow-400 text-black font-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            تسجيل الدخول الآن
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <div className="inline-block bg-yellow-400 border-4 border-black px-4 py-2 mb-4 shadow-[4px_4px_0px_0px_#000]">
            <span className="font-black text-xl">⚡ إعداد المتجر</span>
          </div>
          <p className="text-zinc-500 text-sm">هذه الصفحة لإعداد أول مدير للمتجر لأول مرة فقط</p>
        </div>

        <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] bg-white">
          <h1 className="text-2xl font-black mb-1">إضافة المدير الأول</h1>
          <p className="text-zinc-500 text-sm mb-6">
            أدخل بريدك الإلكتروني لإنشاء حساب المدير. بعد ذلك يمكنك تسجيل الدخول وإضافة مستخدمين آخرين من لوحة التحكم.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                dir="ltr"
                className="w-full border-4 border-black px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {error && (
              <div className="border-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitStatus === 'loading' || !email}
              className="w-full bg-black text-yellow-400 font-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_#facc15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitStatus === 'loading' ? '⏳ جارٍ الإضافة...' : 'إضافة كمدير والمتابعة →'}
            </button>
          </form>

          <p className="text-xs text-zinc-400 mt-4 border-t border-zinc-100 pt-4">
            🔒 هذه الصفحة تُعطَّل تلقائيًا بعد إضافة أول مستخدم
          </p>
        </div>
      </div>
    </div>
  )
}
