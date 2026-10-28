import { describe, it, expect } from 'vitest'
import { SITE_URL, pageHead, privateHead } from './seo'

describe('pageHead', () => {
  it('builds title, description, OG/Twitter tags and a self-referencing canonical', () => {
    expect(pageHead({ title: 'الأسعار', description: 'خطط حبة', path: '/pricing' })).toEqual({
      meta: [
        { title: 'الأسعار' },
        { name: 'description', content: 'خطط حبة' },
        { property: 'og:title', content: 'الأسعار' },
        { property: 'og:description', content: 'خطط حبة' },
        { property: 'og:url', content: 'https://7aba.app/pricing' },
        { property: 'twitter:title', content: 'الأسعار' },
        { property: 'twitter:description', content: 'خطط حبة' },
      ],
      links: [{ rel: 'canonical', href: 'https://7aba.app/pricing' }],
    })
  })

  it('uses the bare site URL for the homepage', () => {
    const head = pageHead({ title: 't', description: 'd', path: '' })
    expect(head.links).toEqual([{ rel: 'canonical', href: SITE_URL }])
    expect(head.meta).toContainEqual({ property: 'og:url', content: 'https://7aba.app' })
  })
})

describe('privateHead', () => {
  it('sets the title and noindex,nofollow for robots and googlebot', () => {
    expect(privateHead('لوحة التحكم')).toEqual({
      meta: [
        { title: 'لوحة التحكم' },
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'googlebot', content: 'noindex, nofollow' },
      ],
    })
  })

  it('has no canonical link', () => {
    expect(privateHead('x')).not.toHaveProperty('links')
  })
})
