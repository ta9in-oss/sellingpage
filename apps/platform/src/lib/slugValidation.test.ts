import { describe, it, expect } from 'vitest'
import { validateSlug } from './slugValidation'

const FORMAT_ERROR =
  'يجب أن يكون الاسم من 3 إلى 31 حرفاً، أحرف صغيرة وأرقام وشرطة فقط، ويبدأ بحرف أو رقم'

describe('validateSlug', () => {
  it('accepts a lowercase slug with digits and hyphens', () => {
    expect(validateSlug('my-shop-2')).toEqual({ valid: true })
  })

  it('rejects an empty slug as required', () => {
    expect(validateSlug('')).toEqual({ valid: false, error: 'الاسم مطلوب' })
  })

  it.each(['www', 'app', 'api', 'admin', 'dashboard', 'platform', 'blog', 'help', 'support', 'mail', 'static', 'assets', '7aba'])(
    'rejects reserved slug %s',
    (slug) => {
      expect(validateSlug(slug)).toEqual({ valid: false, error: 'هذا الاسم محجوز' })
    },
  )

  it('enforces the 3..31 length bounds', () => {
    expect(validateSlug('ab')).toEqual({ valid: false, error: FORMAT_ERROR })
    expect(validateSlug('abc').valid).toBe(true)
    expect(validateSlug('a'.repeat(31)).valid).toBe(true)
    expect(validateSlug('a'.repeat(32))).toEqual({ valid: false, error: FORMAT_ERROR })
  })

  it('may start with a digit but not with a hyphen', () => {
    expect(validateSlug('1shop').valid).toBe(true)
    expect(validateSlug('-shop')).toEqual({ valid: false, error: FORMAT_ERROR })
  })

  it.each(['MyShop', 'my_shop', 'my shop', 'متجر', 'shop.dz'])('rejects disallowed characters in %s', (slug) => {
    expect(validateSlug(slug)).toEqual({ valid: false, error: FORMAT_ERROR })
  })

  it('reserved check is case-sensitive, but uppercase still fails the format check', () => {
    expect(validateSlug('WWW')).toEqual({ valid: false, error: FORMAT_ERROR })
  })
})
