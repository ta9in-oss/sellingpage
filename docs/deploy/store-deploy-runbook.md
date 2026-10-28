# Store deploy — operator runbook (Phase 1, Starter)

## One-time setup

### 1. Push the schema (adds `deployStatus`)
The `stores` entity gained a `deployStatus` field. Push it to the platform InstantDB
(run locally, logged in to InstantDB):

    pnpm --filter platform exec npx instant-cli push schema

Done on 2026-07-23. Note InstantDB creates an attribute on first write anyway, so this
push types the field rather than unblocking it.

### 2. GitHub Actions secret
Repo `ta9in-oss/sellingpage` → Settings → Secrets and variables → Actions → New repository secret:
- `PLATFORM_INSTANTDB_ADMIN_TOKEN` — platform InstantDB admin token (InstantDB dashboard →
  platform app `b9227417-…aff89` → Admin → Admin token). The workflow uses it to read the
  store row (incl. the merchant's CF token) and write deploy status back.

### 3. Platform Cloudflare Pages secret
- `GH_DISPATCH_TOKEN` — GitHub fine-grained PAT scoped to `ta9in-oss/sellingpage`,
  **Contents: Read and write** (authorizes `repository_dispatch`), Metadata: Read.
  The platform uses it to fire the deploy-store dispatch.

Set it (prompts for the value — never pass it inline):

    wrangler pages secret put GH_DISPATCH_TOKEN --project-name 7aba-platform

### 4. `STORE_SECRET_KEY` — in BOTH places, same value

Merchant secrets (`cfApiToken`, `instantAdminToken`) are encrypted at rest with
AES-256-GCM. The platform encrypts on write; CI decrypts at deploy time. Both need the
identical key. Mint one:

    node scripts/generate-secret-key.mjs

Then set it in both places, pasting the value at the prompt:

    wrangler pages secret put STORE_SECRET_KEY --project-name 7aba-platform
    gh secret set STORE_SECRET_KEY

**If the two ever disagree, deploys fail** with `Could not decrypt secret — wrong
STORE_SECRET_KEY`. That is the intended behaviour: a wrong key must not produce a
plausible-looking token that then gets handed to Cloudflare.

**Losing the key is unrecoverable.** Every stored merchant token becomes undecryptable
and each merchant has to re-enter theirs. Keep a copy in a password manager.

**Rotating it** is not just a swap: values sealed under the old key cannot be read with
the new one. To rotate, decrypt-and-reseal every stored secret with both keys in hand
before replacing either secret.

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
  InstantDB via the platform admin token and masks it in logs (`::add-mask::`) — both the
  plaintext and the ciphertext form.
- Merchant secrets are **encrypted at rest** (`apps/platform/src/lib/secretBox.ts`,
  AES-256-GCM under `STORE_SECRET_KEY`). The browser never sees the key and never receives
  the plaintext back: secret inputs render empty with a "saved and encrypted" hint, and
  leaving one blank keeps the stored value.
- Writes go through the `saveMerchantSecrets` server function. Clients no longer transact
  secret fields directly — that is what keeps the key server-side.
- Scope of this protection: it defends the tokens against anyone who reaches the *database*
  (an export, a leaked admin token, a client query). It does **not** defend them against
  compromise of the platform worker or a CI runner, since both must decrypt to work.
- Secrets written before this change are plaintext and still deploy; they are re-sealed the
  next time the merchant saves. To force it, have merchants re-enter their token.
- Advise merchants to scope their Cloudflare token to Pages edit on their own account only.

## Verifying a run
- InstantDB Explorer → `stores` → watch `deployStatus`: queued → building → live.
- Actions tab → "Deploy Merchant Store" run logs (token values appear as `***`).
- Open `https://7aba-<slug>.pages.dev`.
