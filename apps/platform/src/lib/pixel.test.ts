import { describe, it, expect, vi, afterEach } from 'vitest'
import { trackPixel, trackPixelCustom } from './pixel'
import { trackGtag, trackClarity } from './track'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('analytics helpers on the server', () => {
  it('are no-ops without window', () => {
    expect(() => {
      trackPixel('Purchase')
      trackPixelCustom('Abandon')
      trackGtag('purchase')
      trackClarity('purchase')
    }).not.toThrow()
  })
})

describe('analytics helpers in the browser', () => {
  it('are no-ops when the vendor globals are not loaded', () => {
    vi.stubGlobal('window', {})
    expect(() => {
      trackPixel('Purchase')
      trackPixelCustom('Abandon')
      trackGtag('purchase')
      trackClarity('purchase')
    }).not.toThrow()
  })

  it('forwards Meta standard and custom events to fbq', () => {
    const fbq = vi.fn()
    vi.stubGlobal('window', { fbq })
    trackPixel('Purchase', { value: 2000, currency: 'DZD' })
    trackPixelCustom('CheckoutAbandoned')
    expect(fbq.mock.calls).toEqual([
      ['track', 'Purchase', { value: 2000, currency: 'DZD' }],
      ['trackCustom', 'CheckoutAbandoned', undefined],
    ])
  })

  it('forwards GA4 events to gtag and Clarity events to clarity', () => {
    const gtag = vi.fn()
    const clarity = vi.fn()
    vi.stubGlobal('window', { gtag, clarity })
    trackGtag('begin_checkout', { tier: 'starter' })
    trackClarity('signup')
    expect(gtag).toHaveBeenCalledWith('event', 'begin_checkout', { tier: 'starter' })
    expect(clarity).toHaveBeenCalledWith('event', 'signup')
  })

  it('ignores a vendor global that is not a function', () => {
    vi.stubGlobal('window', { fbq: 'queued', gtag: {}, clarity: 1 })
    expect(() => {
      trackPixel('Purchase')
      trackGtag('x')
      trackClarity('x')
    }).not.toThrow()
  })
})
