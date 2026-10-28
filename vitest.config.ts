import { defineConfig } from 'vitest/config'

// One test run for the whole monorepo. Each project keeps its own include
// globs; the platform project has its own config so its path aliases resolve
// against apps/platform/tsconfig.json.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'scripts',
          environment: 'node',
          include: ['scripts/**/*.test.mjs', 'apps/deploy-daemon/src/**/*.test.mjs'],
        },
      },
      'apps/platform/vitest.config.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov', 'json-summary'],
      include: [
        'scripts/**/*.mjs',
        'apps/deploy-daemon/src/**/*.mjs',
        'apps/platform/src/lib/**/*.ts',
        'apps/platform/src/server/**/*.ts',
      ],
      exclude: ['**/*.test.*', '**/*.d.ts'],
    },
  },
})
