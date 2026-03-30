import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { BuilderLayout } from '@/components/builder/BuilderLayout'
import { db } from '@/lib/instantdb'
import { id } from '@instantdb/react'
import { useLang } from '@/hooks/useLang'
import { Loader2 } from 'lucide-react'
import type { User } from '@instantdb/react'

export const Route = createFileRoute('/dashboard/builder')({
  validateSearch: (search) => ({
    storeId: (search.storeId as string) || 'new',
    plan: (search.plan as string) || '',
  }),
  component: BuilderPage,
})

const T = {
  creatingStore: { ar: 'جارٍ إنشاء المتجر...', fr: 'Création de la boutique...', en: 'Creating store...' },
}

function BuilderPage() {
  const { storeId, plan } = Route.useSearch()
  const navigate = useNavigate()
  const { isLoading: authLoading, user } = db.useAuth()

  // Query user tier only when we have an email
  const { data, isLoading: dataLoading } = db.useQuery(
    user?.email ? { platformUsers: { $: { where: { email: user.email } } } } : null
  )
  const platformUser = (data?.platformUsers ?? [])[0] as { tier?: string } | undefined

  // Redirect unauthenticated or unpaid users to /dashboard
  useEffect(() => {
    if (authLoading || (user && dataLoading)) return
    if (!user) {
      navigate({ to: '/dashboard', replace: true })
      return
    }
    if (!platformUser?.tier) {
      navigate({ to: '/dashboard', replace: true })
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

  if (storeId === 'new') {
    return <CreateAndRedirect navigate={navigate} plan={plan} user={user} />
  }

  return <BuilderLayout storeId={storeId} />
}

function CreateAndRedirect({
  navigate,
  plan,
  user,
}: {
  navigate: ReturnType<typeof useNavigate>
  plan: string
  user: User
}) {
  const { dir, t } = useLang()
  useEffect(() => {
    const newId = id()
    db.transact(
      db.tx.stores[newId].update({
        userId: user.id,
        slug: newId.slice(0, 8),
        config: { plan: plan || 'simple' },
        status: 'draft',
      })
    ).then(() => {
      navigate({ to: '/dashboard/builder', search: { storeId: newId, plan: '' }, replace: true })
    }).catch((err: unknown) => {
      console.error('Failed to create store:', err)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" dir={dir}>
      <div className="text-center space-y-2">
        <div className="text-2xl animate-spin">⏳</div>
        <p className="text-zinc-500 text-sm">{t(T.creatingStore)}</p>
      </div>
    </div>
  )
}
