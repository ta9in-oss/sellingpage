import { Globe, ChevronDown } from 'lucide-react'
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
      ? 'text-xs font-bold px-2.5 py-1.5 border-2 border-black bg-white text-black hover:bg-yellow-400'
      : 'text-xs font-semibold px-2 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Language"
          className={cn('flex items-center gap-1.5 cursor-pointer transition-colors focus:outline-none', trigger, className)}
          dir="ltr"
        >
          <Globe className="h-3.5 w-3.5" />
          {lang.toUpperCase()}
          <ChevronDown className="h-3 w-3 opacity-70" />
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
