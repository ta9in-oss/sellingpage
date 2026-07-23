// Reads a store row from the platform InstantDB and writes the store's
// site.config.ts + content.json. Used by .github/workflows/deploy-store.yml.
import { writeFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { generateSiteConfig, generateContentJson } from '../apps/platform/src/lib/configGenerator.ts'
import { decryptSecret, isEncrypted } from '../apps/platform/src/lib/secretBox.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STORE_CONFIG_DIR = resolve(__dirname, '../apps/store/src/config')

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

async function main() {
  const storeId = process.argv.find((a) => a.startsWith('--store-id='))?.split('=')[1]
  if (!storeId) throw new Error('Usage: node scripts/generate-store-config.mjs --store-id=<id>')

  const appId = process.env.VITE_INSTANT_APP_ID
  const adminToken = process.env.PLATFORM_INSTANTDB_ADMIN_TOKEN
  if (!appId || !adminToken) throw new Error('VITE_INSTANT_APP_ID and PLATFORM_INSTANTDB_ADMIN_TOKEN are required')

  const store = await fetchStore(appId, adminToken, storeId)

  // Merchant secrets are sealed at rest (see apps/platform/src/lib/secretBox.ts).
  // Open them here — this runner is the only other place besides the platform
  // worker that holds STORE_SECRET_KEY. Values written before encryption was
  // introduced are plaintext and pass through untouched.
  const encKey = process.env.STORE_SECRET_KEY ?? ''
  const sealed = [store.cfApiToken, store.instantAdminToken, store.chargilyApiKey].filter(isEncrypted)
  if (sealed.length > 0 && !encKey) {
    throw new Error('This store has encrypted secrets but STORE_SECRET_KEY is not set on the runner')
  }
  const cfApiToken = store.cfApiToken ? await decryptSecret(store.cfApiToken, encKey) : ''
  const instantAdminToken = store.instantAdminToken ? await decryptSecret(store.instantAdminToken, encKey) : ''
  const chargilyApiKey = store.chargilyApiKey ? await decryptSecret(store.chargilyApiKey, encKey) : ''

  // Mask every secret before emitting any other output. Mask both forms: the
  // plaintext is what leaks if a later step echoes it, and the ciphertext is
  // what a query dump would show.
  for (const s of [cfApiToken, instantAdminToken, chargilyApiKey, store.cfApiToken, store.instantAdminToken, store.chargilyApiKey]) {
    if (s) console.log(`::add-mask::${s}`)
  }

  const { siteConfigTs, contentJson } = buildStoreArtifacts(store)
  writeFileSync(resolve(STORE_CONFIG_DIR, 'site.config.ts'), siteConfigTs)
  writeFileSync(resolve(STORE_CONFIG_DIR, 'content.json'), contentJson)

  ghOutput('slug', store.slug)
  ghOutput('cf_account_id', store.cfAccountId ?? '')
  ghOutput('cf_api_token', cfApiToken)
  ghOutput('instant_app_id', store.instantAppId ?? '')
  ghOutput('instant_admin_token', instantAdminToken)
  ghOutput('chargily_api_key', chargilyApiKey)

  console.log(`✓ Generated config for "${store.slug}" (${storeId})`)
}

// Only run main when invoked directly, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}
