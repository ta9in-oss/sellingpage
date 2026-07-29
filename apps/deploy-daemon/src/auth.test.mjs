import { describe, it, expect } from 'vitest'
import { isAuthorized } from './auth.mjs'

describe('isAuthorized', () => {
  const secret = 'super-secret-value-123'

  it('accepts the correct bearer token', () => {
    expect(isAuthorized(`Bearer ${secret}`, secret)).toBe(true)
  })

  it('rejects a wrong token', () => {
    expect(isAuthorized('Bearer nope', secret)).toBe(false)
  })

  it('rejects a token of different length without throwing', () => {
    expect(isAuthorized('Bearer short', secret)).toBe(false)
  })

  it('rejects missing or malformed headers', () => {
    expect(isAuthorized(undefined, secret)).toBe(false)
    expect(isAuthorized('', secret)).toBe(false)
    expect(isAuthorized(secret, secret)).toBe(false) // no "Bearer " prefix
  })

  it('never authorizes when no secret is configured', () => {
    expect(isAuthorized('Bearer ', '')).toBe(false)
    expect(isAuthorized('Bearer anything', undefined)).toBe(false)
  })
})
