import { useOnlinePresence } from '@/hooks/useOnlinePresence'
import { useLang } from '@/hooks/useLang'

const T = {
  online: { ar: 'يتصفحون الآن', fr: 'en ligne maintenant', en: 'browsing now' },
}

/**
 * Live visitor-count pill — real presence, not a fabricated number. Hidden
 * below 2 since "1 person online" is just the viewer themselves and has no
 * honest signal to show.
 */
export function OnlineIndicator() {
  const count = useOnlinePresence()
  const { t } = useLang()

  if (count < 2) return null

  return (
    <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span>
        {count} {t(T.online)}
      </span>
    </div>
  )
}
