import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'

interface Input {
  storeId: string
}

// The self-hosted deploy daemon on the build box (see apps/deploy-daemon). The
// platform posts a signed webhook here instead of firing a GitHub
// repository_dispatch, keeping builds off metered CI.
const DAEMON_URL = process.env.DEPLOY_WEBHOOK_URL

export const triggerStoreDeploy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as Input)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const secret = process.env.DEPLOY_SHARED_SECRET
    if (!DAEMON_URL) throw new Error('DEPLOY_WEBHOOK_URL is not configured on the server')
    if (!secret) throw new Error('DEPLOY_SHARED_SECRET is not configured on the server')

    // Claim the status BEFORE dispatching. Without this, re-publishing a store
    // that is already `live` leaves deployStatus reading `live` for the whole
    // gap until the daemon picks the job up — and the wizard, which completes on
    // `live`, would declare success for a build that has not started.
    const db = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
    })
    await db.transact(
      db.tx.stores[data.storeId].update({ deployStatus: 'queued', lastDeployAt: Date.now() })
    )

    let res: Response
    try {
      res = await fetch(`${DAEMON_URL.replace(/\/$/, '')}/deploy`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId: data.storeId }),
      })
    } catch (err) {
      // Network/DNS failure reaching the daemon — roll the claim back so the
      // store doesn't sit at `queued` with no job coming.
      await db.transact(db.tx.stores[data.storeId].update({ deployStatus: 'failed' }))
      throw new Error(`Deploy daemon unreachable: ${(err as Error).message}`)
    }

    if (!res.ok) {
      const body = await res.text()
      await db.transact(db.tx.stores[data.storeId].update({ deployStatus: 'failed' }))
      throw new Error(`Deploy daemon rejected (${res.status}): ${body.slice(0, 200)}`)
    }

    return { ok: true }
  })
