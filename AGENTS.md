# AGENTS.md — Project Memory

> **For AI agents:** Read this file at the start of every session. Update it when you make structural changes, add/remove dependencies, or change conventions. Keep entries concise — one line where possible. Do NOT add prose or explanations that already exist in code. Update the `Last updated` field on every write.

**Last updated:** 2026-03-24  
**Project:** حبة ستور (7aba.store) — Algerian e-commerce platform (store builder + selling page)  
**Repo:** https://github.com/Ta9in/sellingpage  
**Monorepo:** pnpm workspaces + Turborepo — `apps/store`, `apps/platform`, `packages/store-ui`

---

## ⚡ MCP Tools — USE THESE FIRST

> Before doing ANY of the following, use the corresponding MCP tool instead of manual file edits or bash commands.

| Task | MCP Tool | When to Use |
|------|----------|-------------|
| Push code, PRs, issues, branches | **GitHub MCP** (`github-mcp-server-*`) | All git/PR/issue operations |
| Deploy to Cloudflare, manage DNS, env vars, Pages/Workers | **Cloudflare MCP** (`cloudflare-mcp-*`) | Any Cloudflare operations |
| Read/write InstantDB schema, query data, manage permissions | **InstantDB MCP** (`instantdb-mcp-*`) | DB schema changes, seeding, queries |

### GitHub MCP
- Use `github-mcp-server-push_files` for multi-file commits (prefer over individual git commands)
- Use `github-mcp-server-create_pull_request` for PRs
- Use `github-mcp-server-list_workflow_runs` to check CI status
- **Repo owner:** `Ta9in` · **Repo name:** `sellingpage`

### Cloudflare MCP
- Use `cloudflare-mcp-execute` to deploy Workers/Pages, set env vars, manage DNS
- **Account ID:** check via `cloudflare-mcp-execute` — do not hardcode
- **Platform Pages project:** `7aba-platform` → served at `7aba.store` via `7aba-proxy` Worker route
- **CF token:** set by user as environment variable — never hardcode in files

### InstantDB MCP
- **Platform DB App ID:** `b9227417-33f4-4c3d-9c88-612e094aff89`
- **Store DB App ID:** from `VITE_INSTANTDB_APP_ID` env var (per merchant store)
- Use `instantdb-mcp-push-schema` after editing `instant.schema.ts`
- Use `instantdb-mcp-push-perms` after editing `instant.perms.ts`
- Use `instantdb-mcp-query` to inspect live data

---

## Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start 1.131.31 (full-stack React) — pinned exact in both apps |
| UI | React 19, TypeScript 5, Tailwind CSS 4 |
| Routing | TanStack Router (file-based, `src/routes/`) |
| Database | InstantDB (`@instantdb/react`, `@instantdb/admin`) — separate apps per workspace |
| Components | Shadcn/ui + Radix UI primitives |
| Build | Vite 6 — store: port 3000, platform: port 3001 |
| Monorepo | pnpm workspaces + Turborepo (`turbo.json` at root) |
| State | Zustand (platform builder) + InstantDB reactive queries |
| DnD | @dnd-kit/core + @dnd-kit/sortable (builder SectionList) |
| Icons | Lucide React |
| Auth | Google OAuth (`@react-oauth/google`) + InstantDB magic-code |
| Payments | Chargily Pay (DZD, Algerian e-payments) |
| Analytics | Google Analytics, Meta Pixel, Microsoft Clarity, PostHog |

---

## Project Structure

