import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/types/content.types';
import { cn } from '@/lib/utils';

interface FAQSectionProps {
    faqs: FAQItem[];
    title?: string;
    className?: string;
}

export function FAQSection({
    faqs,
    title = 'الأسئلة الشائعة',
    className,
}: FAQSectionProps) {
    const [openId, setOpenId] = useState<number | null>(null);

    if (!faqs || faqs.length === 0) {
        return null;
    }

    const toggleFAQ = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className={cn('py-16 bg-white', className)}>
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-4">
                        {title}
                    </h2>
                    <div className="w-24 h-2 bg-yellow-400 mx-auto transform rotate-1"></div>
                    <p className="mt-6 text-lg text-gray-600 font-medium">
                        عندك سؤال؟ شوف الإجابات هنا
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="border-2 border-black bg-white shadow-brutal overflow-hidden"
                        >
                            {/* Question Button */}
                            <button
                                onClick={() => toggleFAQ(faq.id)}
                                className="w-full p-6 flex items-center justify-between gap-4 text-right hover:bg-gray-50 transition-colors"
                            >
                                <ChevronDown
                                    className={cn(
                                        'w-6 h-6 shrink-0 transition-transform duration-200',
                                        openId === faq.id && 'rotate-180'
                                    )}
                                />
                                <h3 className="text-xl font-black flex-1">
                                    {faq.question}
                                </h3>
                            </button>

                            {/* Answer Content */}
                            <div
                                className={cn(
                                    'overflow-hidden transition-all duration-300',
                                    openId === faq.id ? 'max-h-96' : 'max-h-0'
                                )}
                            >
                                <div className="p-6 pt-0 border-t-2 border-gray-200">
                                    <p className="text-lg text-gray-700 leading-relaxed text-right font-medium">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Help CTA */}
                <div className="mt-12 text-center">
                    <div className="inline-block border-2 border-black bg-yellow-400 px-8 py-4 transform -rotate-1">
                        <p className="text-lg font-black">
                            مازال عندك سؤال؟ اتصل بينا على واتساب
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
