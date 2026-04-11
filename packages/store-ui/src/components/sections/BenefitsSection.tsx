import { CheckCircle, Star, Zap, Heart, Shield, TrendingUp } from 'lucide-react';
import type { Benefit } from '../../types/content.types';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface BenefitsSectionProps {
    benefits: Benefit[];
    title?: string;
    subtitle?: string;
    className?: string;
}

const iconMap = { check: CheckCircle, star: Star, zap: Zap, heart: Heart, shield: Shield, trend: TrendingUp };

export function BenefitsSection({ benefits, title = 'فوائد المنتج', subtitle, className }: BenefitsSectionProps) {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';
    const isClean = theme.name === 'clean';

    if (!benefits || benefits.length === 0) return null;

    // ── Acquisition (dark) ─────────────────────────────────────────────────
    if (isDark) {
        return (
            <section className={cn('py-16', className)} style={{ backgroundColor: '#0d0d0d', borderTop: `1px solid ${theme.colors.border}` }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: theme.colors.foreground }}>{title}</h2>
                        <div className="w-24 h-1 mx-auto" style={{ backgroundColor: theme.colors.accent }} />
                        <p className="mt-6 text-lg font-bold" style={{ color: '#9ca3af' }}>{subtitle ?? 'ليش راح تحب الصاكادو؟'}</p>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-4">
                        {benefits.map((benefit, index) => {
                            const IconComponent = iconMap[benefit.icon as keyof typeof iconMap] || CheckCircle;
                            return (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-6 transition-all duration-200 hover:-translate-y-1"
                                    style={{ backgroundColor: theme.colors.muted, border: `1px solid ${theme.colors.border}`, borderRadius: theme.effects.borderRadius }}
                                >
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${theme.colors.accent}20`, border: `1px solid ${theme.colors.accent}40`, borderRadius: '8px' }}>
                                            <IconComponent className="w-6 h-6" style={{ color: theme.colors.accent }} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h3 className="text-xl font-black mb-2" style={{ color: theme.colors.foreground }}>{benefit.title}</h3>
                                        <p className="text-base leading-relaxed font-medium" style={{ color: '#9ca3af' }}>{benefit.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    // ── Clean ──────────────────────────────────────────────────────────────
    if (isClean) {
        return (
            <section className={cn('py-16 px-6 bg-white', className)}>
                <div className="max-w-6xl mx-auto">
                    {subtitle && <p className="text-lg font-semibold text-center text-slate-500 mb-4">{subtitle}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:shadow-md transition-all duration-200">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${theme.colors.accent}15` }}>
                                    <span className="text-xl">{benefit.icon}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // ── Brutalist ──────────────────────────────────────────────────────────
    return (
        <section className={cn('py-16 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400', className)}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">{title}</h2>
                    <div className="w-24 h-2 bg-black mx-auto transform rotate-1"></div>
                    <p className="mt-6 text-lg text-black font-bold">{subtitle ?? 'ليش راح تحب الصاكادو؟'}</p>
                </div>
                <div className="max-w-4xl mx-auto space-y-4">
                    {benefits.map((benefit, index) => {
                        const IconComponent = iconMap[benefit.icon as keyof typeof iconMap] || CheckCircle;
                        return (
                            <div key={index} className="bg-white border-2 border-black p-6 flex items-start gap-4 shadow-brutal hover:shadow-brutal-lg transition-all duration-200 transform hover:-translate-y-1">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 bg-black flex items-center justify-center transform rotate-3">
                                        <IconComponent className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="flex-1 text-right">
                                    <h3 className="text-xl font-black mb-2 text-black">{benefit.title}</h3>
                                    <p className="text-base text-gray-700 leading-relaxed font-medium">{benefit.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-12 text-center">
                    <p className="text-2xl font-black text-black">وبزاف فوائد أخرين! 🎉</p>
                </div>
            </div>
        </section>
    );
}
