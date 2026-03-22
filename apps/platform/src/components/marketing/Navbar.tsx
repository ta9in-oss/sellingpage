import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const T = {
  brand: { ar: '7aba.store', fr: '7aba.store' },
  pricing: { ar: 'الأسعار', fr: 'Tarifs' },
  howItWorks: { ar: 'كيف يعمل؟', fr: 'Comment ça marche?' },
  start: { ar: 'ابدأ الآن', fr: 'Commencer' },
}

export function Navbar() {
  const { lang, toggle, t } = useLang()

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="font-black text-xl tracking-tight text-gray-900">
          {t(T.brand)}
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#how"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t(T.howItWorks)}
          </a>
          <Link
            to="/pricing"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t(T.pricing)}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className={cn(
              'text-xs font-medium px-2.5 py-1.5 rounded-md border border-gray-200',
              'text-gray-600 hover:bg-gray-50 transition-colors'
            )}
            aria-label="Toggle language"
          >
            {lang === 'ar' ? 'FR' : 'عر'}
          </button>
          <Link
            to="/pricing"
            className={cn(
              'text-sm font-semibold px-4 py-2 rounded-lg',
              'bg-orange-500 text-white hover:bg-orange-600 transition-colors'
            )}
          >
            {t(T.start)}
          </Link>
        </div>
      </div>
    </header>
  )
}
