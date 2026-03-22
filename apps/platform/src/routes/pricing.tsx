// apps/platform/src/routes/pricing.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

function PricingPage() {
  return <main><h1>الأسعار</h1></main>
}
