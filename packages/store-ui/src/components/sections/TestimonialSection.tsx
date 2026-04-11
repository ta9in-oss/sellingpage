import { Star } from 'lucide-react';
import type { Testimonial } from '../../types/content.types';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface TestimonialSectionProps {
    testimonials: Testimonial[];
    title?: string;
    className?: string;
}

export function TestimonialSection({ testimonials, title = 'ما قالوا الزبائن', className }: TestimonialSectionProps) {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';
    const isClean = theme.name === 'clean';

    if (!testimonials || testimonials.length === 0) return null;

    // ── Acquisition (dark) ─────────────────────────────────────────────────
    if (isDark) {
        return (
            <section className={cn('py-16', className)} style={{ backgroundColor: theme.colors.background }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: theme.colors.foreground }}>{title}</h2>
                        <div className="w-24 h-1 mx-auto" style={{ backgroundColor: theme.colors.accent }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="p-6 transition-shadow duration-200 hover:-translate-y-1" style={{ backgroundColor: theme.colors.muted, border: `1px solid ${theme.colors.border}`, borderRadius: theme.effects.borderRadius }}>
                                <div className="flex gap-1 mb-4 justify-end">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-5 h-5" style={{ fill: theme.colors.accent, color: theme.colors.accent }} />
                                    ))}
                                </div>
                                <p className="text-lg font-medium mb-6 text-right leading-relaxed" style={{ color: '#d1d5db' }}>"{testimonial.comment}"</p>
                                <div className="pt-4" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                                    <div className="flex items-center gap-3 justify-end">
                                        {testimonial.image ? (
                                            <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" style={{ border: `2px solid ${theme.colors.accent}` }} />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl" style={{ backgroundColor: `${theme.colors.accent}30`, color: theme.colors.accent, border: `2px solid ${theme.colors.accent}` }}>
                                                {testimonial.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="text-right">
                                            <p className="font-bold text-base" style={{ color: theme.colors.foreground }}>{testimonial.name}</p>
                                            {testimonial.location && <p className="text-sm font-medium" style={{ color: '#6b7280' }}>{testimonial.location}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <div className="inline-block px-8 py-4" style={{ backgroundColor: theme.colors.accent, color: '#000', borderRadius: theme.effects.borderRadius }}>
                            <p className="text-xl font-black">+{testimonials.length * 10} زبون راضي</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ── Clean ──────────────────────────────────────────────────────────────
    if (isClean) {
        return (
            <section className={cn('py-16 px-6 bg-slate-50', className)}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-slate-900 mb-3">آراء عملائنا</h2>
                        <div className="h-1 w-16 mx-auto rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, index) => (
                            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex gap-1 mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className="text-amber-400 text-lg">★</span>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed mb-4 text-right">{t.comment}</p>
                                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                    {t.image && <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />}
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{t.name}</p>
                                        {t.location && <p className="text-xs text-slate-400">{t.location}</p>}
                                    </div>
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
        <section className={cn('py-16 bg-gradient-to-b from-white to-gray-50', className)}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
                    <div className="w-24 h-2 bg-yellow-400 mx-auto transform -rotate-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white border-2 border-black p-6 shadow-brutal hover:shadow-brutal-lg transition-shadow duration-200 transform hover:-translate-y-1">
                            <div className="flex gap-1 mb-4 justify-end">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-lg font-medium text-gray-800 mb-6 text-right leading-relaxed">"{testimonial.comment}"</p>
                            <div className="border-t-2 border-gray-200 pt-4">
                                <div className="flex items-center gap-3 justify-end">
                                    {testimonial.image ? (
                                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-black object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full border-2 border-black bg-yellow-400 flex items-center justify-center font-black text-xl">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="text-right">
                                        <p className="font-bold text-base">{testimonial.name}</p>
                                        {testimonial.location && <p className="text-sm text-gray-600 font-medium">{testimonial.location}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <div className="inline-block bg-black text-white px-8 py-4 transform -rotate-1">
                        <p className="text-xl font-black">+{testimonials.length * 10} زبون راضي</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
