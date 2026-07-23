import { createServerFn } from '@tanstack/react-start'
import { init } from '@instantdb/admin'

interface Input {
  storeId: string
}

const REPO = process.env.GH_DISPATCH_REPO ?? 'Ta9in/sellingpage'

export const triggerStoreDeploy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as Input)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const token = process.env.GH_DISPATCH_TOKEN
    if (!token) throw new Error('GH_DISPATCH_TOKEN is not configured on the server')

    // Claim the status BEFORE dispatching. Without this, re-publishing a store
    // that is already `live` leaves deployStatus reading `live` for the whole
    // gap until CI picks the job up — and the wizard, which completes on `live`,
    // would declare success for a build that has not started.
    const db = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
    })
    await db.transact(
      db.tx.stores[data.storeId].update({ deployStatus: 'queued', lastDeployAt: Date.now() })
    )

    const res = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'deploy-store',
        client_payload: { storeId: data.storeId },
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      // Roll the claim back, otherwise the store sits at `queued` forever with
      // no CI job that will ever move it.
      await db.transact(db.tx.stores[data.storeId].update({ deployStatus: 'failed' }))
      throw new Error(`GitHub dispatch failed (${res.status}): ${body.slice(0, 200)}`)
    }

    return { ok: true }
  })
