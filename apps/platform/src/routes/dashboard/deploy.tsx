// apps/platform/src/routes/dashboard/deploy.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deploy')({
  component: DeployPage,
})

function DeployPage() {
  return <main><h1>النشر</h1></main>
}
