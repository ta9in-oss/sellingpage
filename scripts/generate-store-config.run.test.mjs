import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHash } from 'node:crypto'
import { encryptSecret } from '../apps/platform/src/lib/secretBox.ts'

// Mock every fs write so the test never touches apps/store (rmSync would wipe
// the real uploads dir otherwise).
const fsm = vi.hoisted(() => ({
  writeFileSync: vi.fn(),
  appendFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  rmSync: vi.fn(),
}))
vi.mock('node:fs', async (importOriginal) => ({ ...(await importOriginal()), ...fsm }))

const db = vi.hoisted(() => ({ query: vi.fn(), init: vi.fn() }))
vi.mock('@instantdb/admin', () => ({ init: db.init }))

import { generateStoreConfig } from './generate-store-config.mjs'

const KEY = 'z7Zq3pQm1sVn8xYbK4dHtL6eR0aWfJcUgO2iN5vT9uE='

const config = () => ({
  meta: { name: 'Demo', slug: 'demo-shop', locale: 'ar', rtl: true, logo: 'https://cdn.example/logo.png' },
  theme: { name: 'brutalist', direction: 'rtl', mode: 'light' },
  product: {
    name: 'P', price: 999, currency: 'DZD',
    images: ['https://cdn.example/a.webp?sig=1', 'data:image/png;base64,X', 'https://cdn.example/a.webp?sig=1'],
  },
  notifications: { enabled: false, message: '' },
  sections: [
    { id: 'h', type: 'hero', headline: 'A', subheadline: 'B', cta: 'C', image: 'https://cdn.example/hero', freeDelivery: false },
    { id: 'f', type: 'features', items: [{ image: '/assets/local.png' }, { image: 'https://cdn.example/broken.jpg' }, {}] },
  ],
  payment: { activeMethod: 'cod' },
})

const storeRow = (over = {}) => ({
  id: 'store-1',
  slug: 'demo-shop',
  cfAccountId: 'acc-1',
  cfApiToken: 'cf-plain',
  instantAppId: 'inst-1',
  instantAdminToken: 'inst-plain',
  chargilyApiKey: 'chg-plain',
  config: config(),
  ...over,
})

const bytes = (s) => new TextEncoder().encode(s)
const sha16 = (s) => createHash('sha1').update(Buffer.from(s)).digest('hex').slice(0, 16)

function imageFetch() {
  return vi.fn(async (url) => {
    if (url.includes('broken')) return new Response('nope', { status: 403 })
    if (url.includes('logo')) return new Response(bytes('LOGO'), { headers: { 'content-type': 'image/png; charset=binary' } })
    if (url.includes('a.webp')) return new Response(bytes('AAA'), { headers: { 'content-type': 'application/octet-stream' } })
    return new Response(bytes('HERO'), { headers: { 'content-type': 'image/jpeg' } })
  })
}

let fetchMock
beforeEach(() => {
  vi.clearAllMocks()
  db.init.mockReturnValue({ query: db.query })
  db.query.mockResolvedValue({ stores: [storeRow()] })
  fetchMock = imageFetch()
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('generateStoreConfig — argument validation', () => {
  it('requires storeId, appId and adminToken', async () => {
    await expect(generateStoreConfig({ appId: 'a', adminToken: 't' })).rejects.toThrow('storeId is required')
    await expect(generateStoreConfig({ storeId: 's', adminToken: 't' })).rejects.toThrow('appId and adminToken are required')
    await expect(generateStoreConfig({ storeId: 's', appId: 'a' })).rejects.toThrow('appId and adminToken are required')
    expect(db.init).not.toHaveBeenCalled()
  })
})

describe('generateStoreConfig — store lookup and secrets', () => {
  it('queries the store by id with the platform credentials', async () => {
    await generateStoreConfig({ storeId: 'store-1', appId: 'app', adminToken: 'tok' })
    expect(db.init).toHaveBeenCalledWith({ appId: 'app', adminToken: 'tok' })
    expect(db.query).toHaveBeenCalledWith({ stores: { $: { where: { id: 'store-1' } } } })
  })

  it('throws when the store does not exist', async () => {
    db.query.mockResolvedValue({ stores: [] })
    await expect(generateStoreConfig({ storeId: 'x', appId: 'a', adminToken: 't' })).rejects.toThrow('No store found for id x')
  })

  it('passes legacy plaintext secrets through and returns resolved values', async () => {
    const cfg = await generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't' })
    expect(cfg).toMatchObject({
      slug: 'demo-shop',
      cfAccountId: 'acc-1',
      cfApiToken: 'cf-plain',
      instantAppId: 'inst-1',
      instantAdminToken: 'inst-plain',
      chargilyApiKey: 'chg-plain',
      googleAnalyticsId: '',
      clarityId: '',
      metaPixelId: '',
      customDomain: '',
      chargilyPublicKey: '',
      sealed: { cfApiToken: 'cf-plain', instantAdminToken: 'inst-plain', chargilyApiKey: 'chg-plain' },
    })
  })

  it('decrypts sealed secrets with the key and exposes the sealed forms', async () => {
    const sealedCf = await encryptSecret('cf-real', KEY)
    const sealedChg = await encryptSecret('chg-real', KEY)
    db.query.mockResolvedValue({ stores: [storeRow({ cfApiToken: sealedCf, chargilyApiKey: sealedChg, instantAdminToken: undefined })] })
    const cfg = await generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't', encKey: KEY })
    expect(cfg.cfApiToken).toBe('cf-real')
    expect(cfg.chargilyApiKey).toBe('chg-real')
    expect(cfg.instantAdminToken).toBe('')
    expect(cfg.sealed).toEqual({ cfApiToken: sealedCf, instantAdminToken: '', chargilyApiKey: sealedChg })
  })

  it('refuses to run when secrets are sealed but no key is provided', async () => {
    db.query.mockResolvedValue({ stores: [storeRow({ cfApiToken: await encryptSecret('x', KEY) })] })
    await expect(generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't' })).rejects.toThrow(
      'This store has encrypted secrets but STORE_SECRET_KEY is not set on the runner',
    )
    expect(fsm.writeFileSync).not.toHaveBeenCalled()
  })

  it('returns the optional analytics / domain / publishable key attrs', async () => {
    db.query.mockResolvedValue({
      stores: [storeRow({ googleAnalyticsId: 'G-1', clarityId: 'c1', metaPixelId: 'p1', customDomain: 'shop.dz', chargilyPublicKey: 'pk' })],
    })
    const cfg = await generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't' })
    expect(cfg).toMatchObject({ googleAnalyticsId: 'G-1', clarityId: 'c1', metaPixelId: 'p1', customDomain: 'shop.dz', chargilyPublicKey: 'pk' })
  })
})

