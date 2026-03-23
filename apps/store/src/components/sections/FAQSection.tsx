import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/types/content.types';
import { cn } from '@/lib/utils';
import { getTheme } from '@/lib/theme';

interface FAQSectionProps {
    faqs: FAQItem[];
    title?: string;
    className?: string;
}

export function FAQSection({ faqs, title = 'الأسئلة الشائعة', className }: FAQSectionProps) {
    const [openId, setOpenId] = useState<number | null>(null);
    const theme = getTheme();
    const isDark = theme.mode === 'dark';

    if (!faqs || faqs.length === 0) return null;

    const toggleFAQ = (id: number) => setOpenId(openId === id ? null : id);

    // ── Brutalist ──────────────────────────────────────────────────────────
    if (!isDark) {
        return (
            <section className={cn('py-16 bg-white', className)}>
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
                        <div className="w-24 h-2 bg-yellow-400 mx-auto transform rotate-1"></div>
                        <p className="mt-6 text-lg text-gray-600 font-medium">عندك سؤال؟ شوف الإجابات هنا</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="border-2 border-black bg-white shadow-brutal overflow-hidden">
                                <button
                                    onClick={() => toggleFAQ(faq.id)}
                                    className="w-full p-6 flex items-center justify-between gap-4 text-right hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronDown className={cn('w-6 h-6 shrink-0 transition-transform duration-200', openId === faq.id && 'rotate-180')} />
                                    <h3 className="text-xl font-black flex-1">{faq.question}</h3>
                                </button>
                                <div className={cn('overflow-hidden transition-all duration-300', openId === faq.id ? 'max-h-96' : 'max-h-0')}>
                                    <div className="p-6 pt-0 border-t-2 border-gray-200">
                                        <p className="text-lg text-gray-700 leading-relaxed text-right font-medium">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <div className="inline-block border-2 border-black bg-yellow-400 px-8 py-4 transform -rotate-1">
                            <p className="text-lg font-black">مازال عندك سؤال؟ اتصل بينا على واتساب</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ── Acquisition (dark) ─────────────────────────────────────────────────
    return (
        <section className={cn('py-16', className)} style={{ backgroundColor: theme.colors.background }}>
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: theme.colors.foreground }}>{title}</h2>
                    <div className="w-24 h-1 mx-auto" style={{ backgroundColor: theme.colors.accent }} />
                    <p className="mt-6 text-lg font-medium" style={{ color: '#9ca3af' }}>عندك سؤال؟ شوف الإجابات هنا</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="overflow-hidden" style={{ border: `1px solid ${openId === faq.id ? theme.colors.accent : theme.colors.border}`, borderRadius: theme.effects.borderRadius, backgroundColor: theme.colors.muted }}>
                            <button
                                onClick={() => toggleFAQ(faq.id)}
                                className="w-full p-6 flex items-center justify-between gap-4 text-right transition-colors"
                            >
                                <ChevronDown className={cn('w-6 h-6 shrink-0 transition-transform duration-200', openId === faq.id && 'rotate-180')} style={{ color: openId === faq.id ? theme.colors.accent : '#6b7280' }} />
                                <h3 className="text-xl font-black flex-1" style={{ color: theme.colors.foreground }}>{faq.question}</h3>
                            </button>
                            <div className={cn('overflow-hidden transition-all duration-300', openId === faq.id ? 'max-h-96' : 'max-h-0')}>
                                <div className="p-6 pt-0" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                                    <p className="text-lg leading-relaxed text-right font-medium" style={{ color: '#9ca3af' }}>{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <div className="inline-block px-8 py-4" style={{ border: `1px solid ${theme.colors.accent}`, color: theme.colors.accent, borderRadius: theme.effects.borderRadius }}>
                        <p className="text-lg font-black">مازال عندك سؤال؟ اتصل بينا على واتساب</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
