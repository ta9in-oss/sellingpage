import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { privateHead } from '@/lib/seo'
import { useLang } from '@/hooks/useLang'
import { AuthForm } from '@/components/auth/AuthForm'
import { OnlineIndicator } from '@/components/marketing/OnlineIndicator'
import { trackGtag, trackClarity } from '@/lib/track'
import { trackPixel } from '@/lib/pixel'
import { Store } from 'lucide-react'

const T = {
  title: { ar: 'تسجيل الدخول', fr: 'Connexion', en: 'Sign in' },
  subtitle: { ar: 'أدخل للوحة التحكم', fr: 'Accédez au tableau de bord', en: 'Access your dashboard' },
}

export const Route = createFileRoute('/auth/signin')({
  head: () => privateHead('تسجيل الدخول | 7aba.app'),
  validateSearch: (search): { redirect?: string } => ({
    redirect: search.redirect as string | undefined,
  }),
  component: SigninPage,
})

function SigninPage() {
  const { t, dir } = useLang()
  const { redirect } = Route.useSearch()
  const navigate = useNavigate()

  useEffect(() => {
    trackGtag('view_signin')
    trackClarity('view_signin')
    trackPixel('ViewContent', { content_name: 'signin' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background p-4" dir={dir}>
      <div className="fixed top-4 inset-x-0 z-30 flex justify-center px-4">
        <OnlineIndicator />
      </div>
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto">
          <Store className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">{t(T.title)}</h1>
        <p className="text-muted-foreground text-sm">{t(T.subtitle)}</p>
      </div>
      <AuthForm mode="signin" onSuccess={() => navigate({ to: redirect ?? '/dashboard' })} />
    </div>
  )
}
