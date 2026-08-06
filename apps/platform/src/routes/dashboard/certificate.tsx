// /dashboard/certificate — the founding-believer certificate, on its own page.
//
// This is where a buyer lands right after a successful payment: collect the
// certificate, then continue to the dashboard and work. It used to sit pinned
// at the top of the dashboard forever, which pushed the actual work (stores)
// below the fold on every single visit. The header keeps a permanent link back
// here, so nothing is lost by moving it out.
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { Loader2, ArrowLeft, ArrowRight, PartyPopper } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { FounderCertificate } from '@/components/dashboard/FounderCertificate'

export const Route = createFileRoute('/dashboard/certificate')({
  component: CertificatePage,
})

const T = {
  title: { ar: 'شهادتك جاهزة', fr: 'Votre certificat est prêt', en: 'Your certificate is ready' },
  subtitle: {
    ar: 'حمّلها واحتفظ بها. رمزك محفوظ في حسابك ويمكنك العودة لهذه الصفحة في أي وقت.',
    fr: 'Téléchargez-la et gardez-la. Votre code est enregistré sur votre compte, revenez ici quand vous voulez.',
    en: 'Download it and keep it. Your code is saved on your account — come back to this page any time.',
  },
  toDashboard: {
    ar: 'المتابعة إلى لوحة التحكم',
    fr: 'Continuer vers le tableau de bord',
    en: 'Continue to the dashboard',
  },
  back: { ar: 'العودة للوحة التحكم', fr: 'Retour au tableau de bord', en: 'Back to dashboard' },
}

type PlatformUser = {
  tier?: string
  founderCode?: string
  founderBatch?: string
  purchasedAt?: number
}

function CertificatePage() {
  const navigate = useNavigate()
  const { t, dir } = useLang()
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft
  const { isLoading: authLoading, user } = db.useAuth()

  const { data, isLoading: dataLoading } = db.useQuery(
    user?.email ? { platformUsers: { $: { where: { email: user.email } } } } : null,
  )
  const platformUser = (data?.platformUsers ?? [])[0] as PlatformUser | undefined

  // No subscription, or no code minted yet → the dashboard is the right place
  // (it holds sign-in and the pricing gate).
  useEffect(() => {
    if (authLoading || dataLoading) return
    if (!user || !platformUser?.tier || !platformUser?.founderCode) {
      navigate({ to: '/dashboard', replace: true })
    }
  }, [authLoading, dataLoading, user, platformUser?.tier, platformUser?.founderCode, navigate])

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (!user?.email || !platformUser?.tier || !platformUser.founderCode) return null

  return (
    <div className="min-h-screen bg-background py-8 px-4" dir={dir}>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <BackIcon size={16} />
          {t(T.back)}
        </button>

        <div className="flex items-center gap-2 mb-1">
          <PartyPopper className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">{t(T.title)}</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{t(T.subtitle)}</p>

        <FounderCertificate
          founderCode={platformUser.founderCode}
          tier={platformUser.tier}
          email={user.email}
          batch={platformUser.founderBatch}
          purchasedAt={platformUser.purchasedAt}
        />

        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="mt-6 w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          {t(T.toDashboard)}
        </button>
      </div>
    </div>
  )
}
