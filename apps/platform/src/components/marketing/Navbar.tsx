import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const T = {
  pricing: { ar: 'الأسعار', fr: 'Tarifs' },
  howItWorks: { ar: 'كيف يعمل؟', fr: 'Comment ça marche?' },
  demo: { ar: 'عرض تجريبي', fr: 'Démo' },
  start: { ar: 'ابدأ الآن', fr: 'Commencer' },
}

export function Navbar() {
  const { lang, toggle, t } = useLang()

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/logo/7aba_store_logo_i1.svg"
            alt="7aba.store"
            className="h-8 w-auto"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = '/assets/logo/7aba_store_logo_i1.png'
            }}
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#how" className="text-sm font-bold text-black hover:underline transition-colors">
            {t(T.howItWorks)}
          </a>
          <Link to="/pricing" className="text-sm font-bold text-black hover:underline transition-colors">
            {t(T.pricing)}
          </Link>
          <Link to="/demo" className="text-sm font-bold text-black hover:underline transition-colors">
            {t(T.demo)}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="text-xs font-bold px-2.5 py-1.5 border-2 border-black bg-white hover:bg-yellow-400 transition-colors"
            aria-label="Toggle language"
          >
            {lang === 'ar' ? 'FR' : 'عر'}
          </button>
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
