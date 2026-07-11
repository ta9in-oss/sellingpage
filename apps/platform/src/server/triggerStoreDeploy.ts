import { createServerFn } from '@tanstack/react-start'

interface Input {
  storeId: string
}

const REPO = process.env.GH_DISPATCH_REPO ?? 'Ta9in/sellingpage'

export const triggerStoreDeploy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as Input)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const token = process.env.GH_DISPATCH_TOKEN
    if (!token) throw new Error('GH_DISPATCH_TOKEN is not configured on the server')

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
      throw new Error(`GitHub dispatch failed (${res.status}): ${body.slice(0, 200)}`)
    }

    return { ok: true }
  })
