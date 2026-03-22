// apps/platform/src/routes/dashboard/builder.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/builder')({
  component: BuilderPage,
})

function BuilderPage() {
  return <main><h1>المحرر</h1></main>
}
