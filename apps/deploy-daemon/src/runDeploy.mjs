import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { init } from '@instantdb/admin'
import { initLogger, createRequestLogger } from 'evlog'
import { createFsDrain } from 'evlog/fs'
import { generateStoreConfig } from '../../../scripts/generate-store-config.mjs'

// Daemon stdout is swallowed by the pnpm/systemd wrapper, so events would be
// invisible. The fs drain persists every wide event as NDJSON under
// apps/deploy-daemon/.evlog/logs/ — queryable with the analyze-logs skill.
initLogger({
  env: { service: 'deploy-daemon', environment: process.env.NODE_ENV || 'production' },
  drain: createFsDrain({ dir: `${dirname(fileURLToPath(import.meta.url))}/../.evlog/logs` }),
})

const execFileP = promisify(execFile)
// apps/deploy-daemon/src → repo root
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

async function setStatus(storeId, status, url) {
  const db = init({
    appId: process.env.VITE_INSTANT_APP_ID,
    adminToken: process.env.PLATFORM_INSTANTDB_ADMIN_TOKEN,
  })
  const patch = { deployStatus: status, lastDeployAt: Date.now() }
  if (status === 'live' && url) {
    patch.deployedUrl = url
    patch.status = 'published'
  }
  await db.transact(db.tx.stores[storeId].update(patch))
}

/**
 * Build one store and deploy it to the merchant's Cloudflare Pages. This is the
 * daemon's port of .github/workflows/deploy-store.yml, step-for-step:
 *   building → generate config → pnpm build → wrangler deploy → live | failed
 *
 * The merchant's Cloudflare token is passed to wrangler via env only, and every
 * line logged is scrubbed of it as a backstop against accidental echo.
 */
export async function runDeploy(storeId, { log = console.log } = {}) {
  const startedAt = Date.now()
  // One wide event per deploy — the summary an operator actually needs.
  const evt = createRequestLogger({ storeId })
  await setStatus(storeId, 'building').catch((e) => log(`[${storeId}] warn: could not mark building: ${e.message}`))

  // No-op scrubber until we hold the token; replaced once config is generated.
  let scrub = (s) => s
  const say = (s) => log(`[${storeId}] ${scrub(String(s))}`)

  try {
    say('generating config from InstantDB')
    const cfg = await generateStoreConfig({
      storeId,
      appId: process.env.VITE_INSTANT_APP_ID,
      adminToken: process.env.PLATFORM_INSTANTDB_ADMIN_TOKEN,
      encKey: process.env.STORE_SECRET_KEY ?? '',
    })
    // Scrub every plaintext secret we now hold, not just the Cloudflare token —
    // wrangler and pnpm both echo their environment on some failures.
    const secrets = [cfg.cfApiToken, cfg.chargilyApiKey, cfg.instantAdminToken].filter(Boolean)
    if (secrets.length > 0) {
      scrub = (s) => secrets.reduce((acc, sec) => acc.split(sec).join('***'), String(s))
    }
    if (!cfg.cfApiToken || !cfg.cfAccountId) {
      throw new Error('store has no Cloudflare credentials (cfApiToken / cfAccountId)')
    }

    const projectName = `7aba-${cfg.slug}`
    const publicUrl = `https://${projectName}.pages.dev`
    const cfEnv = { CLOUDFLARE_API_TOKEN: cfg.cfApiToken, CLOUDFLARE_ACCOUNT_ID: cfg.cfAccountId }

    say(`building store "${cfg.slug}"`)
    await sh('pnpm', ['--filter', 'store', 'build'], {
      env: {
        CF_PAGES: '1', // cloudflare-pages preset → apps/store/dist
        VITE_INSTANT_APP_ID: cfg.instantAppId,
        VITE_APP_URL: publicUrl,
        VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID ?? '',
        // Per-store analytics — the store app reads these at build time.
        VITE_GOOGLE_ANALYTICS: cfg.googleAnalyticsId ?? '',
        VITE_MICROSOFT_CLARITY_ID: cfg.clarityId ?? '',
        VITE_META_PIXEL_ID: cfg.metaPixelId ?? '',
        // Chargily publishable key — public, and inlined into the bundle, so it
        // belongs at build time. Per store: each storefront collects into its
        // own merchant account.
        VITE_CHARGILY_PUBLIC_KEY: cfg.chargilyPublicKey ?? '',
      },
    }, say, scrub)

    // `pages deploy` prompts to create a missing project (hangs headless); create
    // up front, tolerate "already exists".
    say('ensuring Pages project exists')
    await sh('npx', ['wrangler', 'pages', 'project', 'create', projectName, '--production-branch=main'],
      { env: cfEnv, allowFail: true }, say, scrub)

    // Runtime secrets for the storefront's server functions. These are read via
    // process.env at request time (apps/store/src/server/*), never inlined, so
    // they must be Pages secrets — a build-time env would not reach them.
    // Must land before the deploy: a deployment binds the secrets that exist
    // when it is created.
    await putPagesSecrets(projectName, {
      CHARGILY_SECRET_KEY: cfg.chargilyApiKey,
      INSTANT_ADMIN_TOKEN: cfg.instantAdminToken,
    }, cfEnv, say, scrub)

    say('deploying to Cloudflare Pages')
    await sh('npx', ['wrangler', 'pages', 'deploy', 'apps/store/dist',
      `--project-name=${projectName}`, '--branch=main', '--commit-dirty=true'],
      { env: cfEnv }, say, scrub)

    await setStatus(storeId, 'live', publicUrl)
    say(`live → ${publicUrl}`)
    evt.set({ deploy: { storeId, slug: cfg.slug, projectName, url: publicUrl, outcome: 'success', durationMs: Date.now() - startedAt } })
    evt.audit({ action: 'store.deploy', actor: { type: 'system', id: 'deploy-daemon' }, target: { type: 'store', id: storeId }, outcome: 'success' })
    evt.emit()
    return { ok: true, url: publicUrl }
  } catch (err) {
    const error = scrub(err.message)
    say(`failed: ${error}`)
    await setStatus(storeId, 'failed').catch((e) => say(`warn: could not mark failed: ${e.message}`))
    evt.error(err)
    evt.set({ deploy: { storeId, outcome: 'failed', durationMs: Date.now() - startedAt, error } })
    evt.audit({ action: 'store.deploy', actor: { type: 'system', id: 'deploy-daemon' }, target: { type: 'store', id: storeId }, outcome: 'failure' })
    evt.emit()
    return { ok: false, error }
  }
}

