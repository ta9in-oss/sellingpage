import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { BuilderLayout } from '@/components/builder/BuilderLayout'
import { db } from '@/lib/instantdb'
import { id } from '@instantdb/react'
import { useLang } from '@/hooks/useLang'
import type { User } from '@instantdb/react'

export const Route = createFileRoute('/dashboard/builder')({
  validateSearch: (search) => ({
    storeId: (search.storeId as string) || 'new',
    plan: (search.plan as string) || '',
  }),
  component: BuilderPage,
})

function BuilderPage() {
  const { storeId, plan } = Route.useSearch()
  const navigate = useNavigate()
  const { user } = db.useAuth()

  if (storeId === 'new') {
    return <CreateAndRedirect navigate={navigate} plan={plan} user={user ?? null} />
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
  user: User | null
}) {
  const { dir } = useLang()
  useEffect(() => {
    const newId = id()
    db.transact(
      db.tx.stores[newId].update({
        userId: user?.id ?? '',
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
        <p className="text-zinc-500 text-sm">جارٍ إنشاء المتجر...</p>
      </div>
    </div>
  )
}
