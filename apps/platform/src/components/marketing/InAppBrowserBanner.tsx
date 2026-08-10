import { useEffect, useState } from 'react'
import { detectInAppBrowser, isAndroid, androidChromeIntentUrl } from '@/lib/inAppBrowser'
import { useLang } from '@/hooks/useLang'
import { trackGtag, trackClarity } from '@/lib/track'

const T = {
  message: {
    ar: 'أنت داخل تطبيق فيسبوك/إنستغرام. لتسجيل دخول أسهل، افتح الموقع في المتصفح.',
    fr: 'Vous êtes dans l’appli Facebook/Instagram. Pour une connexion plus simple, ouvrez le site dans votre navigateur.',
    en: 'You’re inside the Facebook/Instagram app. For easier sign-in, open the site in your browser.',
  },
  openChrome: { ar: 'افتح في Chrome', fr: 'Ouvrir dans Chrome', en: 'Open in Chrome' },
  iosHint: {
    ar: 'اضغط ⋯ أعلى الشاشة ثم "فتح في المتصفح"',
    fr: 'Appuyez sur ⋯ en haut de l’écran puis « Ouvrir dans le navigateur »',
    en: 'Tap ⋯ at the top of the screen, then "Open in browser"',
  },
  dismiss: { ar: 'إغلاق', fr: 'Fermer', en: 'Dismiss' },
}

/** See lib/inAppBrowser.ts for why this exists instead of a Meta ad setting. */
export function InAppBrowserBanner() {
  const { t, dir } = useLang()
  const [browser, setBrowser] = useState<'facebook' | 'instagram' | null>(null)
  const [android, setAndroid] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    const detected = detectInAppBrowser(ua)
    if (detected) {
      setBrowser(detected)
      setAndroid(isAndroid(ua))
      trackGtag('in_app_browser_detected')
      trackClarity(`in_app_browser_${detected}`)
    }
  }, [])

  if (!browser || dismissed) return null

  return (
    // Static, not fixed — it sits first in the DOM (before Outlet in
    // __root.tsx) and must actually push the page's sticky navbar down, not
    // float on top of it. A fixed overlay left the navbar (which is `position:
    // sticky` and rendered later in the tree) painting over the banner at the
    // top of the page until the user scrolled.
    <div className="relative z-[60] bg-black text-white border-b-2 border-yellow-400 px-4 py-3" dir={dir}>
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-zinc-200 text-center sm:text-start">
          {t(T.message)}
          {!android && <span className="block text-xs text-zinc-400 mt-1">{t(T.iosHint)}</span>}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          {android && (
            <a
              href={androidChromeIntentUrl(window.location.href)}
              onClick={() => {
                trackGtag('in_app_browser_open_chrome_click')
                trackClarity('in_app_browser_open_chrome_click')
              }}
              className="px-4 py-2 bg-yellow-400 text-black font-black text-xs whitespace-nowrap"
            >
              {t(T.openChrome)}
            </a>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-xs text-zinc-400 hover:text-white underline whitespace-nowrap"
          >
            {t(T.dismiss)}
          </button>
        </div>
      </div>
    </div>
  )
}
