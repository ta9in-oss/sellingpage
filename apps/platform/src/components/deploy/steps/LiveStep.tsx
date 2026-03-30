import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { Copy, CheckCircle2, ExternalLink } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

interface Props {
  storeId: string
}

const T = {
  storeIsLive: { ar: 'متجرك الآن يعمل على الإنترنت! 🎉', fr: 'Votre boutique est en ligne ! 🎉', en: 'Your store is live! 🎉' },
  shareAndReceive: { ar: 'شارك رابطك واستقبل طلباتك', fr: 'Partagez votre lien et recevez vos commandes', en: 'Share your link and receive orders' },
  storeUrl: { ar: 'رابط المتجر', fr: 'Lien de la boutique', en: 'Store URL' },
  copyUrl: { ar: 'نسخ الرابط', fr: 'Copier le lien', en: 'Copy link' },
  shareWhatsapp: { ar: 'مشاركة عبر واتساب', fr: 'Partager via WhatsApp', en: 'Share via WhatsApp' },
  whatsappText: { ar: 'اكتشف متجري الجديد:', fr: 'Découvrez ma nouvelle boutique:', en: 'Check out my new store:' },
  adminCredentials: { ar: 'بيانات دخول لوحة التحكم', fr: 'Identifiants du tableau de bord', en: 'Dashboard credentials' },
  adminCredentialsHint: { ar: 'أرسل هذه المعلومات لمدير المتجر حتى يتمكن من الدخول ومتابعة الطلبات', fr: 'Envoyez ces informations à l\'administrateur pour qu\'il puisse se connecter et suivre les commandes', en: 'Send this info to the store admin so they can log in and track orders' },
  adminEmail: { ar: 'البريد الإلكتروني للمدير', fr: 'E-mail de l\'administrateur', en: 'Admin email' },
  dashboardUrl: { ar: 'رابط لوحة التحكم', fr: 'Lien du tableau de bord', en: 'Dashboard URL' },
  howToLogin: { ar: 'كيف يسجل الدخول؟', fr: 'Comment se connecter ?', en: 'How to log in?' },
  loginInstructions: { ar: 'يزور رابط لوحة التحكم، يدخل بريده الإلكتروني، ويستقبل رمز الدخول على بريده.', fr: "Visitez le lien du tableau de bord, entrez votre e-mail et recevez le code d'accès.", en: 'Visit the dashboard link, enter your email, and receive the access code by email.' },
  backToDashboard: { ar: 'العودة للوحة التحكم', fr: 'Retour au tableau de bord', en: 'Back to dashboard' },
}

export function LiveStep({ storeId }: Props) {
  const navigate = useNavigate()
  const { t } = useLang()
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [checkmarkVisible, setCheckmarkVisible] = useState(false)

  const { data: storeData } = db.useQuery({
    stores: { $: { where: { id: storeId } } },
  })
  const store = storeData?.stores?.[0]
  const deployedUrl = store?.deployedUrl ?? ''
  const adminEmail = store?.adminEmail ?? ''

  useEffect(() => {
    const t = setTimeout(() => setCheckmarkVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const copyText = async (text: string, setter: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text)
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  const dashboardUrl = deployedUrl ? `${deployedUrl}/dashboard` : ''
  const whatsappText = `${t(T.whatsappText)} ${deployedUrl}`

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      {/* Animated checkmark */}
      <div
        className={cn(
          'w-20 h-20 rounded-full bg-green-500 flex items-center justify-center transition-all duration-[600ms] ease-out',
          checkmarkVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        )}
      >
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold">{t(T.storeIsLive)}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t(T.shareAndReceive)}</p>
      </div>

      {/* Store URL */}
      {deployedUrl ? (
        <div className="w-full max-w-md space-y-3 text-right" dir="rtl">
          <p className="text-sm font-semibold">{t(T.storeUrl)}</p>
          <div className="flex items-center gap-2" dir="ltr">
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono text-primary hover:underline truncate"
            >
              {deployedUrl}
            </a>
            <button
              onClick={() => copyText(deployedUrl, setCopiedUrl)}
              className="p-2 border rounded-lg hover:bg-muted transition-colors shrink-0"
              title={t(T.copyUrl)}
            >
              {copiedUrl ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border rounded-lg hover:bg-muted transition-colors shrink-0"
            >
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5b] transition-colors"
          >
            {t(T.shareWhatsapp)}
          </a>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      )}

      {/* Admin credentials box */}
      {adminEmail && (
        <div className="w-full max-w-md border-2 border-yellow-400 bg-yellow-50 rounded-xl p-5 text-right space-y-3" dir="rtl">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔑</span>
            <p className="font-bold text-sm">{t(T.adminCredentials)}</p>
          </div>
          <p className="text-xs text-muted-foreground">{t(T.adminCredentialsHint)}</p>

          {/* Admin email */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{t(T.adminEmail)}</p>
            <div className="flex items-center gap-2" dir="ltr">
              <span className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm font-mono truncate">
                {adminEmail}
              </span>
              <button
                onClick={() => copyText(adminEmail, setCopiedEmail)}
                className="p-2 border rounded-lg hover:bg-white transition-colors shrink-0"
              >
                {copiedEmail ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Dashboard URL */}
          {dashboardUrl && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{t(T.dashboardUrl)}</p>
              <div className="flex items-center gap-2" dir="ltr">
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm font-mono text-primary hover:underline truncate"
                >
                  {dashboardUrl}
                </a>
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border rounded-lg hover:bg-white transition-colors shrink-0"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-white border rounded-lg p-3">
            <strong>{t(T.howToLogin)}</strong> {t(T.loginInstructions)}
          </div>
        </div>
      )}

      {/* Back to platform dashboard */}
      <button
        onClick={() => navigate({ to: '/dashboard', search: {} })}
        className="w-full max-w-md py-3 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {t(T.backToDashboard)}
      </button>
    </div>
  )
}
