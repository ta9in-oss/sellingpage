# Changelog — 7aba.store

All notable changes to this project are documented here.  
Format: `[version/commit] YYYY-MM-DD — description`

> **Active HEAD:** `38bc0af` · **Live:** https://7aba.store · **Repo:** https://github.com/Ta9in/sellingpage

---

## [Unreleased] — Pending

- [ ] Set Chargily webhook URL in Chargily dashboard: `https://7aba.store/api/webhook/chargily`
- [ ] Set download URLs env vars when assets are ready: `DOWNLOAD_STORE_SOURCE_URL`, `DOWNLOAD_STORE_APP_URL`, `DOWNLOAD_PLATFORM_SOURCE_URL`

---

## [38bc0af] 2026-03-31 — Builder crash fix

**fix(builder): SortableSectionCard crash — handleNewStore used invalid config**
- Root cause: `handleNewStore` stored `sections: ['hero', 'order']` (strings, wrong type) instead of proper `StoreConfig` Section objects
- Fix: store `useBuilderStore.getState().config` as the initial store config
- Add fallback icon (`LayoutGrid`) in `SortableSectionCard` for unknown section types  
- Tighten `BuilderLayout` hydration check: only hydrate if sections array contains objects (not strings) and theme is an object

---

## [pending] 2026-03-30 — Chargily 422 fix, tier mismatch, schema, COOP headers

**fix: Chargily createCustomer → customer_id pattern; agency tier; InstantDB schema**

- `apps/store/src/server/createChargilyCheckout.ts`: Removed invalid inline `customer` field — call `createCustomer()` first, use `customer_id` in checkout (Chargily API v2 does not accept inline customer objects)
- `apps/platform/src/server/createSubscriptionCheckout.ts`: Same fix — `createCustomer()` + `customer_id` for platform subscription checkouts
- `apps/platform/src/components/deploy/DeployWizard.tsx`: Fixed `enterprise` → `agency` tier mismatch; pass `userEmail` down to `ProDeliveryStep`
- `apps/platform/src/components/deploy/steps/ProDeliveryStep.tsx`: Replaced all stubs with real `getDownloadUrl` server function calls (store-source, store-app, platform-source); tier-gated per plan
- `apps/platform/src/instant.schema.ts`: Added missing schema fields — `stores.cfApiToken`, `stores.cfWorkerUrl`, `stores.chargilyApiKey`, `stores.name`, `stores.ownerId`, `stores.createdAt`, `stores.updatedAt`; `platformUsers.name`, `platformUsers.checkoutId`, `platformUsers.createdAt` — pushed to InstantDB
- `apps/platform/src/routes/dashboard/deploy.tsx`: Updated tier type to `'starter' | 'pro' | 'agency'`; passes `user.email` to DeployWizard
- `apps/platform/src/routes/dashboard/index.tsx`: Fixed `agency` cast (was `enterprise`)
- `apps/platform/src/components/auth/AuthModal.tsx`: Added `nonce` to Google OAuth `signInWithIdToken` for replay protection
- `apps/platform/vite.config.ts`: `routeRules` for COOP headers (redundant but kept)
- **Infrastructure**: `7aba-proxy` CF Worker updated to inject `Cross-Origin-Opener-Policy: unsafe-none` + `Cross-Origin-Embedder-Policy: unsafe-none` on all responses — Google OAuth popup unblocked
- **Infrastructure**: InstantDB `google-web` OAuth client registered (`clientName: 'google-web'`) for app `b9227417-33f4-4c3d-9c88-612e094aff89`; authorized origins `7aba.store` + `localhost:3001`

---

## [post-f40ddec] 2026-03-26 — Upgrade CF Worker secrets

- `7aba-webhook` Worker: re-deployed via wrangler to remove plain_text bindings
- All 3 env vars now stored as encrypted `secret_text` bindings:
  - `CHARGILY_PLATFORM_SECRET_KEY` (Chargily test key)
  - `INSTANTDB_ADMIN_TOKEN` (InstantDB platform admin token)
  - `VITE_INSTANT_APP_ID` (platform DB app ID: `b9227417-...`)
- Worker route `7aba.store/api/webhook/chargily` → `7aba-webhook` confirmed intact

---

## [4bfd766] 2026-03-26 — Domain routing + real CF deploy wizard

**feat: 7aba.store domain wired, CF Pages deploy wizard uses real API**

- `7aba.store` + `www.7aba.store` → `7aba-platform` CF Pages project (custom domains, pending DNS)
- `demo.7aba.store/*` → CF Worker `7aba-demo-redirect` → 301 to `7aba.store/demo`
- `7aba.store/api/webhook/chargily` → CF Worker `7aba-webhook` (Chargily payment events)
- `ConnectServicesStep.tsx`: Added CF API Token field (stored in `stores.cfApiToken`)
- New `src/server/deployStore.ts`:
  - Verifies merchant CF credentials
  - Creates CF Pages project in merchant's account linked to `github.com/Ta9in/sellingpage`
  - Sets env vars: `VITE_INSTANT_APP_ID`, `INSTANT_ADMIN_TOKEN`, `VITE_APP_URL`, `CHARGILY_SECRET_KEY`