describe('generateStoreConfig — image localization and output files', () => {
  const writtenTo = (suffix) => fsm.writeFileSync.mock.calls.find(([p]) => String(p).endsWith(suffix))

  it('resets the uploads dir, downloads each remote image once and rewrites urls', async () => {
    await generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't' })

    expect(fsm.rmSync).toHaveBeenCalledWith(expect.stringMatching(/apps\/store\/public\/assets\/uploads$/), { recursive: true, force: true })
    expect(fsm.mkdirSync).toHaveBeenCalledWith(expect.stringMatching(/apps\/store\/public\/assets\/uploads$/), { recursive: true })

    // data: and local paths are never fetched
    const fetched = fetchMock.mock.calls.map(([u]) => u)
    expect(fetched.some((u) => u.startsWith('data:') || u.startsWith('/'))).toBe(false)

    // content-type wins (png), else url extension (webp), else content-type jpeg → jpg
    expect(writtenTo(`${sha16('LOGO')}.png`)).toBeTruthy()
    expect(writtenTo(`${sha16('AAA')}.webp`)).toBeTruthy()
    expect(writtenTo(`${sha16('HERO')}.jpg`)).toBeTruthy()

    const content = JSON.parse(writtenTo('content.json')[1])
    expect(JSON.stringify(content)).not.toContain('https://cdn.example/a.webp')
    expect(JSON.stringify(content)).toContain(`/assets/uploads/${sha16('AAA')}.webp`)
    expect(writtenTo('site.config.ts')).toBeTruthy()
    expect(writtenTo('site.config.ts')[0]).toMatch(/apps\/store\/src\/config\/site\.config\.ts$/)
  })

  it('maps a repeated remote url to the same local path', async () => {
    const store = storeRow()
    db.query.mockResolvedValue({ stores: [store] })
    await generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't' })
    const local = `/assets/uploads/${sha16('AAA')}.webp`
    expect(store.config.product.images).toEqual([local, 'data:image/png;base64,X', local])
  })

  it('downloads a url repeated within one image list only once', async () => {
    db.query.mockResolvedValue({ stores: [storeRow()] })
    await generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't' })
    const calls = fetchMock.mock.calls.map(([u]) => u).filter((u) => u.includes('a.webp'))
    expect(calls).toHaveLength(1)
  })

  it('keeps the remote url and warns when a download fails', async () => {
    const store = storeRow()
    db.query.mockResolvedValue({ stores: [store] })
    await generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't' })
    // the config object is localized in place
    expect(store.config.sections[1].items[1].image).toBe('https://cdn.example/broken.jpg')
    expect(store.config.sections[1].items[0].image).toBe('/assets/local.png')
    expect(store.config.meta.logo).toBe(`/assets/uploads/${sha16('LOGO')}.png`)
    expect(store.config.product.images[1]).toBe('data:image/png;base64,X')
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/^warn: could not localize image https:\/\/cdn\.example\/broken\.jpg…: HTTP 403$/))
    expect(console.log).toHaveBeenCalledWith('localized 3 image(s) into public/assets/uploads')
  })

  it('throws a clear error (after fetching) when the store has no config', async () => {
    db.query.mockResolvedValue({ stores: [storeRow({ config: undefined })] })
    await expect(generateStoreConfig({ storeId: 'store-1', appId: 'a', adminToken: 't' })).rejects.toThrow(/config is missing/)
    expect(fsm.rmSync).not.toHaveBeenCalled()
  })
})
