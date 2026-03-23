import { useEffect, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

const T = {
  badge: { ar: '⚡ ميزة حصرية', fr: '⚡ Fonctionnalité exclusive' },
  headline: { ar: 'شوف من يشتري منتجك — live', fr: 'Voyez qui achète — en direct' },
  sub: {
    ar: 'كل مرة يطلب حد من متجرك، راح تشوف إشعار فوري على الشاشة. هذه الميزة تخلي الزبائن يحسوا بالحركة في المتجر وترفع من الثقة — ولا أحد في الجزائر يملكها.',
    fr: "À chaque commande, une notification en temps réel apparaît. Ça crée un sentiment d'urgence et de confiance — personne en Algérie ne l'a.",
  },
  features: [
    { ar: 'إشعار فوري لكل طلب', fr: 'Notification instantanée' },
    { ar: 'اسم المدينة + المنتج', fr: 'Ville + produit affiché' },
    { ar: 'يرفع معدل التحويل', fr: 'Booste le taux de conversion' },
    { ar: 'لا أحد في الجزائر عنده هذا', fr: 'Exclusivité Algérie' },
  ],
  newOrder: { ar: 'طلب جديد', fr: 'Nouvelle commande' },
}

const mockNotifications = [
  { name: 'أحمد', city: 'وهران', product: 'صاكادو', time: { ar: 'الآن', fr: 'Maintenant' } },
  { name: 'فاطمة', city: 'قسنطينة', product: 'صاكادو', time: { ar: 'منذ 30ث', fr: 'il y a 30s' } },
  { name: 'يوسف', city: 'الجزائر', product: 'صاكادو', time: { ar: 'منذ 1د', fr: 'il y a 1min' } },
  { name: 'سارة', city: 'عنابة', product: 'صاكادو', time: { ar: 'منذ 2د', fr: 'il y a 2min' } },
]

export function NotificationShowcase() {
  const { t } = useLang()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockNotifications.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const getToast = (offset: number) => {
    const idx = (currentIndex - offset + mockNotifications.length) % mockNotifications.length
    return mockNotifications[idx]
  }

  return (
    <section className="bg-black text-white py-24 px-4 border-y-2 border-black">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit text-xs font-black px-3 py-1 border-2 border-yellow-400 text-yellow-400">
            {t(T.badge)}
          </span>

          <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
            {t(T.headline)}
          </h2>

          <p className="text-white/60 leading-relaxed text-right">
            {t(T.sub)}
          </p>

          <ul className="flex flex-col gap-3 mt-2">
            {T.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-yellow-400 border-2 border-yellow-400 flex items-center justify-center text-black font-black text-xs flex-shrink-0">
                  ✓
                </span>
                <span className="text-white font-medium">{t(feat)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: animated notification stack */}
        <div className="relative flex flex-col items-center justify-center h-64 select-none">
          {/* Stack depth: show 3 toasts */}
          {[2, 1, 0].map((offset) => {
            const toast = getToast(offset)
            const isCurrent = offset === 0

            return (
              <div
                key={`${offset}-${currentIndex}`}
                className={cn(
                  'absolute w-full max-w-sm border-2 border-yellow-400 bg-zinc-900 px-4 py-3',
                  'transition-all duration-500'
                )}
                style={{
                  transform: `translateY(${offset * -10}px) scale(${1 - offset * 0.04})`,
                  opacity: isCurrent ? 1 : 1 - offset * 0.3,
                  zIndex: 10 - offset,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🔔</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-yellow-400 text-black font-black">
                        {t(T.newOrder)}
                      </span>
                      <span className="text-xs text-white/40">{t(toast.time)}</span>
                    </div>
                    <p className="text-white text-sm font-bold">
                      {toast.name} — {toast.city}
                    </p>
                    <p className="text-white/60 text-xs">{toast.product}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
