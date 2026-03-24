# AGENTS.md — Project Memory

> **For AI agents:** Read this file at the start of every session. Update it when you make structural changes, add/remove dependencies, or change conventions. Keep entries concise — one line where possible. Do NOT add prose or explanations that already exist in code. Update the `Last updated` field on every write.

**Last updated:** 2026-03-24  
**Project:** حبة ستور (7aba.store) — Algerian e-commerce platform (store builder + selling page)  
**Repo:** https://github.com/Ta9in/sellingpage  
**Monorepo:** pnpm workspaces + Turborepo — `apps/store`, `apps/platform`, `packages/store-ui`

---

## Update Rules

- **When to update:** After any PR/commit that changes architecture, dependencies, routes, schema, config, or conventions.
- **What to update:** Only the affected section. Do not rewrite sections that haven't changed.
- **How to update:** Edit in place — replace stale lines, don't append duplicates.
- **Frequency:** Once per meaningful work session (not per file edit).
- **Token discipline:** Max ~30 lines per section. Use bullet points. No paragraphs.

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
| Monorepo | pnpm workspaces (`pnpm -r --parallel run dev`) — turbo binary segfaults on this system |
| State | Zustand (platform builder) + InstantDB reactive queries |
| DnD | @dnd-kit/core + @dnd-kit/sortable (builder SectionList) |
| Icons | Lucide React |
| Auth | Google OAuth (`@react-oauth/google`) |
| Analytics | Google Analytics, Meta Pixel, Microsoft Clarity, PostHog |

---

## Project Structure

```
sellingpage/                  ← monorepo root
├── pnpm-workspace.yaml       ← workspace: apps/*, packages/*
├── turbo.json                ← Turborepo task config
├── package.json              ← root: pnpm overrides for React singleton
├── MASTER_PLAN.md / AUTOPILOT.md / AGENTS.md
├── apps/
│   ├── store/                ← original selling page (port 3000)
│   │   └── src/
│   │       ├── routes/       ← __root, index, success, dashboard, test-components
│   │       ├── components/ui/
│   │       ├── hooks/        ← useOrderSubmission, useOrderNotifications, useAlgeriaLocations, useProducts
│   │       ├── lib/          ← instantdb.ts, utils.ts, content.ts, theme.ts, timeUtils.ts
│   │       ├── config/       ← site.config.ts (feature flags + active theme)
│   │       ├── data/         ← algeria-locations.json
│   │       ├── types/, utils/, styles/
│   │       └── instant.schema.ts, instant.perms.ts
│   └── platform/             ← store builder/deploy platform (port 3001)
│       └── src/
│           ├── routes/       ← __root, index, pricing, dashboard/(index, builder, deploy)
│           ├── components/
│           │   ├── builder/  ← BuilderLayout, SectionList, ThemePanel, StorePreview, forms/
│           │   ├── deploy/   ← DeployWizard, steps/
│           │   └── marketing/← Navbar, HeroSection, ComparisonTable, HowItWorks, etc.
│           ├── hooks/        ← useBuilderStore (Zustand), useLang
│           ├── lib/          ← instantdb.ts, utils.ts, slugValidation.ts, configGenerator.ts
│           ├── instant.schema.ts ← platformUsers + stores entities
│           └── routeTree.gen.ts  ← auto-generated, never edit manually
└── packages/
    └── store-ui/             ← @7aba/store-ui — shared React component library
        └── src/
            ├── index.ts      ← main re-export (themes, types, ThemeProvider, useTheme, sections)
            ├── themes/       ← brutalist.ts, acquisition.ts, warm.ts + theme.types.ts + index.ts
            ├── types/        ← StoreConfig, Section, FormField, content.types.ts
            ├── context/      ← ThemeContext.tsx (ThemeProvider + useTheme)
            ├── components/sections/ ← 12 section components (refactored to use useTheme)
            ├── components/ui/ ← button, input, label, alert, command, popover, dialog
            ├── hooks/        ← useAlgeriaLocations
            ├── data/         ← algeria-locations.json
            └── lib/          ← utils.ts (cn)
```

---

## Database Schema (InstantDB)

