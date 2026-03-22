import { useTheme } from '../../context/ThemeContext';
import type { Feature } from '../../types/content.types';

interface FeatureGridProps {
    title: string;
    subtitle?: string;
    features: Feature[];
}

export function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';

    // ── Brutalist ──────────────────────────────────────────────────────────
    if (!isDark) {
        return (
            <section id="specs" className="bg-white py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4">{title}</h2>
                        {subtitle && <p className="text-lg text-gray-600 mb-4">{subtitle}</p>}
                        <div className="bg-black h-1 w-32 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`${feature.bgColor} border-2 border-black p-8 text-center transition-all duration-150 transform hover:-translate-y-1 hover:scale-110 shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]`}
                            >
                                <div className="mb-6">
                                    {feature.image && <img src={feature.image} alt={feature.title} className="w-48 h-48 object-contain mx-auto" />}
                                </div>
                                <h3 className="font-black text-xl mb-4">{feature.title}</h3>
                                <p className="text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // ── Acquisition (dark) ─────────────────────────────────────────────────
    return (
        <section id="specs" className="py-16 px-6" style={{ backgroundColor: theme.colors.background }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black mb-4" style={{ color: theme.colors.foreground }}>{title}</h2>
                    {subtitle && <p className="text-lg mb-4" style={{ color: '#9ca3af' }}>{subtitle}</p>}
                    <div className="h-1 w-32 mx-auto" style={{ backgroundColor: theme.colors.accent }}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 text-center transition-all duration-150 transform hover:-translate-y-1"
                            style={{
                                backgroundColor: theme.colors.muted,
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: theme.effects.borderRadius,
                                boxShadow: theme.effects.shadow,
                            }}
                        >
                            <div className="mb-6">
                                {feature.image && <img src={feature.image} alt={feature.title} className="w-48 h-48 object-contain mx-auto" />}
                            </div>
                            <h3 className="font-black text-xl mb-4" style={{ color: index % 2 === 0 ? theme.colors.accent : theme.colors.foreground }}>{feature.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
