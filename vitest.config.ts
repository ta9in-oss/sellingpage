import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

// Root-level vitest: covers the repo scripts (workflow helpers). The .mjs
// scripts import the platform's .ts generator, so tsConfigPaths resolves the
// @7aba/store-ui alias used transitively.
export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    environment: 'node',
    include: ['scripts/**/*.test.mjs', 'apps/deploy-daemon/src/**/*.test.mjs'],
  },
})
