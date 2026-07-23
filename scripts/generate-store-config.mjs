// Reads a store row from the platform InstantDB and writes the store's
// site.config.ts + content.json. Used by .github/workflows/deploy-store.yml.
import { writeFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { generateSiteConfig, generateContentJson } from '../apps/platform/src/lib/configGenerator.ts'

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

  // Mask every secret before emitting any other output.
  if (store.cfApiToken) console.log(`::add-mask::${store.cfApiToken}`)
  if (store.instantAdminToken) console.log(`::add-mask::${store.instantAdminToken}`)
  if (store.chargilyApiKey) console.log(`::add-mask::${store.chargilyApiKey}`)

  const { siteConfigTs, contentJson } = buildStoreArtifacts(store)
  writeFileSync(resolve(STORE_CONFIG_DIR, 'site.config.ts'), siteConfigTs)
  writeFileSync(resolve(STORE_CONFIG_DIR, 'content.json'), contentJson)

  ghOutput('slug', store.slug)
  ghOutput('cf_account_id', store.cfAccountId ?? '')
  ghOutput('cf_api_token', store.cfApiToken ?? '')
  ghOutput('instant_app_id', store.instantAppId ?? '')
  ghOutput('instant_admin_token', store.instantAdminToken ?? '')
  ghOutput('chargily_api_key', store.chargilyApiKey ?? '')

  console.log(`✓ Generated config for "${store.slug}" (${storeId})`)
}

// Only run main when invoked directly, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}
