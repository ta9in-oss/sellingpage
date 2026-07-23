import { copyFileSync, rmSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const CONFIG_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/config')
const SITE = resolve(CONFIG_DIR, 'site.config.ts')
const CONTENT = resolve(CONFIG_DIR, 'content.json')

// Restore the committed store config after the run.
export default function globalTeardown() {
  for (const f of [SITE, CONTENT]) {
    if (existsSync(`${f}.e2e-bak`)) {
      copyFileSync(`${f}.e2e-bak`, f)
      rmSync(`${f}.e2e-bak`)
    }
  }
}
