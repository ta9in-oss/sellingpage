# Store deploy — operator runbook (Phase 1, Starter)

## One-time setup

### 1. Push the schema (adds `deployStatus`)
The `stores` entity gained a `deployStatus` field. Push it to the platform InstantDB
(run locally, logged in to InstantDB):

    pnpm --filter platform exec npx instant-cli push schema

### 2. GitHub Actions secret
Repo `Ta9in/sellingpage` → Settings → Secrets and variables → Actions → New repository secret:
- `PLATFORM_INSTANTDB_ADMIN_TOKEN` — platform InstantDB admin token (InstantDB dashboard →
  platform app `b9227417-…aff89` → Admin → Admin token). The workflow uses it to read the
  store row (incl. the merchant's CF token) and write deploy status back.

### 3. Platform Cloudflare Pages secret
- `GH_DISPATCH_TOKEN` — GitHub fine-grained PAT scoped to `Ta9in/sellingpage`,
  **Contents: Read and write** (authorizes `repository_dispatch`), Metadata: Read.
  The platform uses it to fire the deploy-store dispatch.

Set it (prompts for the value — never pass it inline):

    wrangler pages secret put GH_DISPATCH_TOKEN --project-name 7aba-platform

## Flow
1. Merchant completes the wizard (review → connect CF/InstantDB → admin) and clicks Deploy.
2. Platform `triggerStoreDeploy` fires `repository_dispatch` (`deploy-store`, payload = `{ storeId }`).
3. `.github/workflows/deploy-store.yml`:
   - `set-store-status` → `building`
   - `generate-store-config` reads the store row, writes `apps/store/src/config/{site.config.ts,content.json}`
   - `pnpm --filter store build` with `CF_PAGES=1` → `apps/store/dist`
   - `wrangler pages deploy apps/store/dist` to the merchant's account (their token)
   - `set-store-status` → `live` (+ deployedUrl) or `failed`
4. The wizard's `DeployingStep` polls `store.deployStatus` and shows the live URL.

## Security
- The merchant's CF token is **never** in the dispatch payload; the workflow fetches it from
  InstantDB via the platform admin token and masks it in logs (`::add-mask::`).

## Verifying a run
- InstantDB Explorer → `stores` → watch `deployStatus`: queued → building → live.
- Actions tab → "Deploy Merchant Store" run logs (token values appear as `***`).
- Open `https://7aba-<slug>.pages.dev`.
