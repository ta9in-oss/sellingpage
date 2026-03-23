import { Shield, Truck, RefreshCw, CreditCard, Award, CheckCircle } from 'lucide-react';
import type { Guarantee } from '../../types/content.types';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface GuaranteeSectionProps {
    guarantees: Guarantee[];
    title?: string;
    className?: string;
}

const iconMap = { shield: Shield, truck: Truck, refresh: RefreshCw, credit: CreditCard, award: Award, check: CheckCircle };

export function GuaranteeSection({ guarantees, title = 'الضمانات ديالنا', className }: GuaranteeSectionProps) {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';

    if (!guarantees || guarantees.length === 0) return null;

    // ── Brutalist ──────────────────────────────────────────────────────────
    if (!isDark) {
        return (
            <section className={cn('py-16 bg-black text-white', className)}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
                        <div className="w-24 h-2 bg-yellow-400 mx-auto transform -rotate-1"></div>
                        <p className="mt-6 text-lg text-gray-300 font-medium">نضمنلك جودة عالية وخدمة ممتازة</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {guarantees.map((guarantee, index) => {
                            const IconComponent = iconMap[guarantee.icon as keyof typeof iconMap] || Shield;
                            return (
                                <div key={index} className="bg-white text-black border-2 border-yellow-400 p-6 transform hover:scale-105 transition-transform duration-200">
                                    <div className="flex justify-end mb-4">
                                        <div className="w-16 h-16 bg-yellow-400 border-2 border-black flex items-center justify-center transform -rotate-3">
                                            <IconComponent className="w-8 h-8 text-black" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black mb-3 text-right">{guarantee.title}</h3>
                                    <p className="text-base text-gray-700 leading-relaxed text-right font-medium">{guarantee.description}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 border-2 border-white transform rotate-1">
                            <Award className="w-6 h-6" strokeWidth={3} />
                            <p className="text-xl font-black">ضمان الجودة %100</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ── Acquisition (dark) ─────────────────────────────────────────────────
    return (
        <section className={cn('py-16', className)} style={{ backgroundColor: '#050505' }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: theme.colors.foreground }}>{title}</h2>
                    <div className="w-24 h-1 mx-auto" style={{ backgroundColor: theme.colors.accent }} />
                    <p className="mt-6 text-lg font-medium" style={{ color: '#9ca3af' }}>نضمنلك جودة عالية وخدمة ممتازة</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {guarantees.map((guarantee, index) => {
                        const IconComponent = iconMap[guarantee.icon as keyof typeof iconMap] || Shield;
                        return (
                            <div key={index} className="p-6 transition-transform duration-200 hover:scale-105" style={{ backgroundColor: theme.colors.muted, border: `1px solid ${theme.colors.border}`, borderRadius: theme.effects.borderRadius }}>
                                <div className="flex justify-end mb-4">
                                    <div className="w-16 h-16 flex items-center justify-center" style={{ backgroundColor: `${theme.colors.accent}20`, border: `1px solid ${theme.colors.accent}50`, borderRadius: '12px' }}>
                                        <IconComponent className="w-8 h-8" style={{ color: theme.colors.accent }} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black mb-3 text-right" style={{ color: theme.colors.foreground }}>{guarantee.title}</h3>
                                <p className="text-base leading-relaxed text-right font-medium" style={{ color: '#9ca3af' }}>{guarantee.description}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-3 px-8 py-4" style={{ backgroundColor: theme.colors.accent, color: '#000', borderRadius: theme.effects.borderRadius }}>
                        <Award className="w-6 h-6" strokeWidth={3} />
                        <p className="text-xl font-black">ضمان الجودة %100</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
