import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'

const STORAGE_KEY = '7aba_cookie_notice'
const ONE_YEAR = 60 * 60 * 24 * 365

const T = {
  message: {
    ar: 'نستخدم ملفات تعريف الارتباط للتحليلات وتشغيل الموقع.',
    fr: 'Nous utilisons des cookies pour les analyses et le fonctionnement du site.',
    en: 'We use cookies for analytics and to run the site.',
  },
  learnMore: { ar: 'اعرف المزيد', fr: 'En savoir plus', en: 'Learn more' },
  accept: { ar: 'حسناً', fr: 'Compris', en: 'Got it' },
}

/**
 * Informational cookie notice. Analytics load regardless (see __root.tsx head scripts);
 * this banner discloses their use and remembers dismissal for a year via a first-party
 * cookie + localStorage. Client-only — reads browser storage after mount to avoid an SSR flash.
 */
export function CookieNotice() {
  const { t, dir } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed =
      localStorage.getItem(STORAGE_KEY) === '1' ||
      document.cookie.includes(`${STORAGE_KEY}=1`)
    if (!dismissed) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    document.cookie = `${STORAGE_KEY}=1; path=/; max-age=${ONE_YEAR}; SameSite=Lax`
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      dir={dir}
      className="fixed bottom-0 inset-x-0 z-[60] bg-black text-white border-t-2 border-yellow-400 px-4 py-3"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-zinc-300 text-center sm:text-start">
          {t(T.message)}{' '}
          <Link to="/privacy" className="text-yellow-400 font-bold underline hover:text-yellow-300">
            {t(T.learnMore)}
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 px-4 py-2 bg-yellow-400 text-black font-black text-xs border-2 border-yellow-400 hover:bg-black hover:text-yellow-400 transition-colors"
        >
          {t(T.accept)}
        </button>
      </div>
    </div>
  )
}
