import { defineConfig, devices } from '@playwright/test'

// E2E for the storefront output of the deploy pipeline. global-setup writes
// generator output (from e2e/fixture.ts) into src/config; the dev server serves
// it; tests assert the merchant's content is user-visible. teardown restores.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? 'line' : 'list',
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx vite dev --port 3000',
    url: 'http://localhost:3000',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      // Placeholder so InstantDB init doesn't throw; product queries stay empty,
      // but content.json-driven rendering (hero/features/form) is deterministic.
      VITE_INSTANT_APP_ID: '00000000-0000-0000-0000-000000000000',
    },
  },
})
