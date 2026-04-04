// apps/platform/src/routes/dashboard/deploy.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { DeployWizard } from '@/components/deploy/DeployWizard'
import { db } from '@/lib/instantdb'
import { Loader2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

export const Route = createFileRoute('/dashboard/deploy')({
  validateSearch: (search) => ({
    storeId: (search.storeId as string) || '',
    tier: ((search.tier as string) || 'starter') as 'starter' | 'pro' | 'agency',
  }),
  component: DeployPage,
})

const T = {
  storeIdRequired: { ar: 'معرف المتجر مطلوب', fr: 'ID boutique requis', en: 'Store ID required' },
}

function DeployPage() {
  const { storeId, tier } = Route.useSearch()
  const navigate = useNavigate()
  const { t } = useLang()
  const { isLoading: authLoading, user } = db.useAuth()

  const { data, isLoading: dataLoading } = db.useQuery(
    user?.email ? { platformUsers: { $: { where: { email: user.email } } } } : null
  )
  const platformUser = (data?.platformUsers ?? [])[0] as
    | { tier?: string; cfAccountId?: string } | undefined

  useEffect(() => {
    if (authLoading || (user && dataLoading)) return
    if (!user || !platformUser?.tier) {
      navigate({ to: '/dashboard', replace: true })
      return
    }
    // Gate: require CF credentials before deployment
    if (!platformUser?.cfAccountId) {
      navigate({ to: '/dashboard/settings', search: { from: 'deploy' } as any, replace: true })
    }
  }, [authLoading, dataLoading, user, platformUser, navigate])

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !platformUser?.tier) return null

  if (!storeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t(T.storeIdRequired)}</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background p-6">
      <DeployWizard storeId={storeId} tier={tier} userEmail={user.email ?? ''} />
    </div>
  )
}
