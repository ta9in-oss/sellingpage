import { describe, it, expect } from 'vitest'
import { generateContent, generateSiteConfig } from './configGenerator'
import type { StoreConfig } from '@7aba/store-ui'

const base: StoreConfig = {
  meta: { name: 'متجري', slug: 'my-store', locale: 'ar', rtl: true, siteTitle: 'متجري', siteDescription: 'وصف' },
  theme: { name: 'brutalist', direction: 'rtl', mode: 'light' } as StoreConfig['theme'],
  product: { name: 'حقيبة', price: 2500, currency: 'DZD', images: ['data:image/png;base64,AAA', 'data:image/png;base64,BBB'] },
  notifications: { enabled: true, message: 'اشترى أحدهم' },
  sections: [
    { id: 'h', type: 'hero', headline: 'حزام واحد', subheadline: 'يحكم الكل', cta: 'اشتر الآن', image: 'data:image/png;base64,HERO', freeDelivery: true },
    { id: 'f', type: 'features', title: 'المميزات', items: [{ icon: 'star', title: 'السعة', body: 'كبيرة' }] },
    { id: 't', type: 'testimonials', title: 'آراء', items: [{ name: 'أحمد', text: 'رائع', rating: 5, location: 'وهران' }] },
    { id: 'q', type: 'faq', title: 'أسئلة', items: [{ q: 'كيف أطلب؟', a: 'عبر النموذج' }] },
  ],
  payment: { activeMethod: 'cod' },
}

describe('generateContent', () => {
  it('maps hero section + product price into SiteContent.hero', () => {
    const c = generateContent(base)
    expect(c.hero.title).toEqual(['حزام واحد'])
    expect(c.hero.description).toBe('يحكم الكل')
    expect(c.hero.ctaText).toBe('اشتر الآن')
    expect(c.hero.image).toBe('data:image/png;base64,HERO')
    expect(c.hero.priceTag).toEqual({ amount: '2500', currency: 'دج' })
    expect(c.hero.freeDelivery).toBe(true)
  })

  it('maps features items (icon→image, rotating bgColor)', () => {
    const c = generateContent(base)
    expect(c.features).toHaveLength(1)
    expect(c.features[0]).toMatchObject({ title: 'السعة', description: 'كبيرة' })
    expect(typeof c.features[0].bgColor).toBe('string')
  })

  it('derives productImages from product.images with ids', () => {
    const c = generateContent(base)
    expect(c.productImages.map((p) => p.id)).toEqual([1, 2])
    expect(c.productImages[0].image).toBe('data:image/png;base64,AAA')
  })

  it('maps testimonials and faqs with numeric ids', () => {
    const c = generateContent(base)
    expect(c.testimonials?.[0]).toMatchObject({ id: 1, name: 'أحمد', comment: 'رائع', rating: 5, location: 'وهران' })
    expect(c.faqs?.[0]).toMatchObject({ id: 1, question: 'كيف أطلب؟', answer: 'عبر النموذج' })
  })

  it('omits sections that are absent', () => {
    const c = generateContent({ ...base, sections: [base.sections[0]] })
    expect(c.features).toEqual([])
    expect(c.testimonials).toBeUndefined()
    expect(c.faqs).toBeUndefined()
  })

  it('always provides sections.specs/order titles', () => {
    const c = generateContent(base)
    expect(c.sections.specs.title).toBeTruthy()
    expect(c.sections.order.title).toBeTruthy()
  })
})

describe('generateSiteConfig', () => {
  it('imports the theme by name and the store theme types (not a phantom module)', () => {
    const src = generateSiteConfig(base)
    expect(src).toContain("from './themes/theme.types'")
    expect(src).toContain("from './themes/brutalist'")
    expect(src).not.toContain('site.config.types')
    expect(src).toContain('brutalistTheme as Theme')
  })

  it('emits feature flags reflecting present sections', () => {
    const src = generateSiteConfig(base)
    expect(src).toMatch(/testimonials:\s*true/)
    expect(src).toMatch(/faqs:\s*true/)
    expect(src).toMatch(/guarantees:\s*false/)
  })

  it('emits site metadata and payment method', () => {
    const src = generateSiteConfig(base)
    expect(src).toContain('name: "متجري"')
    expect(src).toContain("activeMethod: 'cod'")
  })
})
