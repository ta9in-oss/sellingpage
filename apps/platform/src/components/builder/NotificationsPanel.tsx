import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Bell, BellOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'

const T = {
  notifications: { ar: 'الإشعارات', fr: 'Notifications', en: 'Notifications' },
  liveNotifications: { ar: 'إشعارات الشراء الحية', fr: 'Notifications d\'achat en direct', en: 'Live purchase notifications' },
  liveNotificationsHint: { ar: 'تظهر للزوار "شخص اشترى للتو..." لزيادة الثقة', fr: 'Affiche aux visiteurs "Quelqu\'un vient d\'acheter..." pour renforcer la confiance', en: 'Shows visitors "Someone just bought..." to boost trust' },
  toggleAriaLabel: { ar: 'تفعيل الإشعارات', fr: 'Activer les notifications', en: 'Toggle notifications' },
  previewHint: { ar: 'هذا مثال على ما يراه الزائر', fr: 'C\'est un exemple de ce que voit le visiteur', en: 'This is an example of what the visitor sees' },
  notificationText: { ar: 'نص الإشعار', fr: 'Texte de la notification', en: 'Notification text' },
  notificationPlaceholder: { ar: 'شخص طلب للتو! 🔔', fr: 'Quelqu\'un vient de commander ! 🔔', en: 'Someone just ordered! 🔔' },
  notificationDefaultMsg: { ar: 'شخص طلب للتو!', fr: 'Quelqu\'un vient de commander !', en: 'Someone just ordered!' },
  notificationHint: { ar: 'يمكنك إضافة اسم المنتج أو رمز تعبيري', fr: 'Vous pouvez ajouter le nom du produit ou un emoji', en: 'You can add the product name or an emoji' },
  disabledHint: { ar: 'الإشعارات معطّلة — فعّلها لزيادة ثقة الزوار وتحسين معدل التحويل', fr: 'Notifications désactivées — activez-les pour renforcer la confiance et améliorer la conversion', en: 'Notifications disabled — enable them to boost visitor trust and conversion rate' },
}

export function NotificationsPanel() {
  const { config, updateNotifications } = useBuilderStore()
  const { t } = useLang()
  const { enabled, message } = config.notifications

  return (
    <div className="space-y-5 p-4" dir="rtl">
      <div className="flex items-center gap-2 pb-1 border-b border-zinc-100">
        <Bell size={14} className="text-zinc-400" />
        <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.notifications)}</h2>
      </div>

      {/* Enable/disable toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{t(T.liveNotifications)}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{t(T.liveNotificationsHint)}</p>
        </div>
        <button
          onClick={() => updateNotifications({ enabled: !enabled })}
          className={cn(
            'relative w-12 h-6 rounded-full border-2 border-black transition-colors shrink-0',
            enabled ? 'bg-yellow-400' : 'bg-zinc-200'
          )}
          aria-label={t(T.toggleAriaLabel)}
        >
          <span
            className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all',
              enabled ? 'right-0.5' : 'left-0.5'
            )}
          />
        </button>
      </div>

      {/* Notification preview */}
      {enabled && (
        <div className="rounded border-2 border-black bg-white p-3 shadow-[3px_3px_0px_#000] text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <span className="font-medium text-zinc-800">{message || t(T.notificationDefaultMsg)}</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 mr-7">{t(T.previewHint)}</p>
        </div>
      )}

      {/* Message input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.notificationText)}</label>
        <input
          type="text"
          value={message}
          onChange={(e) => updateNotifications({ message: e.target.value })}
          disabled={!enabled}
          className={cn(
            'w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900',
            !enabled && 'opacity-40 cursor-not-allowed bg-zinc-50'
          )}
          placeholder={t(T.notificationPlaceholder)}
          dir="rtl"
        />
        <p className="text-xs text-zinc-400">{t(T.notificationHint)}</p>
      </div>

      {!enabled && (
        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-50 rounded p-2">
          <BellOff size={14} />
          {t(T.disabledHint)}
        </div>
      )}
    </div>
  )
}
