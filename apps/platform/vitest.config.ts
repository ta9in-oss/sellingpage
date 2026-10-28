import { defineConfig } from 'vitest/config'

// Dedicated vitest config — intentionally omits the TanStack Start plugin
// (it rewrites server entrypoints and breaks unit test collection). We only
// need path-alias resolution (@/ and @7aba/store-ui) for pure-logic tests.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    name: 'platform',
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
