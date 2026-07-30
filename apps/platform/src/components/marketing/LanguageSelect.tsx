import { useLang } from '@/hooks/useLang'
import type { Lang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/** Canonical language options — same labels/order everywhere for consistency. */
const LANGS: { code: Lang; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
]

/**
 * The single language switcher used everywhere — landing nav, inner pages, and
 * the dashboard header. One component = one look + one behavior. `variant`
 * only changes the trigger chrome so it sits well in the brutalist marketing
 * nav vs the app shell; the menu is identical.
 */
export function LanguageSelect({
  className,
  variant = 'app',
}: {
  className?: string
  variant?: 'app' | 'marketing'
}) {
  const { lang, setLang } = useLang()

  const trigger =
    variant === 'marketing'
      ? 'w-9 h-9 border-2 border-black bg-white text-black hover:bg-yellow-400'
      : 'w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Language"
          title="Language / اللغة"
          className={cn('cursor-pointer transition-colors focus:outline-none leading-none flex items-center justify-center', trigger, className)}
          dir="ltr"
        >
          {/* CJK glyph = universal "language" affordance; click opens the menu. */}
          <span className="text-lg font-bold" style={{ fontFamily: '"Noto Sans SC", "Noto Sans JP", sans-serif' }}>文</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGS.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className={lang === l.code ? 'font-semibold' : ''}>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
