import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getStarterPriceVariant } from './starterPriceVariant'
import { STARTER_PRICE_VARIANTS } from '@/config/pricing'

const KEY = '7aba_starter_price_variant'

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: vi.fn((k: string) => (data.has(k) ? data.get(k)! : null)),
    setItem: vi.fn((k: string, v: string) => void data.set(k, v)),
    data,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('getStarterPriceVariant (server)', () => {
  it('returns the middle variant when there is no window (SSR)', () => {
    expect(typeof window).toBe('undefined')
    expect(getStarterPriceVariant()).toBe(2000)
  })
})

describe('getStarterPriceVariant (browser)', () => {
  let storage: ReturnType<typeof fakeStorage>

  beforeEach(() => {
    storage = fakeStorage()
    vi.stubGlobal('window', { localStorage: storage })
  })

  it('reuses a previously stored valid variant without re-rolling', () => {
    storage.data.set(KEY, '3000')
    const rnd = vi.spyOn(Math, 'random')
    expect(getStarterPriceVariant()).toBe(3000)
    expect(rnd).not.toHaveBeenCalled()
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it('assigns and persists a variant on first visit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
    expect(getStarterPriceVariant()).toBe(1000)
    expect(storage.data.get(KEY)).toBe('1000')
    // stable on subsequent reads
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(getStarterPriceVariant()).toBe(1000)
  })

  it('re-rolls when the stored value is not a known variant', () => {
    storage.data.set(KEY, '1500')
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(getStarterPriceVariant()).toBe(2000)
    expect(storage.data.get(KEY)).toBe('2000')
  })

  it.each([
    [0, 1000],
    [0.25, 1000], // r = 25 → 25-25 = 0 → first bucket (inclusive)
    [0.26, 2000],
    [0.75, 2000], // r = 75 → 75-25-50 = 0 → second bucket
    [0.76, 3000],
    [0.9999, 3000],
  ])('weights 25/50/25: random %s → %s', (r, expected) => {
    vi.spyOn(Math, 'random').mockReturnValue(r)
    expect(getStarterPriceVariant()).toBe(expected)
  })

  it('always returns one of the configured variants', () => {
    for (let i = 0; i < 50; i++) {
      storage.data.clear()
      expect(STARTER_PRICE_VARIANTS).toContain(getStarterPriceVariant())
    }
  })
})