```
sellingpage/                  ← monorepo root
├── pnpm-workspace.yaml       ← workspace: apps/*, packages/*
├── turbo.json                ← Turborepo task config
├── package.json              ← root: pnpm overrides for React singleton
├── CHANGELOG.md              ← project-wide changelog
├── MASTER_PLAN.md / AUTOPILOT.md / AGENTS.md
├── apps/
│   ├── store/                ← store selling page template (port 3000)
│   │   ├── CHANGELOG.md      ← store-specific changelog
│   │   └── src/
│   │       ├── routes/       ← __root, index, success, dashboard, test-components
│   │       ├── components/ui/
│   │       ├── hooks/        ← useOrderSubmission, useOrderNotifications, useAlgeriaLocations, useProducts
│   │       ├── lib/          ← instantdb.ts, utils.ts, content.ts, theme.ts, timeUtils.ts
│   │       ├── config/       ← site.config.ts (feature flags + active theme + payment config)
│   │       ├── data/         ← algeria-locations.json
│   │       ├── server/       ← createChargilyCheckout.ts, verifyChargilyPayment.ts
│   │       ├── types/, utils/, styles/
│   │       └── instant.schema.ts, instant.perms.ts
│   └── platform/             ← main deployed app at 7aba.store (port 3001)
│       └── src/
│           ├── routes/       ← __root, index, pricing, demo, dashboard/(index, builder, deploy)
│           ├── components/
│           │   ├── builder/  ← BuilderLayout, SectionList, ThemePanel, StorePreview, forms/
│           │   ├── deploy/   ← DeployWizard, steps/
│           │   └── marketing/← Navbar, HeroSection, ComparisonTable, HowItWorks, etc.
│           ├── hooks/        ← useBuilderStore (Zustand), useLang
│           ├── lib/          ← instantdb.ts, utils.ts, slugValidation.ts, configGenerator.ts
│           ├── server/       ← createSubscriptionCheckout.ts, verifySubscriptionPayment.ts, addStoreAdmin.ts, getDownloadUrl.ts
│           ├── instant.schema.ts ← platformUsers + stores entities
│           └── routeTree.gen.ts  ← auto-generated, never edit manually
└── packages/
    └── store-ui/             ← @7aba/store-ui — shared React component library
        └── src/
            ├── index.ts      ← main re-export (themes, types, ThemeProvider, useTheme, sections)
            ├── themes/       ← brutalist.ts, acquisition.ts, warm.ts + theme.types.ts + index.ts
            ├── types/        ← StoreConfig, Section, FormField, content.types.ts
            ├── context/      ← ThemeContext.tsx (ThemeProvider + useTheme)
            ├── components/sections/ ← 12 section components (all use useTheme)
            ├── components/ui/ ← button, input, label, alert, command, popover, dialog
            ├── hooks/        ← useAlgeriaLocations (dynamic import, returns loading: boolean)
            ├── data/         ← algeria-locations.json
            └── lib/          ← utils.ts (cn)
```

---

## Database Schema (InstantDB)

