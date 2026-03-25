# Changelog — apps/store (حبة ستور — Selling Page Template)

Changes specific to the store selling page app (`apps/store`).

> This app is the **template** used for deployed merchant stores.  
> It also runs as the demo store at `/demo` within `apps/platform`.  
> **Port:** 3000 · **InstantDB App ID:** `VITE_INSTANTDB_APP_ID` (per merchant)

---

## [Unreleased] — Pending

- [ ] `OrderSection`: read `siteConfig.payment.activeMethod` → show COD or Chargily button
- [ ] Remove payment method toggle from customer-facing `QuantitySelector`
- [ ] `BuyerAuthModal`: fully connect to Chargily checkout (pass email + name)
- [ ] Email + password buyer auth (alternative to Google OAuth)
- [ ] Clean up `apps/store/app/` legacy duplicate directory
- [ ] Configure `VITE_GOOGLE_CLIENT_ID` environment variable

---

## [c09e717] 2026-03-24 — Performance: bundle size, images, lazy loading

- **Algeria JSON**: static import → `import()` (dynamic) — removed 1.4 MB from main bundle
  - `useAlgeriaLocations` now returns `{ ..., loading: boolean }`
  - `EMPTY` sentinel object prevents re-renders during load
  - Main JS bundle: ~1.5 MB → **319 KB**
- **Images**: all PNG/JPEG → WebP (92% smaller); added to `src/public/`
  - `HeroSection` (`@7aba/store-ui`): `<picture>` + WebP source, `fetchPriority="high"`, explicit `width/height`
  - `ProductCarousel`: `<picture>` + WebP, `loading="lazy" decoding="async"`
- **`src/routes/__root.tsx`**: `preconnect` for Google Fonts, `<link rel="preload">` for LCP image, WebP OG image
- **`vite.config.ts`**: `cssCodeSplit: true`, `manualChunks` splitting:
  - `vendor-instantdb`: `@instantdb/react`
  - `vendor-radix`: all `@radix-ui/*`
  - `vendor-icons`: `lucide-react`
  - `vendor-oauth`: `@react-oauth/google`

---

## [457f717] 2026-03-23 — Chargily Pay integration

- `server/createChargilyCheckout.ts`: creates Chargily checkout session with product details
- `server/verifyChargilyPayment.ts`: verifies payment status on redirect return
- `routes/success.tsx`: rebuilt — shows order confirmation, verifies Chargily if applicable
- `src/config/site.config.ts`: added `payment` config block:
  - `activeMethod`: `'cod'` | `'chargily'` | `'both'`
  - `chargilyApiKey`: merchant's Chargily API key
  - `googleClientId`: for buyer auth before Chargily checkout
- `routes/index.tsx`: `BuyerAuthModal` added (inline, Google OAuth flow before Chargily checkout)

---

## [2026-01-29] — Architecture: packages/store-ui extraction

- All section components moved to `packages/store-ui`
- Now imported as `@7aba/store-ui` (no build step, direct TypeScript source)
- `ThemeProvider` + `useTheme` wiring added to `__root.tsx`
- `site.config.ts` drives active theme (compile-time switch)
- `siteConfig.theme` set to `brutalistTheme` by default
- `theme.ts` (store-level): `getTheme()` for non-section files

---

## [2026-01-25 to 2026-01-29] — Notification system refinements

- Order notifications now queue properly: 5 s display + 2.5 s gap between notifications
- `useOrderNotifications`: rewritten with queue-based approach
- Default order quantity set to 1 in form UI

---

## [2025-09-27] — Admin auth fix

- `dashboard.tsx`: fixed admin authentication system
- Auth properly validates against InstantDB `$users` entity

---

## [2025-09-22] — Analytics integration

- **Meta Pixel**: `VITE_META_PIXEL_ID` env var → injected into `__root.tsx`
- **Google Analytics** + **Microsoft Clarity** + **PostHog**: all added
- Favicon + logo added to `src/public/`

---

## [2025-09-14] — Success page + UX improvements

- `routes/success.tsx`: new post-order confirmation page
  - Reads `?orderNumber=` query param
  - Shows customer name + order details from InstantDB
- Responsive design fixes across all section components
- InstantDB schema: `orders` entity updated (status as JSON object, added `customer_email`)

---

## [2025-09-10] — Real-time notifications (initial)

- `useOrderNotifications` hook: InstantDB rooms for real-time new-order alerts
- `orderNotifications` room + `newOrder` topic
- Toast notification component in admin dashboard

---

## [2025-09-04] — Initial selling page

**Core selling page functionality:**

- `routes/index.tsx`: full selling page with order form
- `routes/dashboard.tsx`: seller admin dashboard (45 KB — complex)
- `hooks/useOrderSubmission.ts`: order creation + validation + Cloudflare Analytics
- `hooks/useAlgeriaLocations.ts`: loads `algeria-locations.json`, cascading wilaya → daira → commune select
- `hooks/useProducts.ts`: fetches active product from InstantDB
- `lib/instantdb.ts`: InstantDB client with schema types
- `lib/content.ts`: static page content (Arabic copy, pricing, testimonials, FAQs)
- `lib/utils.ts`: `cn()` utility
- `types/index.ts`: `Order`, `Product`, `WilayaData` types
- `data/algeria-locations.json`: all 58 wilayas with dairas and communes

**InstantDB schema (`instant.schema.ts`):**
- `products`: `product_number` (unique), `name`, `description`, `price`, `image`, `stock`, `is_available`
- `orders`: `order_number` (unique), `customer_*` fields, `quantity`, `status` (JSON), `total_amount`
- `orderProduct` relationship: orders → product (many-to-one)
- Permissions: public order creation, admin-only order management

---

## [2025-09-01] — Project migration

- Migrated from Vite scratch setup to TanStack Start
- Added InstantDB for real-time reactive database
- pnpm workspaces monorepo initialized

---

## [2025-08-25] — Project init

- Initial TanStack Start project
- Algeria location data JSON
- Basic React component structure
