import { useEffect, useState, useCallback } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import type { Theme } from '@7aba/store-ui'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { loadGoogleFont, FONT_OPTIONS } from '@/lib/googleFonts'
import { useLang } from '@/hooks/useLang'

const T = {
  themeSettings: { ar: 'إعدادات القالب', fr: 'Paramètres du thème', en: 'Theme settings' },
  colorsHint: { ar: 'غيّر ألوان متجرك — تُطبَّق مباشرة على المعاينة', fr: 'Changez les couleurs — appliquées en direct', en: 'Change your store colors — applied live to the preview' },
  colors: { ar: 'الألوان', fr: 'Couleurs', en: 'Colors' },
  fonts: { ar: 'الخطوط', fr: 'Polices', en: 'Fonts' },
  bodyFont: { ar: 'خط النص', fr: 'Police du texte', en: 'Body font' },
  headingFont: { ar: 'خط العناوين', fr: 'Police des titres', en: 'Heading font' },
  bodyPreview: { ar: 'معاينة: المنتج الأفضل في السوق', fr: 'Aperçu: Le meilleur produit du marché', en: 'Preview: The best product on the market' },
  headingPreview: { ar: 'معاينة: عنوان رئيسي', fr: 'Aperçu: Titre principal', en: 'Preview: Main heading' },
  borderRadius: { ar: 'استدارة الزوايا', fr: 'Rayon des coins', en: 'Border radius' },
  direction: { ar: 'الاتجاه', fr: 'Direction', en: 'Direction' },
  colorPrimary: { ar: 'الأساسي', fr: 'Primaire', en: 'Primary' },
  colorAccent: { ar: 'التمييز', fr: 'Accent', en: 'Accent' },
  colorBackground: { ar: 'الخلفية', fr: 'Arrière-plan', en: 'Background' },
  colorForeground: { ar: 'النص', fr: 'Texte', en: 'Foreground' },
  colorBorder: { ar: 'الحدود', fr: 'Bordure', en: 'Border' },
  presetBrutalist: { ar: 'خام', fr: 'Brutalist', en: 'Brutalist' },
  presetClean: { ar: 'نظيف', fr: 'Propre', en: 'Clean' },
  presetDark: { ar: 'داكن', fr: 'Sombre', en: 'Dark Pro' },
}

const RADIUS_OPTIONS = ['0px', '4px', '8px', '12px', '9999px']

