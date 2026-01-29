import { ShoppingCart, ArrowLeft } from 'lucide-react';
import type { CTASection as CTASectionType } from '@/types/content.types';
import { cn } from '@/lib/utils';

interface CTASectionProps {
    cta: CTASectionType;
    className?: string;
}

export function CTASection({
    cta,
    className,
}: CTASectionProps) {
    const handleScrollToOrder = () => {
        const orderSection = document.getElementById('order-section') ||
            document.querySelector('[id*="order"]');
        if (orderSection) {
            orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className={cn('py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden', className)}>
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 transform rotate-12"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-yellow-400 transform -rotate-12"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Heading */}
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        {cta.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-yellow-400 font-bold mb-8">
                        {cta.subtitle}
                    </p>

                    {/* Description */}
                    {cta.description && (
                        <p className="text-lg text-gray-300 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                            {cta.description}
                        </p>
                    )}

                    {/* Main CTA Button */}
                    <button
                        onClick={handleScrollToOrder}
                        className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black px-12 py-6 text-2xl font-black border-4 border-white shadow-brutal-lg transform hover:scale-105 transition-all duration-200 mb-6"
                    >
                        <span>{cta.buttonText}</span>
                        <ShoppingCart className="w-7 h-7" strokeWidth={3} />
                    </button>

                    {/* Urgency Text */}
                    {cta.urgencyText && (
                        <p className="text-yellow-400 font-black text-lg mb-8">
                            ⚡ {cta.urgencyText} ⚡
                        </p>
                    )}

                    {/* Features List */}
                    {cta.features && cta.features.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                            {cta.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-yellow-400 border-2 border-white p-4 transform hover:scale-105 transition-transform"
                                >
                                    <p className="text-black font-black text-center">
                                        ✓ {feature}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