- `DeployingStep.tsx`: Rewritten to call real `deployStore` server function

---

## [f478c44] 2026-03-24 — OAuth, webhook worker, cleanup

**feat: wire Google OAuth, Chargily webhook CF Worker, delete legacy files**

- `apps/platform/src/routes/__root.tsx`: Add `GoogleOAuthProvider` wrapper (reads `VITE_GOOGLE_CLIENT_ID`)
- `packages/store-ui/src/components/sections/OrderSection.tsx`: Dynamic submit button text based on `activePaymentMethod` — COD→`'أكّد الطلب'`, Chargily→`'ادفع إلكترونياً →'`
- Deployed CF Worker `7aba-webhook` at `https://7aba-webhook.mohessaid.workers.dev`
  - Handles Chargily `checkout.paid` events via HMAC-SHA256 verification
  - Updates `platformUsers.plan` in InstantDB admin API on successful payment
- Deleted `apps/store/app/` (legacy 37K-line duplicate directory)
- `apps/store/.env.example`: added all required vars documentation
- `AGENTS.md`: updated with webhook worker URL, API route limitation note

---

## [c09e717] 2026-03-24 — Performance optimization

**perf: WebP images, lazy-load algeria JSON, preload/preconnect, Vite code splitting**

### `packages/store-ui`
- Converted all PNG/JPEG assets → WebP via `sharp` (92% smaller: backpack 770 KB → 60 KB each)
- `HeroSection`: `<picture>` + WebP `<source>`, `fetchPriority="high"`, explicit `width/height` (CLS fix)
- `ProductCarousel`: `<picture>` + WebP, `loading="lazy" decoding="async"`, explicit dimensions
- `useAlgeriaLocations`: static import → dynamic `import()` — 1.4 MB JSON now a separate lazy chunk

### `apps/store`
- Main JS bundle: ~1.5 MB → **319 KB** (algeria JSON deferred)
- `__root.tsx`: `preconnect` for Google Fonts, `<link rel="preload">` for LCP image, WebP OG image
- `vite.config.ts`: `cssCodeSplit: true`, `manualChunks` for vendor-instantdb / vendor-radix / vendor-icons / vendor-oauth

### `apps/platform`
- `__root.tsx`: rebuilt from 15-line stub → full SEO meta, Google Fonts with preconnect, RTL `<html>`, dark mode
- `vite.config.ts`: same chunk splitting + vendor-dndkit / vendor-zustand

---

## [f259959] 2026-03-24 — SEO / GEO / AEO optimization

**feat(seo): full SEO/GEO/AEO optimization across all public pages**

### `apps/platform`
- `__root.tsx`: site-wide Open Graph, Twitter Cards, `geo.region=DZ`, theme-color, preconnects, webmanifest
- `routes/index.tsx`: 5 JSON-LD schemas — Organization, WebSite, SoftwareApplication, HowTo, FAQPage (6 Q&As)
- `routes/pricing.tsx`: BreadcrumbList + FAQPage (4 pricing Q&As)
- `routes/demo.tsx`: BreadcrumbList + ItemPage + fixed CTA price (3,900 DZD)
- `src/public/robots.txt`: AI crawlers explicitly allowed (GPTBot, Claude-Web, PerplexityBot, Googlebot)
- `src/public/sitemap.xml`: 3 URLs with `hreflang` ar/fr
- `src/public/site.webmanifest`: PWA metadata

---

## [a28be9a] 2026-03-24 — Full dashboard implementation

**feat(platform): full dashboard with auth gate, subscription gate, stores, downloads**

### `apps/platform`
- `routes/dashboard/index.tsx`: rebuilt from 9-line stub — full flow: auth gate → subscription gate → stores list
- `StoresDashboard`: store cards with name, status badge, deploy link, settings button, "New Store" CTA
- `StoreCard`: individual card component with Chargily-verified status
- `DownloadsPanel`: tier-gated download cards (Pro: store-source + store-app; Agency: + platform-source)
- `EmptyStores`: empty state with builder CTA
- `DashboardHeader`: user info, logout, upgrade badge
- `server/getDownloadUrl.ts`: fixed env var (`INSTANT_ADMIN_TOKEN` → `INSTANTDB_ADMIN_TOKEN`)

---

## [d5cbce3] 2026-03-24 — Auth, subscription paywall, store settings

**feat(platform): auth, subscription paywall, dashboard, store settings**

