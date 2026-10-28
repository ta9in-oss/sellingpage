import { describe, it, expect } from 'vitest'
import { buildStoreArtifacts } from './generate-store-config.mjs'

const store = {
  slug: 'demo-shop',
  config: {
    meta: { name: 'Demo', slug: 'demo-shop', locale: 'ar', rtl: true },
    theme: { name: 'brutalist', direction: 'rtl', mode: 'light' },
    product: { name: 'P', price: 999, currency: 'DZD', images: ['data:image/png;base64,X'] },
    notifications: { enabled: false, message: '' },
    sections: [{ id: 'h', type: 'hero', headline: 'A', subheadline: 'B', cta: 'C', image: 'data:image/png;base64,H', freeDelivery: false }],
    payment: { activeMethod: 'cod' },
  },
}

describe('buildStoreArtifacts', () => {
  it('returns site.config.ts source and content.json string from a store row', () => {
    const { siteConfigTs, contentJson } = buildStoreArtifacts(store)
    // The merchant's edited theme is inlined (not imported by preset name) so
    // builder theme edits reach the deployed store.
    expect(siteConfigTs).toContain("import type { Theme } from './themes/theme.types'")
    expect(siteConfigTs).toContain('"name": "brutalist"')
    const content = JSON.parse(contentJson)
    expect(content.hero.title).toEqual(['A'])
    expect(content.hero.priceTag).toEqual({ amount: '999', currency: 'دج' })
  })

  it('throws a clear error when config is missing', () => {
    expect(() => buildStoreArtifacts({ slug: 'x' })).toThrow(/config/i)
  })
})
