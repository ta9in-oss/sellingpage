import { useEffect } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { presets } from '@7aba/store-ui'
import type { Theme } from '@7aba/store-ui'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { loadGoogleFont, FONT_OPTIONS } from '@/lib/googleFonts'

const PRESET_LABELS: Record<string, string> = {
  brutalist: 'بسيط',
  acquisition: 'جريء',
  warm: 'دافئ',
}

const COLOR_LABELS: Array<{ key: keyof Theme['colors']; label: string }> = [
  { key: 'primary', label: 'الأساسي' },
  { key: 'accent', label: 'التمييز' },
  { key: 'background', label: 'الخلفية' },
  { key: 'foreground', label: 'النص' },
  { key: 'border', label: 'الحدود' },
]

const RADIUS_OPTIONS = ['0px', '4px', '8px', '12px', '9999px']

export function ThemePanel() {
  const { config, updateTheme } = useBuilderStore()
  const { theme } = config

  // Load fonts used by the current theme on mount
  useEffect(() => {
    loadGoogleFont(theme.typography.fontFamily)
    if (theme.typography.headingFont) loadGoogleFont(theme.typography.headingFont)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const applyPreset = (preset: Theme) => {
    updateTheme(preset)
    loadGoogleFont(preset.typography.fontFamily)
    if (preset.typography.headingFont) loadGoogleFont(preset.typography.headingFont)
  }

  const updateColor = (key: keyof Theme['colors'], value: string) => {
    updateTheme({ ...theme, colors: { ...theme.colors, [key]: value } })
  }

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
      {/* Preset cards */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">إعدادات القالب</p>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={cn(
                'relative flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-medium transition-colors',
                theme.name === preset.name
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 hover:border-zinc-400 text-zinc-700'
              )}
            >
              {theme.name === preset.name && (
                <Check size={10} className="absolute top-1 end-1" />
              )}
              <div
                className="w-full h-8 rounded border"
                style={{ background: preset.colors.background, borderColor: preset.colors.border }}
              />
              {PRESET_LABELS[preset.name] ?? preset.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Color overrides — real color picker */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">الألوان</p>
        <div className="space-y-3">
          {COLOR_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              {/* Native color picker — opens browser color wheel on click */}
              <label
                htmlFor={`cp-${key}`}
                className="w-8 h-8 rounded border-2 border-zinc-200 overflow-hidden cursor-pointer shrink-0 hover:border-zinc-400 transition-colors"
                style={{ background: theme.colors[key] }}
                title={label}
              >
                <input
                  id={`cp-${key}`}
                  type="color"
                  value={theme.colors[key]}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </label>
              <Label className="flex-1 text-sm font-normal">{label}</Label>
              {/* Hex input — live edit */}
              <input
                type="text"
                value={theme.colors[key]}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) updateColor(key, v)
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
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">الخطوط</p>
        <div className="space-y-3">
          {/* Body font */}
          <div className="space-y-1">
            <Label className="text-xs">خط النص</Label>
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
              معاينة: المنتج الأفضل في السوق
            </p>
          </div>

          {/* Heading font */}
          <div className="space-y-1">
            <Label className="text-xs">خط العناوين</Label>
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
              معاينة: عنوان رئيسي
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Border radius */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">استدارة الزوايا</p>
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
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">الاتجاه</p>
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
