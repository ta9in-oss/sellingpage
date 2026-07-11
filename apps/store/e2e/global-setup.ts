import { writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateSiteConfig, generateContentJson } from '../../platform/src/lib/configGenerator'
import { E2E_STORE_CONFIG } from './fixture'

const CONFIG_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/config')
const SITE = resolve(CONFIG_DIR, 'site.config.ts')
const CONTENT = resolve(CONFIG_DIR, 'content.json')

// Back up the committed store config, then overwrite it with generator output
// from the fixture. global-teardown restores the originals.
export default function globalSetup() {
  if (!existsSync(`${SITE}.e2e-bak`)) copyFileSync(SITE, `${SITE}.e2e-bak`)
  if (!existsSync(`${CONTENT}.e2e-bak`)) copyFileSync(CONTENT, `${CONTENT}.e2e-bak`)
  writeFileSync(SITE, generateSiteConfig(E2E_STORE_CONFIG))
  writeFileSync(CONTENT, generateContentJson(E2E_STORE_CONFIG))
}
