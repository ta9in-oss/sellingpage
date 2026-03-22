import { useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { presets } from '@7aba/store-ui'
import type { Theme } from '@7aba/store-ui'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

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

const FONT_OPTIONS = [
  'Almarai',
  'Cairo',
  'Tajawal',
  'Noto Sans Arabic',
  'Rubik',
  'Readex Pro',
  'IBM Plex Arabic',
  'Changa',
]

const RADIUS_OPTIONS = ['0px', '4px', '8px', '12px', '9999px']

export function ThemePanel() {
  const { config, updateTheme } = useBuilderStore()
  const { theme } = config
  const [editingColor, setEditingColor] = useState<keyof Theme['colors'] | null>(null)

  const applyPreset = (preset: Theme) => updateTheme(preset)

  const updateColor = (key: keyof Theme['colors'], value: string) => {
    updateTheme({
      ...theme,
      colors: { ...theme.colors, [key]: value },
    })
  }

  const updateFont = (field: 'fontFamily' | 'headingFont', value: string) => {
    updateTheme({
      ...theme,
      typography: { ...theme.typography, [field]: value },
    })
  }

  const updateRadius = (radius: string) => {
    updateTheme({
      ...theme,
      effects: { ...theme.effects, borderRadius: radius },
    })
  }

  const updateDirection = (direction: 'rtl' | 'ltr') => {
    updateTheme({ ...theme, direction })
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide mb-3">
          إعدادات القالب
        </h2>

        {/* Preset cards */}
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={cn(
                'relative flex flex-col items-center gap-1 p-2 rounded border text-xs font-medium transition-colors',
                theme.name === preset.name
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 hover:border-zinc-400'
              )}
            >
              {theme.name === preset.name && (
                <Check size={10} className="absolute top-1 end-1" />
              )}
              <div
                className="w-full h-8 rounded-sm border"
                style={{
                  background: preset.colors.background,
                  borderColor: preset.colors.border,
                }}
              />
              {PRESET_LABELS[preset.name] ?? preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color overrides */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">الألوان</h3>
        <div className="space-y-2">
          {COLOR_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <button
                onClick={() => setEditingColor(editingColor === key ? null : key)}
                className="w-6 h-6 rounded border-2 border-zinc-300 shrink-0"
                style={{ background: theme.colors[key] }}
                aria-label={`تعديل لون ${label}`}
              />
              <span className="text-sm flex-1">{label}</span>
              {editingColor === key && (
                <input
                  type="text"
                  defaultValue={theme.colors[key]}
                  onBlur={(e) => {
                    updateColor(key, e.target.value)
                    setEditingColor(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateColor(key, (e.target as HTMLInputElement).value)
                      setEditingColor(null)
                    }
                  }}
                  className={cn(
                    'w-24 rounded border border-zinc-300 px-2 py-1 text-xs font-mono',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-900'
                  )}
                  dir="ltr"
                  autoFocus
                  aria-label={`قيمة لون ${label}`}
                  id={`color-input-${key}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">الخطوط</h3>
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium">خط النص</label>
            <select
              value={theme.typography.fontFamily.split(',')[0].trim()}
              onChange={(e) => updateFont('fontFamily', `${e.target.value}, sans-serif`)}
              className={cn(
                'w-full rounded border border-zinc-300 px-2 py-1 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900'
              )}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">خط العناوين</label>
            <select
              value={(theme.typography.headingFont ?? theme.typography.fontFamily).split(',')[0].trim()}
              onChange={(e) => updateFont('headingFont', `${e.target.value}, sans-serif`)}
              className={cn(
                'w-full rounded border border-zinc-300 px-2 py-1 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900'
              )}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Border radius */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">
          استدارة الزوايا
        </h3>
        <div className="flex gap-1">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => updateRadius(r)}
              className={cn(
                'flex-1 py-1 text-xs border rounded transition-colors',
                theme.effects.borderRadius === r
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 hover:border-zinc-400'
              )}
            >
              {r === '9999px' ? '●' : r.replace('px', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Direction */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">الاتجاه</h3>
        <div className="flex gap-2">
          {(['rtl', 'ltr'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => updateDirection(dir)}
              className={cn(
                'flex-1 py-1.5 text-sm font-medium rounded border transition-colors',
                theme.direction === dir
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 hover:border-zinc-400'
              )}
            >
              {dir === 'rtl' ? 'RTL →' : '← LTR'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
