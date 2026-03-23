// apps/platform/src/routes/dashboard/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return <main><h1>لوحة التحكم</h1></main>
}
