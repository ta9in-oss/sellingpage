// Reads a store row from the platform InstantDB and writes the store's
// site.config.ts + content.json. Used by .github/workflows/deploy-store.yml.
import { writeFileSync, appendFileSync, mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { generateSiteConfig, generateContentJson } from '../apps/platform/src/lib/configGenerator.ts'
import { decryptSecret, isEncrypted } from '../apps/platform/src/lib/secretBox.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STORE_CONFIG_DIR = resolve(__dirname, '../apps/store/src/config')
// Downloaded images are baked into the store's own static assets so the deployed
// store never depends on a signed/expiring InstantDB URL.
const UPLOADS_DIR = resolve(__dirname, '../apps/store/public/assets/uploads')
const UPLOADS_URL_PREFIX = '/assets/uploads/'

const EXT_BY_TYPE = {
  'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg',
  'image/jpg': 'jpg', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif',
}

/**
 * Download every remote (http/https) image referenced by the store config into
 * the store's public/assets/uploads and rewrite the config to point at those
 * permanent local paths. Data URLs and already-local paths are left untouched.
 * Mutates and returns `config`.
 */
async function localizeStoreImages(config, log = () => {}) {
  // Start clean so a previous store's images never leak into this build.
  rmSync(UPLOADS_DIR, { recursive: true, force: true })
  mkdirSync(UPLOADS_DIR, { recursive: true })

  const cache = new Map() // remote url -> local path (dedupe repeated urls)
  const isRemote = (v) => typeof v === 'string' && /^https?:\/\//i.test(v)

  const localize = async (url) => {
    if (!isRemote(url)) return url
    if (cache.has(url)) return cache.get(url)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
      const buf = Buffer.from(await res.arrayBuffer())
      const ext = EXT_BY_TYPE[type] || (url.split('?')[0].match(/\.(webp|png|jpe?g|gif|svg|avif)$/i)?.[1] || 'img').toLowerCase()
      const name = `${createHash('sha1').update(buf).digest('hex').slice(0, 16)}.${ext}`
      writeFileSync(resolve(UPLOADS_DIR, name), buf)
      const local = `${UPLOADS_URL_PREFIX}${name}`
      cache.set(url, local)
      return local
    } catch (e) {
      log(`warn: could not localize image ${url.slice(0, 60)}…: ${e.message}`)
      return url // fall back to the remote url rather than break the build
    }
  }

  const localizeList = async (arr) =>
    Array.isArray(arr) ? Promise.all(arr.map((u) => localize(u))) : arr

  if (config.meta) config.meta.logo = await localize(config.meta.logo)
  if (config.product) config.product.images = await localizeList(config.product.images)
  for (const s of config.sections ?? []) {
    if (s.type === 'hero' && s.image) s.image = await localize(s.image)
    if (s.type === 'product-carousel') s.images = await localizeList(s.images)
    if (s.type === 'features') {
      for (const it of s.items ?? []) if (it.image) it.image = await localize(it.image)
    }
  }
  log(`localized ${cache.size} image(s) into public/assets/uploads`)
  return config
}

export function buildStoreArtifacts(store) {
  if (!store || !store.config) throw new Error('store.config is missing — cannot generate artifacts')
  return {
    siteConfigTs: generateSiteConfig(store.config),
    contentJson: generateContentJson(store.config),
  }
}

async function fetchStore(appId, adminToken, storeId) {
  const { init } = await import('@instantdb/admin')
  const db = init({ appId, adminToken })
  const res = await db.query({ stores: { $: { where: { id: storeId } } } })
  const store = res.stores?.[0]
  if (!store) throw new Error(`No store found for id ${storeId}`)
  return store
}

function ghOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`)
}

/**
 * Fetches a store, decrypts its sealed merchant secrets, writes the store's
 * config files, and RETURNS the resolved values. No stdout side effects — the
 * caller decides what to do with the secrets (GitHub masking, or the deploy
 * daemon feeding them to wrangler). Shared by the CLI below and
 * apps/deploy-daemon so both build stores identically.
 *
 * @param {{storeId: string, appId: string, adminToken: string, encKey?: string}} p
 */
export async function generateStoreConfig({ storeId, appId, adminToken, encKey = '' }) {
  if (!storeId) throw new Error('storeId is required')
  if (!appId || !adminToken) throw new Error('appId and adminToken are required')

  const store = await fetchStore(appId, adminToken, storeId)

  // Merchant secrets are sealed at rest (see apps/platform/src/lib/secretBox.ts).
  // Open them here — a runner that holds STORE_SECRET_KEY. Values written before
  // encryption was introduced are plaintext and pass through untouched.
  const sealed = [store.cfApiToken, store.instantAdminToken, store.chargilyApiKey].filter(isEncrypted)
  if (sealed.length > 0 && !encKey) {
    throw new Error('This store has encrypted secrets but STORE_SECRET_KEY is not set on the runner')
  }
  const cfApiToken = store.cfApiToken ? await decryptSecret(store.cfApiToken, encKey) : ''
  const instantAdminToken = store.instantAdminToken ? await decryptSecret(store.instantAdminToken, encKey) : ''
  const chargilyApiKey = store.chargilyApiKey ? await decryptSecret(store.chargilyApiKey, encKey) : ''

  // Bake remote images into the store's own assets → permanent, non-expiring URLs.
  if (store.config) await localizeStoreImages(store.config, (m) => console.log(m))

  const { siteConfigTs, contentJson } = buildStoreArtifacts(store)
  writeFileSync(resolve(STORE_CONFIG_DIR, 'site.config.ts'), siteConfigTs)
  writeFileSync(resolve(STORE_CONFIG_DIR, 'content.json'), contentJson)

  return {
    slug: store.slug,
    cfAccountId: store.cfAccountId ?? '',
    cfApiToken,
    instantAppId: store.instantAppId ?? '',
    instantAdminToken,
    chargilyApiKey,
    // Non-secret per-store analytics + domain (plain store attrs). Injected as
    // build-time VITE_ env for the store app; empty string = feature disabled.
    googleAnalyticsId: store.googleAnalyticsId ?? '',
    clarityId: store.clarityId ?? '',
    metaPixelId: store.metaPixelId ?? '',
    customDomain: store.customDomain ?? '',
    // Raw sealed forms so a caller (e.g. GitHub Actions) can mask both.
    sealed: {
      cfApiToken: store.cfApiToken ?? '',
      instantAdminToken: store.instantAdminToken ?? '',
      chargilyApiKey: store.chargilyApiKey ?? '',
    },
  }
}

async function main() {
  const storeId = process.argv.find((a) => a.startsWith('--store-id='))?.split('=')[1]
  if (!storeId) throw new Error('Usage: node scripts/generate-store-config.mjs --store-id=<id>')

  const appId = process.env.VITE_INSTANT_APP_ID
  const adminToken = process.env.PLATFORM_INSTANTDB_ADMIN_TOKEN
  if (!appId || !adminToken) throw new Error('VITE_INSTANT_APP_ID and PLATFORM_INSTANTDB_ADMIN_TOKEN are required')

  const cfg = await generateStoreConfig({
    storeId,
    appId,
    adminToken,
    encKey: process.env.STORE_SECRET_KEY ?? '',
  })

  // Mask every secret before emitting any other output. Mask both forms: the
  // plaintext is what leaks if a later step echoes it, and the ciphertext is
  // what a query dump would show.
  for (const s of [
    cfg.cfApiToken, cfg.instantAdminToken, cfg.chargilyApiKey,
    cfg.sealed.cfApiToken, cfg.sealed.instantAdminToken, cfg.sealed.chargilyApiKey,
  ]) {
    if (s) console.log(`::add-mask::${s}`)
  }

  ghOutput('slug', cfg.slug)
  ghOutput('cf_account_id', cfg.cfAccountId)
  ghOutput('cf_api_token', cfg.cfApiToken)
  ghOutput('instant_app_id', cfg.instantAppId)
  ghOutput('instant_admin_token', cfg.instantAdminToken)
  ghOutput('chargily_api_key', cfg.chargilyApiKey)

  console.log(`✓ Generated config for "${cfg.slug}" (${storeId})`)
}

// Only run main when invoked directly, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}
