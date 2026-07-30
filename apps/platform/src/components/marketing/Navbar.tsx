import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { navbar as T } from '@/locales'
import { LanguageSelect } from '@/components/marketing/LanguageSelect'

export function Navbar() {
  const { t } = useLang()

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/logo/7aba_logo_light.svg"
            alt="7aba"
            className="h-8 w-auto"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = '/assets/logo/7aba_logo_light.png'
            }}
          />
          <span className="text-xl font-black tracking-tight">7aba</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#how" className="text-sm font-bold text-black hover:underline transition-colors">
            {t(T.howItWorks)}
          </a>
          <a href="/#pricing" className="text-sm font-bold text-black hover:underline transition-colors">
            {t(T.pricing)}
          </a>
          <Link to="/demo" className="text-sm font-bold text-black hover:underline transition-colors">
            {t(T.demo)}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <LanguageSelect variant="marketing" />
          <Link
            to="/dashboard" search={{}}
            className={cn(
              'text-sm font-black px-4 py-2 border-2 border-black',
              'bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 transition-colors',
              'shadow-[2px_2px_0px_0px_#000]'
            )}
          >
            {t(T.start)}
          </Link>
        </div>
      </div>
    </header>
  )
}
