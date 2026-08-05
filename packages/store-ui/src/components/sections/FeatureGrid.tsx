import { useTheme } from '../../context/ThemeContext';
import type { Feature } from '../../types/content.types';

interface FeatureGridProps {
    title: string;
    subtitle?: string;
    features: Feature[];
}

/** A real picture (url/path/data-uri) vs. an emoji/text glyph. */
function isPicture(v?: string): boolean {
    return !!v && /^(https?:\/\/|\/|data:)/.test(v);
}

/** Render a feature's visual: an <img> for a picture, else the emoji/icon as big text. */
function FeatureVisual({ feature, imgClass }: { feature: Feature; imgClass: string }) {
    const pic = isPicture(feature.image) ? feature.image : '';
    const glyph = feature.icon || (!isPicture(feature.image) ? feature.image : '');
    if (pic) return <img src={pic} alt={feature.title} className={imgClass} />;
    if (glyph) return <span className="block text-6xl leading-none">{glyph}</span>;
    return null;
}

export function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';
    const isClean = theme.name === 'clean';

    // ── Acquisition (dark) ─────────────────────────────────────────────────
    if (isDark) {
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
                                    <FeatureVisual feature={feature} imgClass="w-48 h-48 object-contain mx-auto" />
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

    // ── Clean ──────────────────────────────────────────────────────────────
    if (isClean) {
        return (
            <section id="specs" className="bg-white py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4 text-slate-900">{title}</h2>
                        {subtitle && <p className="text-lg text-slate-500 mb-4">{subtitle}</p>}
                        <div className="h-1 w-16 mx-auto rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="mb-6">
                                    <FeatureVisual feature={feature} imgClass="w-36 h-36 object-contain mx-auto rounded-xl" />
                                </div>
                                <h3 className="font-bold text-xl mb-3 text-slate-900">{feature.title}</h3>
                                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // ── Brutalist (base) — card colours cycle through the merchant's theme ───
    const ink = theme.colors.border
    // [background tint, text] pairs cycled per card so accent/primary/background
    // pickers visibly restyle the grid.
    const cardCycle: Array<{ bg: string; fg: string }> = [
        { bg: theme.colors.accent, fg: theme.colors.foreground },
        { bg: theme.colors.primary, fg: theme.colors.secondary },
        { bg: theme.colors.background, fg: theme.colors.foreground },
    ];
    return (
        <section id="specs" className="py-16 px-6" style={{ backgroundColor: theme.colors.background }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black mb-4" style={{ color: theme.colors.foreground }}>{title}</h2>
                    {subtitle && <p className="text-lg mb-4" style={{ color: theme.colors.foreground, opacity: 0.7 }}>{subtitle}</p>}
                    <div className="h-1 w-32 mx-auto" style={{ backgroundColor: theme.colors.primary }}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const c = cardCycle[index % cardCycle.length]
                        return (
                        <div
                            key={index}
                            className="border-2 p-8 text-center transition-all duration-150 transform hover:-translate-y-1 hover:scale-110"
                            style={{ backgroundColor: c.bg, color: c.fg, borderColor: ink, boxShadow: `2px 2px 0px 0px ${ink}` }}
                        >
                            <div className="mb-6">
                                <FeatureVisual feature={feature} imgClass="w-48 h-48 object-contain mx-auto" />
                            </div>
                            <h3 className="font-black text-xl mb-4">{feature.title}</h3>
                            <p className="text-sm leading-relaxed">{feature.description}</p>
                        </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
