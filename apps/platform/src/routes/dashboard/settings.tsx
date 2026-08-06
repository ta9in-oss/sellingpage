// /dashboard/settings — account-level CF + InstantDB credentials (shared CredentialsForm)
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { privateHead } from '@/lib/seo'
import { useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { Loader2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { CredentialsForm } from '@/components/settings/CredentialsForm'

export const Route = createFileRoute('/dashboard/settings')({
  head: () => privateHead('الإعدادات | 7aba.app'),
  validateSearch: (search) => ({
    from: (search.from as string) || undefined,
  }),
  component: SettingsPage,
})

const T = {
  settings: { ar: 'إعدادات الحساب', fr: 'Paramètres du compte', en: 'Account Settings' },
  backToDashboard: { ar: 'العودة للوحة التحكم', fr: 'Retour au tableau de bord', en: 'Back to dashboard' },
  requiredNote: { ar: 'اربط Cloudflare و InstantDB مرة واحدة لنشر كل متاجرك.', fr: 'Connectez Cloudflare et InstantDB une fois pour déployer toutes vos boutiques.', en: 'Connect Cloudflare & InstantDB once to publish all your stores.' },
  deployRedirect: { ar: 'لتتمكن من نشر متجرك، يرجى إدخال بيانات Cloudflare أولاً', fr: 'Pour déployer votre boutique, configurez Cloudflare d\'abord', en: 'To deploy your store, please configure Cloudflare first' },
}

function SettingsPage() {
  const navigate = useNavigate()
  const { t, dir } = useLang()
  const { from } = Route.useSearch()
  const isRtl = dir === 'rtl'
  const BackIcon = isRtl ? ArrowRight : ArrowLeft
  const { isLoading: authLoading, user } = db.useAuth()

  const { data, isLoading: dataLoading } = db.useQuery(
    user?.email ? { platformUsers: { $: { where: { email: user.email } } } } : null
  )
  const platformUser = (data?.platformUsers ?? [])[0] as any

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: '/dashboard', replace: true })
  }, [authLoading, user, navigate])

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-background py-8 px-4" dir={dir}>
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <BackIcon size={16} />
          {t(T.backToDashboard)}
        </button>

        <h1 className="text-2xl font-bold mb-1">{t(T.settings)}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t(T.requiredNote)}</p>

        {from === 'deploy' && (
          <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{t(T.deployRedirect)}</span>
          </div>
        )}

        {platformUser?.id && (
          <CredentialsForm
            target={{ platformUserId: platformUser.id }}
            initialValues={{
              cfAccountId: platformUser.cfAccountId,
              cfApiToken: platformUser.cfApiToken,
              instantAppId: platformUser.instantAppId,
              instantAdminToken: platformUser.instantAdminToken,
            }}
            onSaved={() => {
              if (from === 'deploy') setTimeout(() => navigate({ to: '/dashboard' }), 900)
            }}
          />
        )}
      </div>
    </div>
  )
}
