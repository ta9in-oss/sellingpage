import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Bell, BellOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NotificationsPanel() {
  const { config, updateNotifications } = useBuilderStore()
  const { enabled, message } = config.notifications

  return (
    <div className="space-y-5 p-4" dir="rtl">
      <div className="flex items-center gap-2 pb-1 border-b border-zinc-100">
        <Bell size={14} className="text-zinc-400" />
        <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">الإشعارات</h2>
      </div>

      {/* Enable/disable toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">إشعارات الشراء الحية</p>
          <p className="text-xs text-zinc-400 mt-0.5">تظهر للزوار "شخص اشترى للتو..." لزيادة الثقة</p>
        </div>
        <button
          onClick={() => updateNotifications({ enabled: !enabled })}
          className={cn(
            'relative w-12 h-6 rounded-full border-2 border-black transition-colors shrink-0',
            enabled ? 'bg-yellow-400' : 'bg-zinc-200'
          )}
          aria-label="تفعيل الإشعارات"
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
            <span className="font-medium text-zinc-800">{message || 'شخص طلب للتو!'}</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 mr-7">هذا مثال على ما يراه الزائر</p>
        </div>
      )}

      {/* Message input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">نص الإشعار</label>
        <input
          type="text"
          value={message}
          onChange={(e) => updateNotifications({ message: e.target.value })}
          disabled={!enabled}
          className={cn(
            'w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900',
            !enabled && 'opacity-40 cursor-not-allowed bg-zinc-50'
          )}
          placeholder="شخص طلب للتو! 🔔"
          dir="rtl"
        />
        <p className="text-xs text-zinc-400">يمكنك إضافة اسم المنتج أو رمز تعبيري</p>
      </div>

      {!enabled && (
        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-50 rounded p-2">
          <BellOff size={14} />
          الإشعارات معطّلة — فعّلها لزيادة ثقة الزوار وتحسين معدل التحويل
        </div>
      )}
    </div>
  )
}
