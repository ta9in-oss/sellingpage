// /dashboard/new-store — full-page store creation wizard
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { privateHead } from '@/lib/seo'
import { useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { Loader2 } from 'lucide-react'
import { StoreCreationWizard } from '@/components/builder/StoreCreationWizard'

export const Route = createFileRoute('/dashboard/new-store')({
  head: () => privateHead('متجر جديد | 7aba.app'),
  component: NewStorePage,
})

function NewStorePage() {
  const navigate = useNavigate()
  const { isLoading, user } = db.useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/dashboard', replace: true })
    }
  }, [isLoading, user, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <StoreCreationWizard
      userEmail={user.email ?? ''}
      onCancel={() => navigate({ to: '/dashboard' })}
    />
  )
}
