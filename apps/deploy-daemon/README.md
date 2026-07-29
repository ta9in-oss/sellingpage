# deploy-daemon

Self-hosted build + deploy service for merchant stores. Replaces the GitHub
Actions `deploy-store` workflow so builds don't consume metered CI.

## Flow

```
platform triggerStoreDeploy
  → POST https://deploy.7aba.app/deploy  { storeId }   Authorization: Bearer <DEPLOY_SHARED_SECRET>
    → daemon: mark building
    → generateStoreConfig() from InstantDB (decrypts sealed merchant secrets)
    → pnpm --filter store build           (CF_PAGES=1 → apps/store/dist)
    → wrangler pages deploy               (merchant Cloudflare token, from InstantDB)
    → mark live (+ deployedUrl) | failed
```

Endpoints: `POST /deploy {storeId}` (bearer auth), `GET /health`.

## Why concurrency must be 1

The daemon reuses one working tree; `generateStoreConfig` writes shared files
under `apps/store/src/config`. Two parallel builds clobber each other. Raising
`DEPLOY_CONCURRENCY` requires an isolated checkout per job.

## Provision the build box

```bash
# 1. Node 20 + pnpm + git + caddy (run as root)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git caddy
corepack enable

# 2. Source (rsync from a working checkout; no GitHub creds needed on the box)
rsync -az --exclude node_modules --exclude .git ./ bubblewar:~/sellingpage/

# 3. Install deps + fill env
cd ~/sellingpage && pnpm install --frozen-lockfile
cp apps/deploy-daemon/.env.example apps/deploy-daemon/.env
#   edit .env — paste DEPLOY_SHARED_SECRET, PLATFORM_INSTANTDB_ADMIN_TOKEN,
#   STORE_SECRET_KEY, VITE_INSTANT_APP_ID

# 4. Service + reverse proxy
cp apps/deploy-daemon/deploy/deploy-daemon.service /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now deploy-daemon
cp apps/deploy-daemon/deploy/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy   # needs deploy.7aba.app A-record + 80/443 open
```

## Platform side (Cloudflare Pages secrets on 7aba-platform)

- `DEPLOY_WEBHOOK_URL=https://deploy.7aba.app`
- `DEPLOY_SHARED_SECRET=<same value as the box>`

The old `GH_DISPATCH_TOKEN` / `GH_DISPATCH_REPO` are no longer used by the platform.

## Verify

```bash
curl -s https://deploy.7aba.app/health            # {"ok":true,...}
# unauthorized without the secret:
curl -s -X POST https://deploy.7aba.app/deploy -d '{"storeId":"x"}'   # 401
```
