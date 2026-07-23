import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

// Dedicated vitest config — intentionally omits the TanStack Start plugin
// (it rewrites server entrypoints and breaks unit test collection). We only
// need path-alias resolution (@/ and @7aba/store-ui) for pure-logic tests.
export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