### apps/store — selling page DB
**App ID:** from `VITE_INSTANTDB_APP_ID` env var (per merchant)  
**Entities:** `products`, `orders`, `users`, `$users` (auth), `$files`  
**`products`:** `product_number` (unique), `name`, `description`, `price`, `image`, `stock`, `is_available`, `created_at`, `updated_at`  
**`orders`:** `order_number` (unique), `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `customer_wilaya`, `customer_city`, `quantity`, `status` (JSON), `total_amount`, `created_at`, `updated_at`  
**Relationship:** `orderProduct` → orders has-one product, product has-many orders  
**Real-time room:** `orderNotifications` → topic: `newOrder`

### apps/platform — builder DB
**App ID:** `b9227417-33f4-4c3d-9c88-612e094aff89` (7aba-platform)  
**Entities:** `platformUsers`, `stores`  
**`platformUsers`:** `email`, `name`, `tier` (free|starter|pro|agency), `checkoutId`, `purchasedAt`, `createdAt`  
**`stores`:** `userId`, `slug` (unique), `name`, `config` (JSON = StoreConfig), `status` (draft|live), `cfAccountId`, `cfApiToken`, `cfWorkerUrl`, `instantAppId`, `instantAdminToken`, `adminEmail`, `chargilyApiKey`, `deployedUrl`, `lastDeployAt`, `deployLog`, `ownerId`, `createdAt`, `updatedAt`  
**Relationship:** `storeOwner` → stores has-one platformUser, platformUser has-many stores

---

## Subscription Tiers

| Tier | Price | Features |
|------|-------|---------|
| `starter` | 3,900 DZD | Create stores, builder access |
| `pro` | 14,900 DZD | + Download store source code + store app APK |
| `agency` | 49,000 DZD | + Download platform codebase |

**Paywall flow:** Un-subscribed user → dashboard → pricing inline → Chargily Pay → redirect back → verify → unlock tier

---

## Theme System (`packages/store-ui/src/themes/`)

- **Interface:** `Theme` in `theme.types.ts` — includes `mode: 'light' | 'dark'`
- **Switch theme (store):** edit `siteConfig.theme` in `apps/store/src/config/site.config.ts` (compile-time)
- **Switch theme (platform builder):** `useBuilderStore().config.theme` — runtime via Zustand
- **Available themes:** `brutalistTheme` (light), `acquisitionTheme` (dark, #0A0A0A bg, #F97316 orange), `warmTheme` (light, amber/brown)
- **Component pattern:** `const theme = useTheme(); const isDark = theme.mode === 'dark'` — conditional JSX per mode
- `useTheme()` from `packages/store-ui/src/context/ThemeContext.tsx` — used by ALL store-ui components
- `getTheme()` still in `apps/store/src/lib/theme.ts` — only for non-section files in store app
- **Dark mode wiring:** `__root.tsx` in both apps adds `class="dark"` when `theme.mode === 'dark'`

---

## Page Sections (`packages/store-ui/src/components/sections/`)

| Component | File | Theme-aware? |
|---|---|---|
| HeroSection | HeroSection.tsx | ✓ |
| SocialProofBar | SocialProofBar.tsx | ✓ |
| FeatureGrid | FeatureGrid.tsx | ✓ |
| BenefitsSection | BenefitsSection.tsx | ✓ |
| ValueStackSection | ValueStackSection.tsx | ✓ |
| TestimonialSection | TestimonialSection.tsx | ✓ |
| CTASection | CTASection.tsx | ✓ |
| GuaranteeSection | GuaranteeSection.tsx | ✓ |
| OrderSection | OrderSection.tsx | ✓ |
| FAQSection | FAQSection.tsx | ✓ |
| ProductCarousel | ProductCarousel.tsx | ✗ (uses bgColor Tailwind from content.json) |

Page order in `apps/store/src/routes/index.tsx`: Hero → SocialProofBar → FeatureGrid → Benefits → ValueStack → Testimonials → CTA → Guarantees → Order (`#buy`) → FAQs

---

## Payment System

### Store payment (merchant's customers)
- Config lives in `StoreConfig.payment`: `activeMethod` (`cod` | `chargily` | `both`), `chargilyApiKey`, `googleClientId`
- Config set via `PaymentPanel` in builder (NOT customer-facing)
- `configGenerator.ts` writes this to `site.config.ts` when deploying a store
- `submitButtonText` in `OrderSection` dynamically changes based on `activePaymentMethod`: `'cod'` → `'أكّد الطلب'`, `'chargily'` → `'ادفع إلكترونياً →'`

### Platform subscription (merchants pay 7aba)
- `server/createSubscriptionCheckout.ts`: creates Chargily checkout with tier amount
- `server/verifySubscriptionPayment.ts`: polls Chargily, updates `platformUsers.tier` on success
- Requires: `VITE_CHARGILY_PUBLIC_KEY` (client) + `CHARGILY_SECRET_KEY` (server)
- **Webhook Worker**: `https://7aba-webhook.mohessaid.workers.dev` — CF Worker `7aba-webhook` handles Chargily `checkout.paid` events, updates InstantDB `platformUsers.plan` via admin API
- Set webhook URL in Chargily dashboard to: `https://7aba-webhook.mohessaid.workers.dev`

