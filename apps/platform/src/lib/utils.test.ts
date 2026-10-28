import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins truthy class values and drops falsy ones', () => {
    expect(cn('a', false && 'b', null, undefined, { c: true, d: false }, ['e'])).toBe('a c e')
  })

  it('lets later Tailwind utilities override conflicting earlier ones', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})