### `apps/platform`
- `AuthModal`: magic-code email auth + Google OAuth sign-in
- Subscription tiers: Starter (3,900 DZD) / Pro (14,900 DZD) / Agency (49,000 DZD)
- `SubscriptionGate`: un-subscribed users see inline pricing until purchase
- `StoreSettingsModal`: per-store Cloudflare Account ID + API Token + InstantDB credentials
- `server/createSubscriptionCheckout.ts`: Chargily Pay checkout for subscriptions
- `server/verifySubscriptionPayment.ts`: verify Chargily checkout, update `platformUsers.tier`
- `instant.schema.ts`: added `tier`, `checkoutId`, `purchasedAt` to `platformUsers`; `cfAccountId`, `cfApiToken`, `instantAppId`, `instantAdminToken`, `chargilyApiKey`, `deployedUrl` to `stores`

---

## [3796e20] 2026-03-24 — Single-app consolidation

**feat: consolidate to single app — demo store at /demo, drop separate store deploy**

### Architecture change
- `apps/platform` is now the only deployed app at `7aba.store`
- Demo store moved to `/demo` route within the platform app
- `apps/store` becomes a standalone template used as reference for generated stores
- Removed separate `apps/store` Cloudflare Pages deployment

---

## [aced11a] 2026-03-24 — CI/CD infrastructure

**feat: deploy infra, CF Pages, GH Actions, subscription system**

- `.github/workflows/deploy.yml`: build + deploy `apps/platform` to Cloudflare Pages on push to `main`
- Cloudflare Pages project: `7aba-platform` → `7aba.store` custom domain
- Builder `PaymentPanel`: configure COD / Chargily per store (builder-only, not customer-facing)
- `configGenerator.ts`: generates `site.config.ts` + `content.json` + `wrangler.toml` from `StoreConfig`
- `useBuilderStore` (Zustand): added `payment` config block to builder state

---

## [01c468f] 2026-03-23 — Deploy wizard

**feat(platform): deploy wizard with admin provisioning**

- `routes/dashboard/deploy.tsx`: multi-step wizard (Review → Connect → Admin → Deploying → Live)
- Steps: `ReviewStep`, `ConnectServicesStep`, `SetupAdminStep`, `DeployingStep`, `LiveStep`
- `server/addStoreAdmin.ts`: creates InstantDB permissions for deployed store
- `ProDeliveryStep`: Pro-tier extended deployment options

---

## [8600f9d] 2026-03-23 — Builder: DnD, color pickers, fonts

**feat: builder — real color pickers, Google Fonts (20 fonts), DragOverlay DnD**

- `SectionList`: drag-and-drop section reordering via `@dnd-kit`
- `ThemePanel`: real color pickers (HSL), Google Fonts selector (20 Arabic-compatible fonts)
- `BuilderLayout`: tabbed right panel (Theme, Product, Notifications, Payment)

---

## [457f717] 2026-03-23 — Chargily Pay integration (store)

**feat: integrate Chargily Pay payment for store**

- `apps/store`: Chargily Pay checkout for product purchases
- `server/createChargilyCheckout.ts`: creates checkout session via Chargily API
- `server/verifyChargilyPayment.ts`: verifies payment on return
- `routes/success.tsx`: rebuilt with order details + Chargily verification
- `site.config.ts`: added `payment.activeMethod` (cod | chargily), `payment.chargilyApiKey`, `payment.googleClientId`

---

## [2026-01-29] — Architecture refactor

- Monorepo restructure: moved shared components to `packages/store-ui`
- `@7aba/store-ui`: ThemeProvider, theme types, all section components
- `brutalistTheme` / `acquisitionTheme` / `warmTheme` in `packages/store-ui/src/themes/`
- Path alias `@7aba/store-ui` → `packages/store-ui/src/index.ts` (no build step)

---

## [2026-01-25 to 2026-01-29] — Notification system

- Real-time order notifications via InstantDB rooms (`orderNotifications` topic)
- `useOrderNotifications`: queue-based display (5 s show + 2.5 s gap)
- Default quantity set to 1 in order form

---

## [2025-09-27] — Admin dashboard (store)

- Seller admin dashboard at `apps/store/src/routes/dashboard.tsx`
- Order management, status updates, product management
- InstantDB auth (`$users` entity)

---

## [2025-09-22] — Analytics

- Meta Pixel integration
- Google Analytics, Microsoft Clarity, PostHog added to `apps/store`
- Favicon + logo assets

---

## [2025-09-14] — UI refinements + success page

- Success page with order confirmation
- Responsive design improvements
- InstantDB schema updates (orders + products)

---

## [2025-09-10] — Real-time notifications

- Real-time notification system (InstantDB rooms)
- Order form with Algeria location picker

---

## [2025-09-04] — Initial selling page

- TanStack Start + InstantDB selling page
- Order form with wilaya/daira/commune picker
- `algeria-locations.json` dataset

---

## [2025-08-25] — Project init

- TanStack Start project bootstrapped (migrated from scratch Vite setup)
- pnpm workspaces monorepo
