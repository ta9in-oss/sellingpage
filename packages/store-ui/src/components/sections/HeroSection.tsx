import { ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useTheme } from '../../context/ThemeContext';
import type { HeroContent } from '../../types/content.types';

interface HeroSectionProps {
    content: HeroContent;
    onCtaClick?: () => void;
}

export function HeroSection({ content, onCtaClick }: HeroSectionProps) {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';

    // ── Brutalist ──────────────────────────────────────────────────────────
    if (!isDark) {
        return (
            <section className="bg-white py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 order-2 lg:order-1">
                            <h1 className="text-4xl lg:text-5xl font-black leading-tight text-right">
                                {content.title.map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        {i < content.title.length - 1 && <br />}
                                    </span>
                                ))}
                            </h1>

                            <div
                                className="p-4 sm:p-6 border-2 transform -rotate-1"
                                style={{ backgroundColor: theme.colors.primary, color: theme.colors.secondary, borderColor: theme.colors.border }}
                            >
                                <p className="text-base sm:text-lg md:text-l font-bold text-right leading-relaxed">
                                    {content.description}
                                </p>
                            </div>

                            <Button
                                className="bg-yellow-400 text-black px-8 py-4 border-2 border-black rounded-none font-black text-lg hover:bg-yellow-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000]"
                                onClick={onCtaClick}
                            >
                                <ShoppingBag className="ml-2" size={20} />
                                {content.ctaText} - {content.priceTag.amount} {content.priceTag.currency}
                            </Button>
                        </div>

                        <div className="relative order-1 lg:order-2 flex justify-center">
                            <div className="relative max-w-md">
                                {content.image && (
                                    <picture>
                                        <source srcSet={content.image.replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
                                        <img src={content.image} alt="Product" className="w-full h-auto transform rotate-3" fetchPriority="high" width="960" height="1280" decoding="async" />
                                    </picture>
                                )}

                                <div className="absolute top-8 sm:top-12 left-8 sm:left-12 transform -rotate-12 z-10">
                                    <div className="bg-yellow-400 border-4 border-black px-6 py-4 mb-2 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all">
                                        <span className="font-black text-2xl sm:text-3xl">{content.priceTag.amount} {content.priceTag.currency}</span>
                                    </div>
                                    {content.freeDelivery && (
                                        <div className="bg-green-400 border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all">
                                            <span className="font-black text-lg sm:text-xl">التوصيل باطل</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ── Acquisition (dark) ─────────────────────────────────────────────────
    return (
        <section className="py-16 px-6" style={{ backgroundColor: theme.colors.background }}>
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                            style={{ backgroundColor: `${theme.colors.accent}20`, color: theme.colors.accent, border: `1px solid ${theme.colors.accent}40` }}
                        >
                            <span>🔥</span>
                            <span>العرض محدود — اطلب اليوم</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black leading-tight text-right" style={{ color: theme.colors.foreground }}>
                            {content.title.map((line, i) => (
                                <span key={i}>
                                    {i === content.title.length - 1
                                        ? <span style={{ color: theme.colors.accent }}>{line}</span>
                                        : line}
                                    {i < content.title.length - 1 && <br />}
                                </span>
                            ))}
                        </h1>

                        <div
                            className="p-4 sm:p-6"
                            style={{
                                backgroundColor: theme.colors.muted,
                                color: '#d1d5db',
                                borderRadius: theme.effects.borderRadius,
                                border: `1px solid ${theme.colors.border}`,
                                borderRight: `3px solid ${theme.colors.accent}`,
                            }}
                        >
                            <p className="text-base sm:text-lg font-bold text-right leading-relaxed">{content.description}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <Button
                                className="font-black text-lg px-8 py-4 transition-all duration-200"
                                style={{
                                    backgroundColor: theme.colors.accent,
                                    color: '#000',
                                    borderRadius: theme.effects.borderRadius,
                                    border: 'none',
                                    boxShadow: `0 4px 16px ${theme.colors.accent}40`,
                                }}
                                onClick={onCtaClick}
                            >
                                <ShoppingBag className="ml-2" size={20} />
                                {content.ctaText} — {content.priceTag.amount} {content.priceTag.currency}
                            </Button>
                            {content.freeDelivery && (
                                <span className="text-sm font-semibold pt-3" style={{ color: theme.colors.success }}>✓ التوصيل مجاني</span>
                            )}
                        </div>
                    </div>

                    <div className="relative order-1 lg:order-2 flex justify-center">
                        <div className="relative max-w-md">
                            <div className="absolute inset-0 rounded-2xl blur-3xl opacity-20 -z-10" style={{ backgroundColor: theme.colors.accent }} />
                            {content.image && (
                                <picture>
                                    <source srcSet={content.image.replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
                                    <img src={content.image} alt="Product" className="w-full h-auto rounded-2xl" fetchPriority="high" width="960" height="1280" decoding="async" />
                                </picture>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