---

## Routes

### apps/store (`src/routes/`)
| Path | File | Purpose |
|---|---|---|
| `/` | `index.tsx` | Landing / order page — **DO NOT EDIT business logic** |
| `/success` | `success.tsx` | Post-order confirmation (`?orderNumber=`) |
| `/dashboard` | `dashboard.tsx` | Admin dashboard (45 KB — complex, read in sections) |
| `/test-components` | `test-components.tsx` | Manual component testing |

### apps/platform (`src/routes/`)
| Path | File | Purpose |
|---|---|---|
| `/` | `index.tsx` | Marketing landing page (JSON-LD schemas) |
| `/pricing` | `pricing.tsx` | Pricing + comparison + FAQ |
| `/demo` | `demo.tsx` | Demo store using `@7aba/store-ui` |
| `/dashboard` | `dashboard/index.tsx` | Auth gate → subscription gate → merchant dashboard |
| `/dashboard/builder` | `dashboard/builder.tsx` | Store builder (`?storeId=`) |
| `/dashboard/deploy` | `dashboard/deploy.tsx` | Deploy wizard (`?tier=free|pro`) |

---

## Key Config

### apps/store — `src/config/site.config.ts`
- Active theme: `brutalistTheme` — swap to `acquisitionTheme` at build time
- `payment.activeMethod`: `'cod'` (default) — change to `'chargily'` or `'both'`
- Feature flags: `notifications: true`, others `false` by default

### apps/platform — `src/lib/configGenerator.ts`
- `generateSiteConfig()` builds store's `site.config.ts` + `content.json` + `wrangler.toml` from `StoreConfig`
- Theme name must match filename: `brutalist` | `acquisition` | `warm`
- `payment.activeMethod` is written to `site.config.ts` by this generator

---

## Environment Variables

### apps/store
| Variable | Purpose | Status |
|---|---|---|
| `VITE_INSTANT_APP_ID` | Store DB app ID | ✅ set (demo) |
| `INSTANT_ADMIN_TOKEN` | Admin SDK (seed scripts only) | ✅ set |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth for buyer auth | ✅ set |
| `CHARGILY_SECRET_KEY` | Chargily server secret (when method=chargily) | ✅ set (test) |
| `VITE_CHARGILY_PUBLIC_KEY` | Chargily public key (client-side) | ✅ set (test) |
| `VITE_APP_URL` | App base URL for Chargily callbacks | ✅ set |
| `VITE_META_PIXEL_ID` | Meta Pixel analytics | ❓ per merchant |

