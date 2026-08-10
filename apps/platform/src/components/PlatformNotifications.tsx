import { usePlatformFomo } from '@/hooks/usePlatformFomo'
import { useLang } from '@/hooks/useLang'
import { useIsPaidUser } from '@/hooks/useIsPaidUser'
import { merchantsAr } from '@/lib/arabicPlural'

const T = {
  anonymous: { ar: 'مشترك جديد', fr: 'Nouvel abonné', en: 'New subscriber' },
  subscribed: { ar: 'اشترك في باقة', fr: "s'est abonné au forfait", en: 'subscribed to the' },
  tierTotal: { ar: 'مشتركاً في باقة', fr: 'abonnés au forfait', en: 'subscribers on the' },
  grandTotalFr: (n: number) => `${n} commerçant${n > 1 ? 's' : ''} inscrit${n > 1 ? 's' : ''} sur 7aba`,
  grandTotalEn: (n: number) => `${n} merchant${n > 1 ? 's' : ''} have joined 7aba`,
  live: { ar: 'الآن', fr: 'maintenant', en: 'live' },
}

/**
 * Real subscriber toast — see usePlatformFomo for why this only shows actual
 * `platformUsers` rows, never invented names or cities. Mounted globally in
 * __root.tsx, so it must check paid status itself rather than take it as a
 * prop nobody was actually passing.
 */
export function PlatformNotifications() {
  const { current, visible, timeAgo } = usePlatformFomo()
  const { t, dir, lang } = useLang()
  const isPaid = useIsPaidUser()

  if (isPaid) return null
  if (!current) return null

  const avatarChar = current.kind === 'individual' ? (current.name ?? t(T.anonymous)).charAt(0) : String(current.count)[0]

  return (
    <div
      className="fixed bottom-6 left-6 z-40 max-w-xs transition-all duration-500"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(120%)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="bg-zinc-900 text-white rounded-2xl border border-zinc-700 shadow-2xl p-4 flex items-start gap-3" dir={dir}>
        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-sm bg-yellow-400 text-black">
          {avatarChar}
        </div>

        <div className="min-w-0">
          {current.kind === 'individual' && (
            <>
              <p className="text-sm font-bold leading-tight">{current.name ?? t(T.anonymous)}</p>
              <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                {t(T.subscribed)} <span className="font-bold text-yellow-400">{t(current.plan)}</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1">{timeAgo ? t(timeAgo) : ''}</p>
            </>
          )}

          {current.kind === 'tierTotal' && (
            <p className="text-sm font-bold leading-snug">
              <span className="text-yellow-400">{current.count}</span> {t(T.tierTotal)}{' '}
              <span className="font-bold text-yellow-400">{t(current.plan)}</span>
            </p>
          )}

          {current.kind === 'grandTotal' && (
            <p className="text-sm font-bold leading-snug text-yellow-400">
              {lang === 'ar' ? merchantsAr(current.count) : lang === 'fr' ? T.grandTotalFr(current.count) : T.grandTotalEn(current.count)}
            </p>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-500">{t(T.live)}</span>
        </div>
      </div>
    </div>
  )
}
