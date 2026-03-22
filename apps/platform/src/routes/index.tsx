// apps/platform/src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main>
      <h1>7aba.store</h1>
    </main>
  )
}
