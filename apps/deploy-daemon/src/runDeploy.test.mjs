import { describe, it, expect, vi, beforeEach } from 'vitest'

const m = vi.hoisted(() => {
  const transact = vi.fn().mockResolvedValue(undefined)
  const update = vi.fn((patch) => ({ patch }))
  const stores = new Proxy({}, { get: (_, id) => ({ update: (patch) => ({ id, ...update(patch) }) }) })
  return {
    transact,
    update,
    init: vi.fn(() => ({ transact, tx: { stores } })),
    execFile: vi.fn(),
    mkdtemp: vi.fn(async (prefix) => `${prefix}XYZ`),
    writeFile: vi.fn(async () => {}),
    rm: vi.fn(async () => {}),
    generateStoreConfig: vi.fn(),
    evt: { set: vi.fn(), audit: vi.fn(), emit: vi.fn(), error: vi.fn() },
  }
})

vi.mock('@instantdb/admin', () => ({ init: m.init }))
vi.mock('node:child_process', () => ({ execFile: m.execFile }))
vi.mock('node:fs/promises', () => ({ mkdtemp: m.mkdtemp, writeFile: m.writeFile, rm: m.rm }))
vi.mock('evlog', () => ({ initLogger: vi.fn(), createRequestLogger: vi.fn(() => m.evt) }))
vi.mock('evlog/fs', () => ({ createFsDrain: vi.fn(() => () => {}) }))
vi.mock('../../../scripts/generate-store-config.mjs', () => ({ generateStoreConfig: m.generateStoreConfig }))

import { runDeploy } from './runDeploy.mjs'

const CF_TOKEN = 'cf-secret-token-123'
const CHARGILY = 'live_sk_chargily_456'
const INSTANT_ADMIN = 'instant-admin-789'

const baseCfg = () => ({
  slug: 'demo-shop',
  cfAccountId: 'acc-1',
  cfApiToken: CF_TOKEN,
  instantAppId: 'inst-app',
  instantAdminToken: INSTANT_ADMIN,
  chargilyApiKey: CHARGILY,
  googleAnalyticsId: 'G-1',
  clarityId: '',
  metaPixelId: 'px',
  chargilyPublicKey: 'pk',
})

/** execFile(cmd, args, opts, cb) as promisify sees it; `handler` returns {stdout,stderr} or throws. */
function execReplies(handler) {
  m.execFile.mockImplementation((cmd, args, opts, cb) => {
    try {
      cb(null, handler(cmd, args, opts) ?? { stdout: '', stderr: '' })
    } catch (e) {
      cb(e)
    }
  })
}

const calls = () => m.execFile.mock.calls.map(([cmd, args]) => [cmd, ...args].join(' '))
const patches = () => m.update.mock.calls.map(([p]) => p)

beforeEach(() => {
  vi.clearAllMocks()
  m.transact.mockResolvedValue(undefined)
  m.generateStoreConfig.mockResolvedValue(baseCfg())
  execReplies(() => ({ stdout: 'ok', stderr: '' }))
})

