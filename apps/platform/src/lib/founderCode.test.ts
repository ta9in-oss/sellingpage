import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateFounderCode } from './founderCode'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('generateFounderCode', () => {
  it('has the TA9IN-7ABA- prefix and a 6-char body from the unambiguous alphabet', () => {
    for (let i = 0; i < 200; i++) {
      expect(generateFounderCode()).toMatch(/^TA9IN-7ABA-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/)
    }
  })

  it('never emits visually ambiguous characters in the body', () => {
    for (let i = 0; i < 200; i++) {
      const body = generateFounderCode().slice('TA9IN-7ABA-'.length)
      expect(body).not.toMatch(/[01OIL]/)
    }
  })

  it('maps random bytes onto the alphabet modulo its length', () => {
    vi.spyOn(crypto, 'getRandomValues').mockImplementation(<T extends ArrayBufferView<ArrayBuffer>>(arr: T) => {
      const bytes = arr as unknown as Uint8Array
      // 0 → A, 30 → 9 (last), 31 → A (wraps), 255 % 31 = 7 → H, 8 → J, 9 → K
      bytes.set([0, 30, 31, 255, 8, 9])
      return arr
    })
    expect(generateFounderCode()).toBe('TA9IN-7ABA-A9AHJK')
  })

  it('produces different codes across calls', () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateFounderCode()))
    expect(codes.size).toBeGreaterThan(45)
  })
})