### apps/store — selling page DB
**App ID:** from `VITE_INSTANTDB_APP_ID` env var  
**Entities:** `products`, `orders`, `users`, `$users` (auth), `$files`  
**`products`:** `product_number` (unique), `name`, `description`, `price`, `image`, `stock`, `is_available`, `created_at`, `updated_at`  
**`orders`:** `order_number` (unique), `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `customer_wilaya`, `customer_city`, `quantity`, `status` (JSON), `total_amount`, `created_at`, `updated_at`  
**Relationship:** `orderProduct` → orders has-one product, product has-many orders  
**Real-time room:** `orderNotifications` → topic: `newOrder`

### apps/platform — builder DB
**App ID:** `b9227417-33f4-4c3d-9c88-612e094aff89` (7aba-platform)  
**Entities:** `platformUsers`, `stores`  
**`platformUsers`:** `email`, `name`, `plan` (free|pro), `createdAt`  
**`stores`:** `slug` (unique), `name`, `config` (JSON blob = StoreConfig), `status` (draft|live), `cfWorkerUrl`, `instantAppId`, `ownerId`, `createdAt`, `updatedAt`  
**Relationship:** `storeOwner` → stores has-one platformUser, platformUser has-many stores

---

## Theme System (`packages/store-ui/src/themes/`)

- **Interface:** `Theme` in `theme.types.ts` — includes `mode: 'light' | 'dark'`
- **Switch theme (store):** edit `siteConfig.theme` in `apps/store/src/config/site.config.ts` (compile-time)
- **Switch theme (platform builder):** `useBuilderStore().config.theme` — runtime via Zustand
- **Available themes:** `brutalistTheme` (light, b/w/yellow), `acquisitionTheme` (dark, #0A0A0A bg, #F97316 orange), `warmTheme` (light, amber/brown)
- **Component pattern:** `const theme = useTheme(); const isDark = theme.mode === 'dark'` — `if (!isDark) return <brutalist JSX>`, then dark JSX below
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

## Key Config

### apps/store — `src/config/site.config.ts`
- Active theme: `brutalistTheme` — swap to `acquisitionTheme` at build time
- Feature flags default: `notifications: true`, all others `false`
- To enable acquisition-style sections: `testimonials, faqs, guarantees, benefits → true`

### apps/platform — `src/lib/configGenerator.ts`
- `generateSiteConfig()` builds store's site.config.ts + content.json + wrangler.toml from `StoreConfig`
- Theme name must match filename: `brutalist` | `acquisition` | `warm`

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
| `/` | `index.tsx` | Marketing landing page |
| `/pricing` | `pricing.tsx` | Pricing + comparison table + FAQ |
| `/dashboard` | `dashboard/index.tsx` | Merchant overview stub |
| `/dashboard/builder` | `dashboard/builder.tsx` | Store builder (param: `?storeId=`) |
| `/dashboard/deploy` | `dashboard/deploy.tsx` | Deploy wizard (param: `?tier=free\|pro`) |

---

## Dev Commands

```bash
# From repo root (turborepo):
pnpm dev           # Start all apps in parallel
pnpm build         # Build all apps via turbo

# Per-app:
cd apps/store && pnpm dev       # port 3000
cd apps/platform && pnpm dev    # port 3001
npx tsx seed-orders.ts          # Seed test orders (from apps/store/)
```

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

## Environment Variables

### apps/store
| Variable | Purpose |
|---|---|
| `VITE_INSTANTDB_APP_ID` | InstantDB app ID (selling page DB) |
| `INSTANTDB_ADMIN_TOKEN` | Admin SDK token (server-only, seed script) |

### apps/platform
| Variable | Purpose |
|---|---|
| `VITE_INSTANT_APP_ID` | `b9227417-33f4-4c3d-9c88-612e094aff89` (7aba-platform DB) |
| `INSTANTDB_ADMIN_TOKEN` | Platform admin token |

---

## Known Gotchas

- `apps/store/src/routes/index.tsx` — **5 pre-existing nullability TS errors** — hard rule: never modify business logic here
- `dashboard.tsx` (store) is 45 KB — read in sections, not all at once
- `algeria-locations.json` is large — import via `useAlgeriaLocations` hook only
- Feature flags in `site.config.ts` control section visibility — check before adding new sections
- `routeTree.gen.ts` regenerates on `pnpm dev` — never commit manual edits
- Order notifications use queue: 5 s display + 2.5 s gap — logic in `useOrderNotifications`
- `pnpm install` may require `pnpm approve-builds` for esbuild + @parcel/watcher (run once)
- `^1.131.31` for @tanstack/react-start resolves to latest (e.g. 1.167.3) which needs vite@>=7 — pin exact `1.131.31`
- **Turbo binary segfaults** on this system (SIGSEGV) — root `package.json` uses `pnpm -r --parallel run dev` instead
- **Subscription gate**: Dashboard checks `platformUsers.tier` after login — no tier → shows inline pricing gate (3 tiers: starter/pro/agency)
- **Tiers**: `starter` 3,900 DZD (create stores), `pro` 14,900 DZD (+ download store/app source), `agency` 49,000 DZD (+ platform source + reselling)
- **Payment flow**: Chargily checkout via `createSubscriptionCheckout` server fn → success redirect with `?payment=success&tier=xxx&checkout_id=xxx` → verify via `verifySubscriptionPayment` → update `platformUsers.tier`
- **Downloads**: Tier-gated `DownloadCard` components (Pro: store-source + store-app, Agency: + platform-source) via `getDownloadUrl` server fn
- **Env vars needed**: `CHARGILY_PLATFORM_SECRET_KEY`, `VITE_APP_URL`, `INSTANT_ADMIN_TOKEN`, `DOWNLOAD_URL_STORE_SOURCE`, `DOWNLOAD_URL_STORE_APP`, `DOWNLOAD_URL_PLATFORM_SOURCE`
- **Buyer auth** for Chargily: `OrderSection` calls `onAuthRequest()` if no `buyerEmail` and Chargily is active — auth UI is `BuyerAuthModal` in `apps/store/src/routes/index.tsx`
- `VITE_GOOGLE_CLIENT_ID` env var required in `apps/store` for Google OAuth buyer auth to work
- **Dashboard store settings** (CF Account ID, InstantDB credentials) saved via `StoreSettingsModal` in `apps/platform/src/routes/dashboard/index.tsx`