/**
 * Upload runtime secrets to a merchant's Pages project.
 *
 * `wrangler pages secret put` reads the value from an interactive prompt, which
 * hangs a daemon; `secret bulk` takes a JSON file instead. The file therefore
 * holds plaintext credentials for the length of one command — it is created
 * 0600 in the daemon's own temp dir and unlinked in `finally`, including on
 * failure. Empty values are skipped rather than uploaded blank, so a store with
 * no Chargily key keeps whatever was set before instead of having it wiped.
 */
async function putPagesSecrets(projectName, secrets, cfEnv, say, scrub) {
  const present = Object.fromEntries(Object.entries(secrets).filter(([, v]) => v))
  const names = Object.keys(present)
  if (names.length === 0) {
    say('no runtime secrets to upload (store has no Chargily / InstantDB keys)')
    return
  }

  const file = join(await mkdtemp(join(tmpdir(), 'store-secrets-')), 'secrets.json')
  try {
    await writeFile(file, JSON.stringify(present), { mode: 0o600 })
    say(`uploading runtime secrets: ${names.join(', ')}`)
    await sh('npx', ['wrangler', 'pages', 'secret', 'bulk', file, `--project-name=${projectName}`],
      { env: cfEnv }, say, scrub)
  } finally {
    await rm(dirname(file), { recursive: true, force: true })
  }
}

async function sh(cmd, args, { env = {}, allowFail = false } = {}, say, scrub) {
  try {
    const { stdout, stderr } = await execFileP(cmd, args, {
      cwd: REPO_ROOT,
      env: { ...process.env, ...env },
      maxBuffer: 32 * 1024 * 1024,
    })
    const tail = (stdout + stderr).trim().split('\n').slice(-4).join('\n')
    if (tail) say(scrub(tail))
  } catch (e) {
    const detail = scrub(((e.stderr || '') + (e.stdout || '') || e.message).trim())
    if (allowFail) { say(`(ignored) ${cmd} ${args[0]}: ${detail.split('\n').slice(-1)[0]}`); return }
    throw new Error(`${cmd} ${args[0]} failed: ${detail.split('\n').slice(-3).join(' | ')}`)
  }
}
