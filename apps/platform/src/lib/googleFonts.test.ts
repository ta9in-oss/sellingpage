import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

type FakeLink = { rel?: string; href?: string }
let appended: FakeLink[]

beforeEach(() => {
  appended = []
  vi.stubGlobal('document', {
    createElement: vi.fn(() => ({}) as FakeLink),
    head: { appendChild: vi.fn((el: FakeLink) => appended.push(el)) },
  })
  // fresh module so the "already loaded" set starts empty per test
  vi.resetModules()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function load() {
  return import('./googleFonts')
}

describe('loadGoogleFont', () => {
  it('injects a stylesheet link with spaces encoded as +', async () => {
    const { loadGoogleFont } = await load()
    loadGoogleFont('Noto Sans Arabic')
    expect(appended).toEqual([
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;700;800&display=swap',
      },
    ])
  })

  it('uses only the first family of a CSS font stack, trimmed', async () => {
    const { loadGoogleFont } = await load()
    loadGoogleFont('  Cairo , sans-serif')
    expect(appended).toHaveLength(1)
    expect(appended[0].href).toContain('family=Cairo:')
  })

  it('is idempotent per font, including across stack variants', async () => {
    const { loadGoogleFont } = await load()
    loadGoogleFont('Almarai')
    loadGoogleFont('Almarai')
    loadGoogleFont('Almarai, sans-serif')
    loadGoogleFont('Tajawal')
    expect(appended.map((l) => l.href)).toEqual([
      'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap',
      'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800&display=swap',
    ])
  })

  it('ignores empty names', async () => {
    const { loadGoogleFont } = await load()
    loadGoogleFont('')
    loadGoogleFont('  , serif')
    expect(appended).toHaveLength(0)
  })
})

describe('FONT_OPTIONS', () => {
  it('has unique names and lists Arabic fonts before Latin ones', async () => {
    const { FONT_OPTIONS } = await load()
    const names = FONT_OPTIONS.map((f) => f.name)
    expect(new Set(names).size).toBe(names.length)
    const firstLatin = FONT_OPTIONS.findIndex((f) => f.script === 'latin')
    expect(FONT_OPTIONS.slice(0, firstLatin).every((f) => f.script === 'arabic')).toBe(true)
    expect(FONT_OPTIONS.slice(firstLatin).every((f) => f.script === 'latin')).toBe(true)
    expect(FONT_OPTIONS[0]).toEqual({ name: 'Almarai', label: 'Almarai (الماري)', script: 'arabic' })
  })
})
