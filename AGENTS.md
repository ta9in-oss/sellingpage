# AGENTS.md — Project Memory

> **For AI agents:** Read this file at the start of every session. Update it when you make structural changes, add/remove dependencies, or change conventions. Keep entries concise — one line where possible. Do NOT add prose or explanations that already exist in code. Update the `Last updated` field on every write.

**Last updated:** 2026-07-15  
**Project:** حبة ستور (7aba.store) — Algerian e-commerce selling page  
**Repo:** https://github.com/Ta9in/sellingpage

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
| Framework | TanStack Start 1.131.31 (full-stack React) |
| UI | React 19, TypeScript 5, Tailwind CSS 4 |
| Routing | TanStack Router (file-based, `/src/routes/`) |
| Database | InstantDB (`@instantdb/react`, `@instantdb/admin`) |
| Components | Shadcn/ui + Radix UI primitives |
| Build | Vite 6 (port 3000) |
| Icons | Lucide React |
| Auth | Google OAuth (`@react-oauth/google`) |
| Analytics | Google Analytics, Meta Pixel, Microsoft Clarity, PostHog |

---

## Project Structure

```
src/
├── routes/           # File-based pages (__root, index, success, dashboard, test-components)
├── components/
│   ├── ui/           # Shadcn base components (button, input, dialog, etc.)
│   └── sections/     # Page sections (HeroSection, OrderForm, OrderSection, etc.)
├── hooks/            # useOrderSubmission, useOrderNotifications, useAlgeriaLocations, useProducts
├── lib/              # instantdb.ts, utils.ts, content.ts, theme.ts, timeUtils.ts
├── config/           # site.config.ts (feature flags), content.json, themes/
├── data/             # algeria-locations.json (58 wilayas → dairas → communes)
├── types/            # content.types.ts
├── utils/            # analytics/ (google, metapixel, clarity, posthog), seo.ts
├── styles/           # app.css
├── instant.schema.ts # DB schema
└── instant.perms.ts  # DB permissions
agents/               # AI agent context files (this file lives at root)
seed-orders.ts        # Dev utility: seeds 13 test orders into InstantDB
```

---

## Database Schema (InstantDB)

**Entities:** `products`, `orders`, `users`, `$users` (auth), `$files`

**`products`:** `product_number` (unique), `name`, `description`, `price`, `image`, `stock`, `is_available`, `created_at`, `updated_at`

**`orders`:** `order_number` (unique), `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `customer_wilaya`, `customer_city`, `quantity`, `status` (JSON), `total_amount`, `created_at`, `updated_at`

**Relationship:** `orderProduct` → orders has-one product, product has-many orders

**Real-time room:** `orderNotifications` → topic: `newOrder`

---

## Theme System (`src/config/themes/`)

- **Interface:** `Theme` in `theme.types.ts` — includes `mode: 'light' | 'dark'`
- **Switch theme:** edit `siteConfig.theme` in `site.config.ts` (compile-time, not runtime)
- **Available themes:** `brutalistTheme` (light, b/w/yellow), `acquisitionTheme` (dark, #0A0A0A bg, #F97316 orange accent)
- **Component pattern:** Each component uses `if (!isDark) { return <original brutalist JSX> }` early-return, then returns the dark acquisition JSX below. This keeps brutalist code pixel-perfect and dark code clean.
- `getTheme()` is in `src/lib/theme.ts` — reads `siteConfig.theme`, no React context

---

## Page Sections (`src/components/sections/`)

| Component | File | Theme-aware? |
|---|---|---|
| HeroSection | HeroSection.tsx | ✓ |
| SocialProofBar | SocialProofBar.tsx | ✓ (new) |
| FeatureGrid | FeatureGrid.tsx | ✓ |
| BenefitsSection | BenefitsSection.tsx | ✓ |
| ValueStackSection | ValueStackSection.tsx | ✓ (new) |
| TestimonialSection | TestimonialSection.tsx | ✓ |
| CTASection | CTASection.tsx | ✓ |
| GuaranteeSection | GuaranteeSection.tsx | ✓ |
| OrderSection | OrderSection.tsx | ✓ |
| FAQSection | FAQSection.tsx | ✓ |
| ProductCarousel | ProductCarousel.tsx | ✗ (uses bgColor Tailwind from content.json — looks wrong in dark theme) |

Page order in `index.tsx`: Hero → SocialProofBar → FeatureGrid → Benefits → ValueStack → Testimonials → CTA → Guarantees → Order (`#buy`) → FAQs

---



## Key Config (`src/config/site.config.ts`)

- Active theme: `brutalistTheme` — swap to `acquisitionTheme` at build time to use dark/orange style
- Feature flags default: `notifications: true`, all others `false`
- To enable acquisition-style sections set: `testimonials, faqs, guarantees, benefits → true`
- **Dark mode wiring:** `__root.tsx` adds `class="dark"` to `<html>` when `siteConfig.theme.mode === 'dark'` — enables Shadcn/ui CSS vars and Tailwind `dark:` variants

---

## Routes

| Path | File | Purpose |
|---|---|---|
| `/` | `index.tsx` | Landing / order page |
| `/success` | `success.tsx` | Post-order confirmation (param: `?orderNumber=`) |
| `/dashboard` | `dashboard.tsx` | Admin dashboard (45 KB — complex) |
| `/test-components` | `test-components.tsx` | Manual component testing |

---

## Dev Commands

```bash
npm run dev     # Start dev server on http://localhost:3000
npm run build   # Production build
npx tsx seed-orders.ts  # Seed test orders into InstantDB
```

---

## Conventions

- Path alias: `@/*` → `./src/*`
- Styling: Tailwind utility classes; `cn()` from `src/lib/utils.ts` for conditional classes
- DB reads: `db.useQuery({...})` reactive hook (InstantDB)
- DB writes: `db.transact(tx.entity.id().update({...}))` pattern
- RTL: Arabic-first UI; Google Font "Almarai"
- No Redux/Zustand — state is InstantDB + local `useState`
- No test framework — manual testing only (no Jest/Vitest)
- `routeTree.gen.ts` is auto-generated — do not edit manually

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_INSTANTDB_APP_ID` | InstantDB app ID |
| `INSTANTDB_ADMIN_TOKEN` | Admin SDK token (server-only, seed script) |

---

## Known Gotchas

- `dashboard.tsx` is 45 KB — read in sections, not all at once
- `algeria-locations.json` is large — import via `useAlgeriaLocations` hook, not directly
- Feature flags in `site.config.ts` control section visibility — check before adding new sections
- `routeTree.gen.ts` regenerates on `npm run dev` — never commit manual edits to it
- Order notifications use a queue with 5 s display + 2.5 s gap timing — logic in `useOrderNotifications`
