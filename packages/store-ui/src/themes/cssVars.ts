import type { Theme } from './theme.types'

/**
 * Maps the merchant's Theme (edited in the builder) onto the shadcn CSS variable
 * names the store's app.css + shadcn components already consume (`bg-primary`,
 * `text-foreground`, `border-border`, …). Injected as a `:root { … }` block in
 * the store <head> so shadcn components AND the sections read one source of
 * truth — the merchant's theme — instead of the static defaults in app.css.
 *
 * Colours are emitted as-is (hex is a valid CSS colour; it overrides the oklch
 * defaults fine). Foreground pairings use the theme's own colours so contrast
 * stays whatever the preset intends.
 */
/**
 * `--radius` drives Tailwind's whole rounded-* scale, so an oversized value (an
 * old "pill" 9999px setting) turns cards and carousels into blobs. Clamp it to a
 * sane card radius; per-element pills use their own class.
 */
const MAX_RADIUS_PX = 24
function safeRadius(value: string | undefined): string {
  const raw = (value ?? '0px').trim()
  const px = /^(\d+(?:\.\d+)?)px$/.exec(raw)
  if (px) return `${Math.min(parseFloat(px[1]), MAX_RADIUS_PX)}px`
  const rem = /^(\d+(?:\.\d+)?)rem$/.exec(raw)
  if (rem) return `${Math.min(parseFloat(rem[1]) * 16, MAX_RADIUS_PX)}px`
  return raw
}

export function themeToCssVars(theme: Theme): string {
  const c = theme.colors
  const radius = safeRadius(theme.effects?.borderRadius)
  const font = theme.typography?.fontFamily ?? 'inherit'
  const vars: Record<string, string> = {
    '--background': c.background,
    '--foreground': c.foreground,
    '--card': c.background,
    '--card-foreground': c.foreground,
    '--popover': c.background,
    '--popover-foreground': c.foreground,
    '--primary': c.primary,
    '--primary-foreground': c.background,
    '--secondary': c.secondary,
    '--secondary-foreground': c.foreground,
    '--muted': c.muted,
    '--muted-foreground': c.foreground,
    '--accent': c.accent,
    '--accent-foreground': c.foreground,
    '--destructive': c.error,
    '--destructive-foreground': '#ffffff',
    '--border': c.border,
    '--input': c.border,
    '--ring': c.primary,
    '--radius': radius,
    '--font-sans': font,
  }
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ')
}

/** Full `<style>`-ready block, including a `.dark` mirror when the theme is dark. */
export function themeToRootCss(theme: Theme): string {
  const body = themeToCssVars(theme)
  const root = `:root { ${body} }`
  // Dark presets also drive `.dark` so shadcn's dark utilities match.
  return theme.mode === 'dark' ? `${root}\n.dark { ${body} }` : root
}
