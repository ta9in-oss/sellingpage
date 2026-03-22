import { useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { presets } from '@7aba/store-ui'
import type { Theme } from '@7aba/store-ui'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

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
    <div className="p-4 space-y-5">
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

      <Separator />

      {/* Color overrides */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">الألوان</p>
        <div className="space-y-2">
          {COLOR_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <button
                onClick={() => setEditingColor(editingColor === key ? null : key)}
                className="w-6 h-6 rounded border-2 border-zinc-300 shrink-0 transition-transform hover:scale-110"
                style={{ background: theme.colors[key] }}
                aria-label={`تعديل لون ${label}`}
              />
              <Label className="flex-1 text-sm font-normal">{label}</Label>
              {editingColor === key && (
                <Input
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
                  className="w-24 h-7 text-xs font-mono"
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

      <Separator />

      {/* Typography */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">الخطوط</p>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">خط النص</Label>
            <Select
              value={theme.typography.fontFamily.split(',')[0].trim()}
              onValueChange={(v) => updateFont('fontFamily', `${v}, sans-serif`)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f} className="text-sm">
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">خط العناوين</Label>
            <Select
              value={(theme.typography.headingFont ?? theme.typography.fontFamily).split(',')[0].trim()}
              onValueChange={(v) => updateFont('headingFont', `${v}, sans-serif`)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f} className="text-sm">
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
