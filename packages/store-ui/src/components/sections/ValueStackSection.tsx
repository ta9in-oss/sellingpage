import { Check, ShoppingCart, Package, Truck, RotateCcw, Headphones, Gift, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  package: Package,
  truck: Truck,
  return: RotateCcw,
  support: Headphones,
  gift: Gift,
  shield: Shield,
}

export interface ValueStackItem {
  icon?: string
  title: string
  description: string
  value?: string
  isFree?: boolean
}

interface ValueStackSectionProps {
    price: number;
    ctaText?: string;
    items?: ValueStackItem[];
    onCtaClick?: () => void;
    className?: string;
}

const DEFAULT_ITEMS: ValueStackItem[] = [
  { icon: 'package', title: 'المنتج الأساسي', description: 'منتج عالي الجودة مصنوع من أفضل المواد.', value: '', isFree: false },
  { icon: 'truck', title: 'توصيل مجاني', description: 'يوصلك لعنوانك في كامل الوطن بلا مصاريف زايدة.', value: '500 دج', isFree: true },
  { icon: 'return', title: 'ضمان الإرجاع 7 أيام', description: 'ما عجبكش؟ رجّعها بلا شروط في 7 أيام.', value: '0 دج', isFree: true },
  { icon: 'support', title: 'دعم مباشر', description: 'فريقنا متوفر لمساعدتك. رد سريع مضمون.', value: '0 دج', isFree: true },
]

export function ValueStackSection({ price, ctaText, items, onCtaClick, className }: ValueStackSectionProps) {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';
    const displayItems = items && items.length > 0 ? items : DEFAULT_ITEMS

    const handleCta = () => {
        if (onCtaClick) {
            onCtaClick();
            return;
        }
        const el = document.getElementById('buy');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            className={cn('py-16 px-6', className)}
            style={isDark ? {
                backgroundColor: '#0d0d0d',
                borderTop: `1px solid ${theme.colors.border}`,
            } : {
                backgroundColor: '#f9fafb',
            }}
        >
            <div className="max-w-3xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-10">
                    <h2
                        className="text-3xl md:text-4xl font-black mb-4"
                        style={{ color: theme.colors.foreground }}
                    >
                        واش راح تاخد مقابل{' '}
                        <span style={{ color: theme.colors.accent }}>
                            {price.toLocaleString()} دج؟
                        </span>
                    </h2>
                    <div className="w-20 h-1 mx-auto" style={{ backgroundColor: theme.colors.accent }} />
                </div>

                {/* Value Items */}
                <div className="space-y-4 mb-8">
                    {displayItems.map((item, index) => {
                        const Icon = ICON_MAP[item.icon ?? ''] ?? Package
                        const isMainProduct = index === 0;
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-5 transition-all"
                                style={isDark ? {
                                    backgroundColor: isMainProduct ? `${theme.colors.accent}10` : theme.colors.muted,
                                    border: `1px solid ${isMainProduct ? theme.colors.accent + '40' : theme.colors.border}`,
                                    borderRadius: theme.effects.borderRadius,
                                } : {
                                    backgroundColor: isMainProduct ? '#fffbeb' : '#fff',
                                    border: `2px solid ${isMainProduct ? '#d97706' : '#000'}`,
                                }}
                            >
                                {/* Icon */}
                                <div
                                    className="shrink-0 w-12 h-12 flex items-center justify-center"
                                    style={isDark ? {
                                        backgroundColor: `${theme.colors.accent}20`,
                                        border: `1px solid ${theme.colors.accent}40`,
                                        borderRadius: '8px',
                                    } : {
                                        backgroundColor: isMainProduct ? '#FACC15' : '#f3f4f6',
                                        border: '2px solid #000',
                                    }}
                                >
                                    <Icon
                                        className="w-5 h-5"
                                        style={{ color: isDark ? theme.colors.accent : (isMainProduct ? '#000' : '#374151') }}
                                        strokeWidth={2.5}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-right">
                                    <div className="flex items-start justify-between gap-3 flex-row-reverse">
                                        <h3
                                            className="font-black text-base"
                                            style={{ color: theme.colors.foreground }}
                                        >
                                            {item.title}
                                        </h3>
                                        {item.isFree ? (
                                            <span
                                                className="text-xs font-black px-2 py-1 shrink-0"
                                                style={isDark ? {
                                                    backgroundColor: `${theme.colors.success}20`,
                                                    color: theme.colors.success,
                                                    border: `1px solid ${theme.colors.success}40`,
                                                    borderRadius: '4px',
                                                } : {
                                                    backgroundColor: '#d1fae5',
                                                    color: '#065f46',
                                                    border: '1px solid #6ee7b7',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                مجاني
                                            </span>
                                        ) : (
                                            <span
                                                className="text-sm font-black shrink-0"
                                                style={{ color: theme.colors.accent }}
                                            >
                                                {item.value ?? ''}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className="text-sm mt-1 leading-relaxed"
                                        style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Total Value Row */}
                <div
                    className="p-5 mb-6 flex items-center justify-between flex-row-reverse"
                    style={isDark ? {
                        backgroundColor: '#050505',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.effects.borderRadius,
                    } : {
                        backgroundColor: '#000',
                        color: '#fff',
                    }}
                >
                    <div className="text-right">
                        <p
                            className="text-sm font-bold"
                            style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                        >
                            القيمة الإجمالية
                        </p>
                        <p
                            className="text-2xl font-black line-through opacity-50"
                            style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                        >
                            4000 دج
                        </p>
                    </div>
                    <div className="text-right">
                        <p
                            className="text-sm font-bold"
                            style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                        >
                            سعرك اليوم
                        </p>
                        <p
                            className="text-3xl font-black"
                            style={{ color: theme.colors.accent }}
                        >
                            {price.toLocaleString()} دج
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={handleCta}
                    className="w-full flex items-center justify-center gap-3 py-5 text-xl font-black transition-all duration-200 hover:scale-[1.02]"
                    style={isDark ? {
                        backgroundColor: theme.colors.accent,
                        color: '#000',
                        borderRadius: theme.effects.borderRadius,
                        boxShadow: `0 8px 32px ${theme.colors.accent}40`,
                    } : {
                        backgroundColor: '#FACC15',
                        color: '#000',
                        border: '2px solid #000',
                        boxShadow: '4px 4px 0px 0px #000',
                    }}
                >
                    <ShoppingCart className="w-6 h-6" strokeWidth={3} />
                    {ctaText || 'اطلب الآن'}
                </button>

                {/* Trust micro-copy */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" style={{ color: theme.colors.success }} />
                    <p
                        className="text-sm font-medium"
                        style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                    >
                        دفع عند الاستلام · توصيل مجاني · إرجاع بلا مصاريف
                    </p>
                </div>
            </div>
        </section>
    );
}
