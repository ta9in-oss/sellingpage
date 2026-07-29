import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { init } from '@instantdb/admin'
import { generateStoreConfig } from '../../../scripts/generate-store-config.mjs'

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
    if (cfg.cfApiToken) {
      const token = cfg.cfApiToken
      scrub = (s) => s.split(token).join('***')
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
      },
    }, say, scrub)

    // `pages deploy` prompts to create a missing project (hangs headless); create
    // up front, tolerate "already exists".
    say('ensuring Pages project exists')
    await sh('npx', ['wrangler', 'pages', 'project', 'create', projectName, '--production-branch=main'],
      { env: cfEnv, allowFail: true }, say, scrub)

    say('deploying to Cloudflare Pages')
    await sh('npx', ['wrangler', 'pages', 'deploy', 'apps/store/dist',
      `--project-name=${projectName}`, '--branch=main', '--commit-dirty=true'],
      { env: cfEnv }, say, scrub)

    await setStatus(storeId, 'live', publicUrl)
    say(`live → ${publicUrl}`)
    return { ok: true, url: publicUrl }
  } catch (err) {
    say(`failed: ${scrub(err.message)}`)
    await setStatus(storeId, 'failed').catch((e) => say(`warn: could not mark failed: ${e.message}`))
    return { ok: false, error: scrub(err.message) }
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
