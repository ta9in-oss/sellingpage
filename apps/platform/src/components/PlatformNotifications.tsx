import { useEffect } from 'react'
import { usePlatformFomo } from '@/hooks/usePlatformFomo'

const PLAN_COLORS: Record<string, string> = {
    Starter: '#FACC15',
    Pro: '#0EA5E9',
    Agency: '#8B5CF6',
}

interface PlatformNotificationsProps {
    /** Pass the current user tier — if subscribed (non-empty / non-free), notifications are hidden */
    userTier?: string | null
}

export function PlatformNotifications({ userTier }: PlatformNotificationsProps) {
    const { current, visible } = usePlatformFomo()

    // Don't show if user already has a paid plan
    const isPaid = userTier && userTier !== 'free'
    if (isPaid) return null
    if (!current) return null

    const accentColor = PLAN_COLORS[current.plan] ?? '#FACC15'

    return (
        <div
            className="fixed bottom-6 left-6 z-50 max-w-xs transition-all duration-500"
            style={{
                transform: visible ? 'translateY(0)' : 'translateY(120%)',
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div className="bg-zinc-900 text-white rounded-2xl border border-zinc-700 shadow-2xl p-4 flex items-start gap-3">
                {/* Avatar */}
                <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-sm"
                    style={{ backgroundColor: accentColor, color: '#000' }}
                >
                    {current.name.charAt(0)}
                </div>

                {/* Content */}
                <div className="min-w-0" dir="rtl">
                    <p className="text-sm font-bold leading-tight">
                        {current.name} من {current.city}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        اشترى باقة{' '}
                        <span className="font-bold" style={{ color: accentColor }}>
                            {current.planAr}
                        </span>
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{current.timeAgo}</p>
                </div>

                {/* Live badge */}
                <div className="shrink-0 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-zinc-500">الآن</span>
                </div>
            </div>
        </div>
    )
}
