import { Star, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { getTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface SocialProofBarProps {
    reviewCount?: number;
    rating?: number;
    className?: string;
}

export function SocialProofBar({
    reviewCount = 300,
    rating = 4.9,
    className,
}: SocialProofBarProps) {
    const theme = getTheme();
    const isDark = theme.mode === 'dark';

    const stats = [
        { icon: Star, label: `${rating}/5 ⭐`, sub: `+${reviewCount} تقييم` },
        { icon: Truck, label: 'توصيل مجاني', sub: 'لكامل الوطن' },
        { icon: CreditCard, label: 'دفع عند الاستلام', sub: 'بلا مخاطرة' },
        { icon: RotateCcw, label: 'إرجاع مجاني', sub: '7 أيام ضمان' },
    ];

    return (
        <div
            className={cn('py-4 px-6', className)}
            style={isDark ? {
                backgroundColor: '#050505',
                borderBottom: `1px solid ${theme.colors.border}`,
            } : {
                backgroundColor: '#000',
                color: '#fff',
            }}
        >
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-x-reverse"
                    style={{ '--tw-divide-opacity': '0.2' } as React.CSSProperties}
                >
                    {stats.map(({ icon: Icon, label, sub }, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-center py-2 px-4 text-center gap-1"
                        >
                            <div className="flex items-center gap-2">
                                <Icon
                                    className="w-4 h-4 shrink-0"
                                    style={{ color: theme.colors.accent }}
                                    strokeWidth={2.5}
                                />
                                <span
                                    className="font-black text-sm"
                                    style={{ color: isDark ? theme.colors.foreground : '#fff' }}
                                >
                                    {label}
                                </span>
                            </div>
                            <span
                                className="text-xs font-medium"
                                style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                            >
                                {sub}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
