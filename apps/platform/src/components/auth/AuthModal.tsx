/**
 * Platform authentication modal.
 * Supports Google OAuth (via @react-oauth/google) and email magic code (InstantDB).
 * Google OAuth uses GoogleLogin component which returns a real ID token (credential JWT)
 * required by InstantDB's signInWithIdToken.
 * The email entered here doubles as the buyer's identity for Chargily checkout.
 */
import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'

type Step = 'choose' | 'email' | 'code'

interface AuthModalProps {
  onClose?: () => void
  /** Called after successful sign-in with the user's email */
  onSuccess?: (email: string) => void
  title?: string
  subtitle?: string
}

const T = {
  close: { ar: 'إغلاق', fr: 'Fermer', en: 'Close' },
  defaultTitle: { ar: 'تسجيل الدخول', fr: 'Connexion', en: 'Sign in' },
  defaultSubtitle: { ar: 'أدخل للوحة التحكم', fr: 'Accédez au tableau de bord', en: 'Access your dashboard' },
  googleFailed: { ar: 'فشل تسجيل الدخول عبر Google. لم يتم استلام الرمز.', fr: 'Connexion Google échouée. Aucun jeton reçu.', en: 'Google sign-in failed. No token received.' },
  googleFailedRetry: { ar: 'فشل تسجيل الدخول عبر Google. حاول مجدداً.', fr: 'Connexion Google échouée. Réessayez.', en: 'Google sign-in failed. Please try again.' },
  invalidEmail: { ar: 'أدخل بريداً إلكترونياً صحيحاً', fr: 'Entrez une adresse e-mail valide', en: 'Enter a valid email address' },
  sendFailed: { ar: 'تعذر إرسال الرمز. حاول مجدداً.', fr: "Impossible d'envoyer le code. Réessayez.", en: 'Failed to send code. Please try again.' },
  enterCode: { ar: 'أدخل الرمز المرسل إليك', fr: 'Entrez le code que vous avez reçu', en: 'Enter the code sent to you' },
  invalidCode: { ar: 'الرمز غير صحيح أو منتهي الصلاحية. أعد المحاولة.', fr: 'Code incorrect ou expiré. Réessayez.', en: 'Incorrect or expired code. Please try again.' },
  or: { ar: 'أو', fr: 'ou', en: 'or' },
  continueEmail: { ar: 'المتابعة عبر البريد الإلكتروني', fr: 'Continuer par e-mail', en: 'Continue with Email' },
  emailLabel: { ar: 'البريد الإلكتروني', fr: 'E-mail', en: 'Email' },
  emailPlaceholder: { ar: 'you@example.com', fr: 'vous@exemple.com', en: 'you@example.com' },
  sending: { ar: 'جارٍ الإرسال...', fr: 'Envoi en cours...', en: 'Sending...' },
  sendCode: { ar: 'إرسال رمز التحقق', fr: 'Envoyer le code', en: 'Send verification code' },
  back: { ar: '← رجوع', fr: '← Retour', en: '← Back' },
  codeSentPrefix: { ar: 'أرسلنا رمز تحقق إلى', fr: 'Nous avons envoyé un code de vérification à', en: 'We sent a verification code to' },
  codeSentSuffix: { ar: '. تحقق من بريدك.', fr: '. Vérifiez votre boîte de réception.', en: '. Check your inbox.' },
  codeLabel: { ar: 'رمز التحقق', fr: 'Code de vérification', en: 'Verification code' },
  verifying: { ar: 'جارٍ التحقق...', fr: 'Vérification...', en: 'Verifying...' },
  confirmCode: { ar: 'تأكيد الرمز', fr: 'Confirmer le code', en: 'Confirm code' },
  editEmail: { ar: '← تعديل البريد', fr: "← Modifier l'e-mail", en: '← Edit email' },
}

const HAS_GOOGLE_AUTH = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

export function AuthModal({
  onClose,
  onSuccess,
  title,
  subtitle,
}: AuthModalProps) {
  const { t } = useLang()
  const [step, setStep] = useState<Step>('choose')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const [nonce] = useState(() => crypto.randomUUID())

  const displayTitle = title ?? t(T.defaultTitle)
  const displaySubtitle = subtitle ?? t(T.defaultSubtitle)

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential
    if (!idToken) {
      setError(t(T.googleFailed))
      return
    }
    setLoading(true)
    setError(null)
    try {
      // idToken is the real Google ID token JWT — required by InstantDB signInWithIdToken
      // The clientName 'google-web' must match the OAuth client registered in InstantDB dashboard
      await db.auth.signInWithIdToken({
        clientName: 'google-web',
        idToken,
        nonce,
      } as Parameters<typeof db.auth.signInWithIdToken>[0])

      // Decode email from JWT payload (base64 middle segment)
      const payload = JSON.parse(atob(idToken.split('.')[1]))
      onSuccess?.(payload.email ?? '')
    } catch {
      setError(t(T.googleFailedRetry))
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError(t(T.invalidEmail))
      return
    }
    setLoading(true)
    setError(null)
    try {
      await db.auth.sendMagicCode({ email: email.trim() })
      setSentTo(email.trim())
      setStep('code')
    } catch (e: unknown) {
      setError((e as Error)?.message ?? t(T.sendFailed))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError(t(T.enterCode))
      return
    }
    setLoading(true)
    setError(null)
    try {
      await db.auth.signInWithMagicCode({ email: sentTo, code: code.trim() })
      onSuccess?.(sentTo)
    } catch {
      setError(t(T.invalidCode))
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
            aria-label={t(T.close)}
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-black mb-1">{displayTitle}</h2>
        <p className="text-sm text-zinc-500 mb-6">{displaySubtitle}</p>

        {/* Step: choose method */}
        {step === 'choose' && (
          <div className="space-y-3">
            {HAS_GOOGLE_AUTH && (
              <div className="w-full overflow-hidden border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError(t(T.googleFailedRetry))}
                  size="large"
                  text="continue_with"
                  locale="ar"
                  useOneTap={false}
                  nonce={nonce}
                />
              </div>
            )}

            {HAS_GOOGLE_AUTH && (
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="flex-1 h-px bg-zinc-200" />
                <span>{t(T.or)}</span>
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
              {t(T.continueEmail)}
            </button>

            {error && <p className="text-red-600 text-xs border border-red-200 bg-red-50 p-2">{error}</p>}
          </div>
        )}

        {/* Step: email input */}
        {step === 'email' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold">{t(T.emailLabel)}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                placeholder={t(T.emailPlaceholder)}
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
              {loading ? t(T.sending) : t(T.sendCode)}
            </button>

            <button onClick={() => setStep('choose')} className="text-xs text-zinc-400 hover:underline w-full text-center">
              {t(T.back)}
            </button>
          </div>
        )}

        {/* Step: code verification */}
        {step === 'code' && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600">
              {t(T.codeSentPrefix)} <strong className="font-mono">{sentTo}</strong>{t(T.codeSentSuffix)}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold">{t(T.codeLabel)}</label>
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
              {loading ? t(T.verifying) : t(T.confirmCode)}
            </button>

            <button
              onClick={() => { setStep('email'); setCode(''); setError(null) }}
              className="text-xs text-zinc-400 hover:underline w-full text-center"
            >
              {t(T.editEmail)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