### apps/platform
| Variable | Purpose | Status |
|---|---|---|
| `VITE_INSTANT_APP_ID` | Platform DB App ID | ✅ set |
| `INSTANTDB_ADMIN_TOKEN` | Platform admin token | ✅ set |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth for platform login | ✅ set |
| `CHARGILY_PLATFORM_SECRET_KEY` | Chargily secret for subscriptions | ✅ set (test) |
| `VITE_APP_URL` | App base URL (production: https://7aba.store) | ✅ set |
| `DOWNLOAD_URL_STORE_SOURCE` | Pro tier store source download | ❌ optional (defaults to GitHub archive) |
| `DOWNLOAD_URL_STORE_APP` | Pro tier app APK download | ❌ optional (defaults to GitHub archive) |
| `DOWNLOAD_URL_PLATFORM_SOURCE` | Agency tier platform download | ❌ optional (defaults to GitHub archive) |

---

## Dev Commands

```bash
# From repo root (uses pnpm -r not turbo — turbo binary may segfault):
pnpm dev           # Start all apps in parallel

# Per-app:
cd apps/store && pnpm dev       # port 3000
cd apps/platform && pnpm dev    # port 3001

# InstantDB schema push (use MCP instead when possible):
cd apps/platform && npx instant-cli push schema
npx tsx seed-orders.ts          # Seed test orders (from apps/store/)
```

---

## CI/CD

- **GitHub Actions:** `.github/workflows/deploy.yml` — triggers on push to `main`
- **Builds:** `apps/platform` only (store is a template, not deployed separately)
- **Deploys to:** Cloudflare Pages project `7aba-platform` → `7aba.store`
- **CF token in CI:** `CLOUDFLARE_API_TOKEN` secret in GitHub repo settings

---

## Conventions

- Path alias: `@/*` → `./src/*` in each app; `@7aba/store-ui` → `packages/store-ui/src/index.ts`
- `packages/store-ui` uses TypeScript source directly (no build step) — `"main": "./src/index.ts"`
- Styling: Tailwind utility classes; `cn()` from each workspace's `src/lib/utils.ts`
- DB reads: `db.useQuery({...})` reactive hook (InstantDB)
- DB writes: `db.transact(tx.entity.id().update({...}))` pattern
- RTL: Arabic-first UI; Google Font "Almarai"
- Platform state: Zustand (`useBuilderStore`) — no Redux/Context for builder state
- Store state: InstantDB + local `useState` — no Zustand
- No test framework — manual testing only
- `routeTree.gen.ts` is auto-generated — do not edit manually
- pnpm overrides in root `package.json` enforce React 19.1.1 singleton across all workspaces

---

## Known Gotchas

- `apps/store/src/routes/index.tsx` — **5 pre-existing nullability TS errors** — hard rule: never modify business logic here
- `dashboard.tsx` (store) is 45 KB — read in sections, not all at once
- `algeria-locations.json` is 1.4 MB — import via `useAlgeriaLocations()` hook only (dynamic import)
- `useAlgeriaLocations` returns `loading: boolean` — consumers must handle loading state
- Feature flags in `site.config.ts` control section visibility — check before adding new sections
- `routeTree.gen.ts` regenerates on `pnpm dev` — never commit manual edits
- Order notifications use queue: 5 s display + 2.5 s gap — logic in `useOrderNotifications`
- `pnpm install` may require `pnpm approve-builds` for esbuild + @parcel/watcher (run once)
- `^1.131.31` for `@tanstack/react-start` resolves to latest — must pin exact `1.131.31`
- **Turbo binary may segfault** on some Linux systems — root `package.json` uses `pnpm -r --parallel run dev` as fallback
- `apps/platform/src/lib/instantdb.ts` line 5 — `ImportMeta.env` TS error — pre-existing, do NOT touch
- `apps/store/app/` — **DELETED** (was a legacy duplicate of `apps/store/src/`)
- **TanStack Start v1.131.31 has NO `createAPIFileRoute`** — API/webhook endpoints must be Cloudflare Workers or `createServerFn`
- CF Worker `7aba-webhook` at `https://7aba-webhook.mohessaid.workers.dev` — handles Chargily webhooks; all env vars are **encrypted secrets** (`secret_text` bindings)
- CF Worker `7aba-proxy` — reverse-proxies `7aba.store/*` → `7aba-platform.pages.dev` (DNS token lacked edit perms; proxy worker bypasses this)
- CF Worker `7aba-demo-redirect` — `demo.7aba.store/*` → 301 to `7aba.store/demo`
- Worker route priority: `7aba.store/api/webhook/chargily` (specific) > `7aba.store/*` (proxy) — webhook still hits `7aba-webhook` directly

---

## Update Rules

- **When to update:** After any PR/commit that changes architecture, dependencies, routes, schema, config, or conventions.
- **What to update:** Only the affected section. Do not rewrite sections that haven't changed.
- **How to update:** Edit in place — replace stale lines, don't append duplicates.
- **Frequency:** Once per meaningful work session (not per file edit).
- **Token discipline:** Max ~30 lines per section. Use bullet points. No paragraphs.
