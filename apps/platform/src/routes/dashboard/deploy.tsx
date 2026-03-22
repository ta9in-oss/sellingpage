// apps/platform/src/routes/dashboard/deploy.tsx
import { createFileRoute } from '@tanstack/react-router'
import { DeployWizard } from '@/components/deploy/DeployWizard'

export const Route = createFileRoute('/dashboard/deploy')({
  validateSearch: (search) => ({
    storeId: (search.storeId as string) || '',
    tier: ((search.tier as string) || 'starter') as 'starter' | 'pro' | 'enterprise',
  }),
  component: DeployPage,
})

function DeployPage() {
  const { storeId, tier } = Route.useSearch()
  if (!storeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">معرف المتجر مطلوب</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background p-6">
      <DeployWizard storeId={storeId} tier={tier} />
    </div>
  )
}
