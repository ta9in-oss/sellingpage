import { useEffect, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { ShoppingBag, MapPin, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { notificationShowcase as locale } from '@/locales'

export function NotificationShowcase() {
  const { t } = useLang()
  const [visibleIndex, setVisibleIndex] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const cycle = setInterval(() => {
      // Fade out
      setShow(false)
      setTimeout(() => {
        setVisibleIndex((prev) => (prev + 1) % locale.mockNotifications.length)
        setShow(true)
      }, 400)
    }, 3000)
    return () => clearInterval(cycle)
  }, [])

  const notif = locale.mockNotifications[visibleIndex]

  return (
    <section className="bg-black text-white py-24 px-4 border-y-2 border-black">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left: copy */}
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit text-xs font-black px-3 py-1 border-2 border-yellow-400 text-yellow-400">
            {t(locale.badge)}
          </span>

          <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
            {t(locale.headline)}
          </h2>

          <p className="text-white/60 leading-relaxed text-start text-sm">
            {t(locale.sub)}
          </p>

          <ul className="flex flex-col gap-3 mt-2">
            {locale.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-yellow-400 flex items-center justify-center text-black font-black text-xs flex-shrink-0">
                  ✓
                </span>
                <span className="text-white/80 text-sm">{t(feat)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: mini store mockup with bottom-left popup */}
        <div className="flex flex-col gap-3">
          <p className="text-center text-xs text-white/40 font-bold">{t(locale.visitorSees)}</p>

          {/* Browser frame */}
          <div className="border-2 border-zinc-700 overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-zinc-800 px-3 py-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
              <span className="flex-1 mx-3 bg-zinc-700 text-zinc-400 text-xs px-2 py-0.5 text-center font-mono truncate">
                متجرك.7aba.store
              </span>
            </div>

            {/* Store page mockup */}
            <div className="relative bg-white overflow-hidden" style={{ height: '280px' }}>
              {/* Simplified store content (static background) */}
              <div className="p-4 flex gap-4" dir="rtl">
                <img
                  src="/bagpack_001.png"
                  alt=""
                  className="w-28 h-28 object-cover border-2 border-black flex-shrink-0"
                />
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="w-32 h-3 bg-black rounded-none" />
                  <div className="w-24 h-2.5 bg-zinc-300 rounded-none" />
                  <div className="w-20 h-2 bg-zinc-200 rounded-none" />
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-base font-black text-black">2500</span>
                    <span className="text-xs text-black/60">دج</span>
                  </div>
                  <div className="mt-1 px-4 py-1.5 bg-black text-white text-xs font-black w-fit">
                    اشتر الآن
                  </div>
                </div>
              </div>

              {/* The social proof FOMO notification — bottom left, like WiserNotify */}
              <div
                className={cn(
                  'absolute bottom-3 left-3 w-64',
                  'transition-all duration-400',
                  show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                )}
                dir="rtl"
              >
                <div
                  className={cn(
                    notif.bg,
                    'text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-3'
                  )}
                >
                  <div className="flex items-start gap-2">
                    {notif.type === 'live' ? (
                      <Zap size={14} className="text-yellow-300 mt-0.5 flex-shrink-0" />
                    ) : (
                      <MapPin size={14} className="text-yellow-300 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-black flex items-center gap-1">
                        <ShoppingBag size={10} className="flex-shrink-0" />
                        {t(notif.text)}
                      </span>
                      <span className="text-xs font-bold leading-tight">{t(notif.desc)}</span>
                      <span className="text-xs opacity-80">{t(notif.sub)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