describe('runDeploy — success', () => {
  it('runs build → project create → secrets → deploy and marks the store live', async () => {
    const log = vi.fn()
    const res = await runDeploy('store-1', { log })
    expect(res).toEqual({ ok: true, url: 'https://7aba-demo-shop.pages.dev' })

    expect(calls()).toEqual([
      'pnpm --filter store build',
      'npx wrangler pages project create 7aba-demo-shop --production-branch=main',
      expect.stringMatching(/^npx wrangler pages secret bulk .*secrets\.json --project-name=7aba-demo-shop$/),
      'npx wrangler pages deploy apps/store/dist --project-name=7aba-demo-shop --branch=main --commit-dirty=true',
    ])

    const statuses = patches().map((p) => p.deployStatus)
    expect(statuses).toEqual(['building', 'live'])
    expect(patches()[1]).toMatchObject({ deployedUrl: 'https://7aba-demo-shop.pages.dev', status: 'published' })
    expect(m.evt.audit).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'success' }))
    expect(m.evt.emit).toHaveBeenCalledTimes(1)
  })

  it('passes per-store build env and Cloudflare creds only via env', async () => {
    await runDeploy('store-1', { log: vi.fn() })
    const [, buildArgs, buildOpts] = m.execFile.mock.calls[0]
    expect(buildArgs).toEqual(['--filter', 'store', 'build'])
    expect(buildOpts.env).toMatchObject({
      CF_PAGES: '1',
      VITE_INSTANT_APP_ID: 'inst-app',
      VITE_APP_URL: 'https://7aba-demo-shop.pages.dev',
      VITE_GOOGLE_ANALYTICS: 'G-1',
      VITE_MICROSOFT_CLARITY_ID: '',
      VITE_META_PIXEL_ID: 'px',
      VITE_CHARGILY_PUBLIC_KEY: 'pk',
    })
    const deployCall = m.execFile.mock.calls[3]
    expect(deployCall[2].env).toMatchObject({ CLOUDFLARE_API_TOKEN: CF_TOKEN, CLOUDFLARE_ACCOUNT_ID: 'acc-1' })
    for (const [, args] of m.execFile.mock.calls) expect(args.join(' ')).not.toContain(CF_TOKEN)
  })

  it('writes runtime secrets to a 0600 temp file and always removes its directory', async () => {
    await runDeploy('store-1', { log: vi.fn() })
    expect(m.writeFile).toHaveBeenCalledTimes(1)
    const [file, content, opts] = m.writeFile.mock.calls[0]
    expect(JSON.parse(content)).toEqual({ CHARGILY_SECRET_KEY: CHARGILY, INSTANT_ADMIN_TOKEN: INSTANT_ADMIN })
    expect(opts).toEqual({ mode: 0o600 })
    expect(file.endsWith('secrets.json')).toBe(true)
    expect(m.rm).toHaveBeenCalledWith(file.replace(/\/secrets\.json$/, ''), { recursive: true, force: true })
  })

  it('skips empty secrets and skips the upload entirely when none are present', async () => {
    m.generateStoreConfig.mockResolvedValue({ ...baseCfg(), chargilyApiKey: '' })
    await runDeploy('store-1', { log: vi.fn() })
    expect(JSON.parse(m.writeFile.mock.calls[0][1])).toEqual({ INSTANT_ADMIN_TOKEN: INSTANT_ADMIN })

    vi.clearAllMocks()
    m.generateStoreConfig.mockResolvedValue({ ...baseCfg(), chargilyApiKey: '', instantAdminToken: '' })
    const log = vi.fn()
    await runDeploy('store-2', { log })
    expect(m.writeFile).not.toHaveBeenCalled()
    expect(calls().some((c) => c.includes('secret bulk'))).toBe(false)
    expect(log).toHaveBeenCalledWith(expect.stringContaining('no runtime secrets to upload'))
  })

  it('tolerates a failing "project create" (project already exists)', async () => {
    execReplies((cmd, args) => {
      if (args.includes('create')) throw Object.assign(new Error('x'), { stderr: 'A project with this name already exists' })
      return { stdout: '', stderr: '' }
    })
    const log = vi.fn()
    const res = await runDeploy('store-1', { log })
    expect(res.ok).toBe(true)
    expect(log).toHaveBeenCalledWith('[store-1] (ignored) npx wrangler: A project with this name already exists')
  })

  it('still deploys when marking "building" fails', async () => {
    m.transact.mockRejectedValueOnce(new Error('db down'))
    const log = vi.fn()
    const res = await runDeploy('store-1', { log })
    expect(res.ok).toBe(true)
    expect(log).toHaveBeenCalledWith('[store-1] warn: could not mark building: db down')
  })
})

describe('runDeploy — failure', () => {
  it('fails without Cloudflare credentials and marks the store failed', async () => {
    m.generateStoreConfig.mockResolvedValue({ ...baseCfg(), cfAccountId: '' })
    const res = await runDeploy('store-1', { log: vi.fn() })
    expect(res).toEqual({ ok: false, error: 'store has no Cloudflare credentials (cfApiToken / cfAccountId)' })
    expect(m.execFile).not.toHaveBeenCalled()
    expect(patches().map((p) => p.deployStatus)).toEqual(['building', 'failed'])
    expect(patches()[1]).not.toHaveProperty('status')
    expect(m.evt.audit).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'failure' }))
  })

  it('reports a config generation error', async () => {
    m.generateStoreConfig.mockRejectedValue(new Error('No store found for id store-1'))
    const res = await runDeploy('store-1', { log: vi.fn() })
    expect(res).toEqual({ ok: false, error: 'No store found for id store-1' })
  })

  it('scrubs every secret from the build error and from logs', async () => {
    execReplies((cmd, args) => {
      if (cmd === 'pnpm') {
        throw Object.assign(new Error('exit 1'), {
          stderr: `env dump\nCLOUDFLARE_API_TOKEN=${CF_TOKEN}\nCHARGILY=${CHARGILY} ADMIN=${INSTANT_ADMIN}`,
        })
      }
      return { stdout: '', stderr: '' }
    })
    const log = vi.fn()
    const res = await runDeploy('store-1', { log })
    expect(res.ok).toBe(false)
    expect(res.error).toBe('pnpm --filter failed: env dump | CLOUDFLARE_API_TOKEN=*** | CHARGILY=*** ADMIN=***')
    const allLogs = log.mock.calls.flat().join('\n')
    for (const s of [CF_TOKEN, CHARGILY, INSTANT_ADMIN]) expect(allLogs).not.toContain(s)
    expect(patches().at(-1).deployStatus).toBe('failed')
  })

  it('scrubs secrets from successful command output tails too', async () => {
    execReplies(() => ({ stdout: `uploaded with ${CF_TOKEN}`, stderr: '' }))
    const log = vi.fn()
    await runDeploy('store-1', { log })
    const allLogs = log.mock.calls.flat().join('\n')
    expect(allLogs).toContain('uploaded with ***')
    expect(allLogs).not.toContain(CF_TOKEN)
  })

  it('removes the secrets temp dir even when the bulk upload fails', async () => {
    execReplies((cmd, args) => {
      if (args.includes('bulk')) throw Object.assign(new Error('bulk failed'), { stderr: 'Authentication error' })
      return { stdout: '', stderr: '' }
    })
    const res = await runDeploy('store-1', { log: vi.fn() })
    expect(res).toEqual({ ok: false, error: 'npx wrangler failed: Authentication error' })
    expect(m.rm).toHaveBeenCalledTimes(1)
    expect(calls().some((c) => c.includes('pages deploy'))).toBe(false)
  })
})
