import { CheckCircle, Star, Zap, Heart, Shield, TrendingUp } from 'lucide-react';
import type { Benefit } from '@/types/content.types';
import { cn } from '@/lib/utils';

interface BenefitsSectionProps {
    benefits: Benefit[];
    title?: string;
    className?: string;
}

const iconMap = {
    check: CheckCircle,
    star: Star,
    zap: Zap,
    heart: Heart,
    shield: Shield,
    trend: TrendingUp,
};

export function BenefitsSection({
    benefits,
    title = 'فوائد المنتج',
    className,
}: BenefitsSectionProps) {
    if (!benefits || benefits.length === 0) {
        return null;
    }

    return (
        <section className={cn('py-16 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400', className)}>
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-black">
                        {title}
                    </h2>
                    <div className="w-24 h-2 bg-black mx-auto transform rotate-1"></div>
                    <p className="mt-6 text-lg text-black font-bold">
                        ليش راح تحب الصاكادو؟
                    </p>
                </div>

                {/* Benefits List */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {benefits.map((benefit, index) => {
                        const IconComponent = iconMap[benefit.icon as keyof typeof iconMap] || CheckCircle;

                        return (
                            <div
                                key={index}
                                className="bg-white border-2 border-black p-6 flex items-start gap-4 shadow-brutal hover:shadow-brutal-lg transition-all duration-200 transform hover:-translate-y-1"
                            >
                                {/* Icon */}
                                <div className="shrink-0">
                                    <div className="w-12 h-12 bg-black flex items-center justify-center transform rotate-3">
                                        <IconComponent className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-right">
                                    <h3 className="text-xl font-black mb-2 text-black">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-base text-gray-700 leading-relaxed font-medium">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-2xl font-black text-black">
                        وبزاف فوائد أخرين! 🎉
                    </p>
                </div>
            </div>
        </section>
    );
}
