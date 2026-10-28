import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const m = vi.hoisted(() => {
  const transact = vi.fn()
  const updates = []
  const stores = new Proxy({}, { get: (_, id) => ({ update: (patch) => (updates.push({ id, patch }), { id, patch }) }) })
  return { transact, updates, init: vi.fn(() => ({ transact, tx: { stores } })) }
})
vi.mock('@instantdb/admin', () => ({ init: m.init }))

const originalArgv = process.argv
let exit, log, error

/** The script runs main() on import; import it fresh with the given CLI args and let it settle. */
async function run(...args) {
  process.argv = ['node', 'scripts/set-store-status.mjs', ...args]
  vi.resetModules()
  await import('./set-store-status.mjs')
  await new Promise((r) => setTimeout(r, 0))
}

beforeEach(() => {
  m.updates.length = 0
  m.transact.mockReset().mockResolvedValue(undefined)
  m.init.mockClear()
  exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined)
  log = vi.spyOn(console, 'log').mockImplementation(() => {})
  error = vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.stubEnv('VITE_INSTANT_APP_ID', 'app-1')
  vi.stubEnv('PLATFORM_INSTANTDB_ADMIN_TOKEN', 'admin-1')
})

afterEach(() => {
  process.argv = originalArgv
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('set-store-status CLI', () => {
  it('writes deployStatus + lastDeployAt for a non-live status', async () => {
    await run('--store-id=s1', '--status=building')
    expect(m.init).toHaveBeenCalledWith({ appId: 'app-1', adminToken: 'admin-1' })
    expect(m.updates).toHaveLength(1)
    expect(m.updates[0].id).toBe('s1')
    expect(m.updates[0].patch).toEqual({ deployStatus: 'building', lastDeployAt: expect.any(Number) })
    expect(m.transact).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith('✓ store s1 → building')
    expect(exit).not.toHaveBeenCalled()
  })

  it('publishes with the deployed url when live, keeping "=" inside the url', async () => {
    await run('--store-id=s1', '--status=live', '--url=https://x.pages.dev/?a=b')
    expect(m.updates[0].patch).toMatchObject({
      deployStatus: 'live',
      deployedUrl: 'https://x.pages.dev/?a=b',
      status: 'published',
    })
  })

  it('does not publish a live status without a url', async () => {
    await run('--store-id=s1', '--status=live')
    expect(m.updates[0].patch).not.toHaveProperty('status')
    expect(m.updates[0].patch).not.toHaveProperty('deployedUrl')
  })

  it('ignores --url for non-live statuses', async () => {
    await run('--store-id=s1', '--status=failed', '--url=https://x')
    expect(m.updates[0].patch).toEqual({ deployStatus: 'failed', lastDeployAt: expect.any(Number) })
  })

  it('exits 1 with usage when required args are missing', async () => {
    await run('--status=live')
    expect(error).toHaveBeenCalledWith(expect.stringMatching(/^Usage: --store-id=<id> --status=/))
    expect(exit).toHaveBeenCalledWith(1)
    expect(m.transact).not.toHaveBeenCalled()
  })

  it('exits 1 when the write fails', async () => {
    m.transact.mockRejectedValue(new Error('permission denied'))
    await run('--store-id=s1', '--status=queued')
    expect(error).toHaveBeenCalledWith('permission denied')
    expect(exit).toHaveBeenCalledWith(1)
  })
})