export function ThemePanel() {
  const { config, updateTheme } = useBuilderStore()
  const { theme } = config
  const { t } = useLang()

  const COLOR_LABELS: Array<{ key: keyof Theme['colors']; label: string }> = [
    { key: 'primary', label: t(T.colorPrimary) },
    { key: 'accent', label: t(T.colorAccent) },
    { key: 'background', label: t(T.colorBackground) },
    { key: 'foreground', label: t(T.colorForeground) },
    { key: 'border', label: t(T.colorBorder) },
  ]

  // Local color state — updates instantly for swatch preview without hitting Zustand
  const [localColors, setLocalColors] = useState(theme.colors)

  // Sync local colors when a preset is applied (theme.name changes)
  useEffect(() => {
    setLocalColors(theme.colors)
  }, [theme.name]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load fonts used by the current theme on mount
  useEffect(() => {
    loadGoogleFont(theme.typography.fontFamily)
    if (theme.typography.headingFont) loadGoogleFont(theme.typography.headingFont)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Only update Zustand (which re-renders the preview) when user releases the picker
  const commitColor = useCallback((key: keyof Theme['colors'], value: string) => {
    updateTheme({ ...theme, colors: { ...theme.colors, [key]: value } })
  }, [theme, updateTheme])

  const updateFont = (field: 'fontFamily' | 'headingFont', fontName: string) => {
    loadGoogleFont(fontName)
    updateTheme({
      ...theme,
      typography: { ...theme.typography, [field]: `${fontName}, sans-serif` },
    })
  }

  const updateRadius = (radius: string) => {
    updateTheme({ ...theme, effects: { ...theme.effects, borderRadius: radius } })
  }

  const updateDirection = (direction: 'rtl' | 'ltr') => {
    updateTheme({ ...theme, direction })
  }

  const currentBodyFont = theme.typography.fontFamily.split(',')[0].trim()
  const currentHeadingFont = (theme.typography.headingFont ?? theme.typography.fontFamily).split(',')[0].trim()

  return (
    <div className="p-4 space-y-5" dir="rtl">
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">{t(T.themeSettings)}</p>
        <p className="text-[11px] text-zinc-400">{t(T.colorsHint)}</p>
      </div>

      {/* Color overrides — real color picker */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">{t(T.colors)}</p>
        <div className="space-y-3">
          {COLOR_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              {/* Native color picker:
                  - onInput: update local swatch only (no Zustand, no preview re-render)
                  - onChange: fires once on release → commit to Zustand → updates preview */}
              <label
                htmlFor={`cp-${key}`}
                className="w-8 h-8 rounded border-2 border-zinc-200 overflow-hidden cursor-pointer shrink-0 hover:border-zinc-400 transition-colors"
                style={{ background: localColors[key] }}
                title={label}
              >
                <input
                  id={`cp-${key}`}
                  type="color"
                  value={localColors[key]}
                  onInput={(e) => {
                    const v = (e.target as HTMLInputElement).value
                    setLocalColors((prev) => ({ ...prev, [key]: v }))
                  }}
                  onChange={(e) => commitColor(key, e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </label>
              <Label className="flex-1 text-sm font-normal">{label}</Label>
              {/* Hex input — commits on Enter / blur */}
              <input
                type="text"
                value={localColors[key]}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                    setLocalColors((prev) => ({ ...prev, [key]: v }))
                  }
                }}
                onBlur={(e) => {
                  if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                    commitColor(key, e.target.value)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && /^#[0-9a-fA-F]{6}$/.test(localColors[key])) {
                    commitColor(key, localColors[key])
                  }
                }}
                className="w-20 h-7 text-xs font-mono border border-zinc-200 rounded px-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                dir="ltr"
                maxLength={7}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Typography — Google Fonts with font preview */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">{t(T.fonts)}</p>
        <div className="space-y-3">
          {/* Body font */}
          <div className="space-y-1">
            <Label className="text-xs">{t(T.bodyFont)}</Label>
            <div className="border border-zinc-200 rounded overflow-hidden">
              <select
                value={currentBodyFont}
                onChange={(e) => updateFont('fontFamily', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                dir="rtl"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-zinc-400 mt-1" style={{ fontFamily: `${currentBodyFont}, sans-serif` }}>
              {t(T.bodyPreview)}
            </p>
          </div>

          {/* Heading font */}
          <div className="space-y-1">
            <Label className="text-xs">{t(T.headingFont)}</Label>
            <div className="border border-zinc-200 rounded overflow-hidden">
              <select
                value={currentHeadingFont}
                onChange={(e) => updateFont('headingFont', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                dir="rtl"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm font-bold text-zinc-700 mt-1" style={{ fontFamily: `${currentHeadingFont}, sans-serif` }}>
              {t(T.headingPreview)}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Border radius */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">{t(T.borderRadius)}</p>
        <div className="flex gap-1">
          {RADIUS_OPTIONS.map((r) => (
            <Button
              key={r}
              variant={theme.effects.borderRadius === r ? 'default' : 'outline'}
              size="sm"
              className="flex-1 px-0 text-xs h-8"
              onClick={() => updateRadius(r)}
            >
              {r === '9999px' ? '●' : r.replace('px', '')}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Direction */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">{t(T.direction)}</p>
        <div className="flex gap-2">
          {(['rtl', 'ltr'] as const).map((dir) => (
            <Button
              key={dir}
              variant={theme.direction === dir ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => updateDirection(dir)}
            >
              {dir === 'rtl' ? 'RTL →' : '← LTR'}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
