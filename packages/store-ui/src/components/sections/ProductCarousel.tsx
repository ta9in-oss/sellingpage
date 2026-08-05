import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useTheme } from '../../context/ThemeContext';
import type { ProductImage } from '../../types/content.types';

/** Keep the merchant's radius inside a sane range for large surfaces. */
function cardRadius(value: string | undefined): string {
    const m = /^(\d+(?:\.\d+)?)px$/.exec((value ?? '0px').trim());
    return m ? `${Math.min(parseFloat(m[1]), 24)}px` : '0px';
}

interface ProductCarouselProps {
    products: ProductImage[];
    autoplay?: boolean;
    autoplayInterval?: number;
}

export function ProductCarousel({
    products,
    autoplay = true,
    autoplayInterval = 5000
}: ProductCarouselProps) {
    const theme = useTheme();
    const radius = cardRadius(theme.effects?.borderRadius);
    const ink = theme.colors.border;
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = products.length;

    useEffect(() => {
        if (!autoplay) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, autoplayInterval);

        return () => clearInterval(interval);
    }, [autoplay, autoplayInterval, totalSlides]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    return (
        <div
            className="border-2 p-3 sm:p-6 transform -rotate-1"
            style={{ backgroundColor: theme.colors.background, borderColor: ink, borderRadius: radius }}
        >
            <div className="relative">
                <div className="overflow-hidden" style={{ borderRadius: radius }}>
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(${currentSlide * 100}%)` }}
                    >
                        {products.map((product, index) => (
                            <div key={product.id} className="min-w-full flex-shrink-0">
                                <div className={`${product.bgColor} p-2 sm:p-4 border-2`} style={{ borderColor: ink, borderRadius: radius }}>
                                    <div className="relative w-full">
                                        <picture>
                                            <source srcSet={product.image.replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-72 h-64 object-cover mx-auto"
                                                style={{ borderRadius: radius }}
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                                decoding="async"
                                                width="288"
                                                height="256"
                                            />
                                        </picture>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 border-black font-black hover:bg-gray-800 w-8 h-8 sm:w-10 sm:h-10 z-10"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                >
                    <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 border-black font-black hover:bg-gray-800 w-8 h-8 sm:w-10 sm:h-10 z-10"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </Button>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-4 sm:mt-6 gap-2 sm:gap-3">
                    {products.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 sm:w-4 sm:h-4 border-2 border-black transition-colors rounded-sm ${index === currentSlide ? 'bg-black' : 'bg-white'
                                }`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
