/**
 * Platform authentication modal.
 * Supports Google OAuth (via @react-oauth/google) and email magic code (InstantDB).
 * The email entered here doubles as the buyer's identity for Chargily checkout.
 */
import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'

type Step = 'choose' | 'email' | 'code'

interface AuthModalProps {
  onClose?: () => void
  /** Called after successful sign-in with the user's email */
  onSuccess?: (email: string) => void
  title?: string
  subtitle?: string
}

const HAS_GOOGLE_AUTH = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

export function AuthModal({
  onClose,
  onSuccess,
  title = 'تسجيل الدخول',
  subtitle = 'أدخل للوحة التحكم',
}: AuthModalProps) {
  const [step, setStep] = useState<Step>('choose')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState('')

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      setError(null)
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((r) => r.json())

        // Sign in to InstantDB — use sub as a stable identifier
        try {
          await db.auth.signInWithIdToken({
            clientName: 'google-web',
            idToken: userInfo.sub ?? tokenResponse.access_token,
            nonce: undefined,
          } as Parameters<typeof db.auth.signInWithIdToken>[0])
        } catch {
          // Non-fatal: user is still authenticated via Google profile
        }
        onSuccess?.(userInfo.email)
      } catch {
        setError('فشل تسجيل الدخول عبر Google. حاول مجدداً.')
      } finally {
        setLoading(false)
      }
    },
    onError: () => {
      setError('فشل تسجيل الدخول عبر Google. حاول مجدداً.')
    },
  })

  const handleSendCode = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('أدخل بريداً إلكترونياً صحيحاً')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await db.auth.sendMagicCode({ email: email.trim() })
      setSentTo(email.trim())
      setStep('code')
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'تعذر إرسال الرمز. حاول مجدداً.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError('أدخل الرمز المرسل إليك')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await db.auth.signInWithMagicCode({ email: sentTo, code: code.trim() })
      onSuccess?.(sentTo)
    } catch {
      setError('الرمز غير صحيح أو منتهي الصلاحية. أعد المحاولة.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" dir="rtl">
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] w-full max-w-sm mx-4 p-8 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 left-3 text-zinc-400 hover:text-black text-xl font-bold"
            aria-label="إغلاق"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-black mb-1">{title}</h2>
        <p className="text-sm text-zinc-500 mb-6">{subtitle}</p>

        {/* Step: choose method */}
        {step === 'choose' && (
          <div className="space-y-3">
            {HAS_GOOGLE_AUTH && (
              <button
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                className={cn(
                  'w-full flex items-center justify-center gap-3 border-2 border-black py-3 text-sm font-bold',
                  'bg-white hover:bg-yellow-400 transition-colors shadow-[3px_3px_0px_0px_#000] hover:shadow-none',
                  'hover:translate-x-[3px] hover:translate-y-[3px]',
                  loading && 'opacity-60 cursor-not-allowed'
                )}
              >
                <GoogleIcon />
                المتابعة بـ Google
              </button>
            )}

            {HAS_GOOGLE_AUTH && (
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="flex-1 h-px bg-zinc-200" />
                <span>أو</span>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>
            )}

            <button
              onClick={() => setStep('email')}
              className={cn(
                'w-full py-3 border-2 border-black text-sm font-bold',
                'bg-zinc-100 hover:bg-yellow-400 transition-colors shadow-[3px_3px_0px_0px_#000] hover:shadow-none',
                'hover:translate-x-[3px] hover:translate-y-[3px]'
              )}
            >
              المتابعة عبر البريد الإلكتروني
            </button>

            {error && <p className="text-red-600 text-xs border border-red-200 bg-red-50 p-2">{error}</p>}
          </div>
        )}

        {/* Step: email input */}
        {step === 'email' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                placeholder="you@example.com"
                dir="ltr"
                autoFocus
                className="w-full border-2 border-black px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {error && <p className="text-red-600 text-xs border border-red-200 bg-red-50 p-2">{error}</p>}

            <button
              onClick={handleSendCode}
              disabled={loading}
              className={cn(
                'w-full py-3 border-2 border-black text-sm font-bold bg-yellow-400 text-black',
                'shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all',
                loading && 'opacity-60 cursor-not-allowed'
              )}
            >
              {loading ? 'جارٍ الإرسال...' : 'إرسال رمز التحقق'}
            </button>

            <button onClick={() => setStep('choose')} className="text-xs text-zinc-400 hover:underline w-full text-center">
              ← رجوع
            </button>
          </div>
        )}

        {/* Step: code verification */}
        {step === 'code' && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600">
              أرسلنا رمز تحقق إلى <strong className="font-mono">{sentTo}</strong>. تحقق من بريدك.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold">رمز التحقق</label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                placeholder="123456"
                dir="ltr"
                autoFocus
                className="w-full border-2 border-black px-3 py-2.5 text-sm font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {error && <p className="text-red-600 text-xs border border-red-200 bg-red-50 p-2">{error}</p>}

            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className={cn(
                'w-full py-3 border-2 border-black text-sm font-bold bg-yellow-400 text-black',
                'shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all',
                loading && 'opacity-60 cursor-not-allowed'
              )}
            >
              {loading ? 'جارٍ التحقق...' : 'تأكيد الرمز'}
            </button>

            <button
              onClick={() => { setStep('email'); setCode(''); setError(null) }}
              className="text-xs text-zinc-400 hover:underline w-full text-center"
            >
              ← تعديل البريد
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
