import { useLang } from '@/hooks/useLang'
import type { Lang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

/** Canonical language options — same labels/order everywhere for consistency. */
const LANGS: { code: Lang; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
]

/**
 * Single, consistent language selector used across every marketing surface
 * (landing nav + inner-page navbar). One component = one look + one behavior.
 */
export function LanguageSelect({ className }: { className?: string }) {
  const { lang, setLang } = useLang()
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      aria-label="Language"
      className={cn(
        'text-xs font-bold px-2.5 py-1.5 border-2 border-black bg-white text-black cursor-pointer',
        'hover:bg-yellow-400 transition-colors focus:outline-none',
        className,
      )}
      dir="ltr"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  )
}
