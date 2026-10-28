import { describe, it, expect } from 'vitest'
import { merchantsAr } from './arabicPlural'

describe('merchantsAr', () => {
  it('uses the bare singular for 1 (no digit)', () => {
    expect(merchantsAr(1)).toBe('تاجر اشترك في 7aba')
  })

  it('uses the dual for 2 (no digit)', () => {
    expect(merchantsAr(2)).toBe('تاجران اشتركا في 7aba')
  })

  it('uses the plural noun and verb for 3..10', () => {
    expect(merchantsAr(3)).toBe('3 تجار اشتركوا في 7aba')
    expect(merchantsAr(10)).toBe('10 تجار اشتركوا في 7aba')
  })

  it('uses the singular accusative for 11..19 (MSA tamyiz)', () => {
    expect(merchantsAr(11)).toBe('11 تاجراً اشترك في 7aba')
    expect(merchantsAr(19)).toBe('19 تاجراً اشترك في 7aba')
  })

  it('uses the singular accusative from 20 upwards', () => {
    expect(merchantsAr(20)).toBe('20 تاجراً اشترك في 7aba')
    expect(merchantsAr(150)).toBe('150 تاجراً اشترك في 7aba')
  })
})
