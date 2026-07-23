// Writes deploy status back to the platform InstantDB store row.
import { init } from '@instantdb/admin'

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')

async function main() {
  const storeId = arg('store-id')
  const status = arg('status')
  const url = arg('url')
  if (!storeId || !status) throw new Error('Usage: --store-id=<id> --status=<queued|building|live|failed> [--url=<url>]')

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
  console.log(`✓ store ${storeId} → ${status}`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
