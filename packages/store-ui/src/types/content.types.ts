export interface HeroContent {
    title: string[];
    description: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    priceTag: {
        amount: string;
        currency: string;
    };
    freeDelivery: boolean;
}

export interface Feature {
    /** Picture URL. When empty, `icon` (emoji) is rendered as large text instead. */
    image: string;
    /** Emoji/text glyph fallback when no picture is set. */
    icon?: string;
    title: string;
    description: string;
    bgColor: string;
}

export interface ProductImage {
    id: number;
    image: string;
    title: string;
    bgColor: string;
}

export interface Testimonial {
    id: number;
    name: string;
    location?: string;
    rating: number;
    comment: string;
    date?: string;
    verified?: boolean;
    image?: string;
}

export interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

export interface Guarantee {
    icon: string;
    title: string;
    description: string;
}

export interface Benefit {
    icon: string;
    title: string;
    description: string;
}

export interface ComparisonItem {
    feature: string;
    ourProduct: boolean | string;
    competitor: boolean | string;
}

export interface UrgencyConfig {
    enabled: boolean;
    type: 'countdown' | 'stock' | 'limited-time';
    message: string;
    endDate?: string;
    stockThreshold?: number;
}

export interface CTAContent {
    title: string;
    subtitle?: string;
    description?: string;
    buttonText: string;
    buttonLink?: string;
    urgencyText?: string;
    features?: string[];
    backgroundColor?: string;
    urgent?: boolean;
}

export interface SocialProofContent {
    rating: number;
    reviewCount: number;
}

export interface ValueStackItem {
    icon?: string;
    title: string;
    description: string;
    value?: string;
    isFree?: boolean;
}

export interface ValueStackContent {
    ctaText?: string;
    items: ValueStackItem[];
}

export interface SiteContent {
    hero: HeroContent;
    features: Feature[];
    productImages: ProductImage[];
    socialProof?: SocialProofContent;
    valueStack?: ValueStackContent;
    testimonials?: Testimonial[];
    faqs?: FAQItem[];
    guarantees?: Guarantee[];
    benefits?: Benefit[];
    comparison?: ComparisonItem[];
    urgency?: UrgencyConfig;
    cta?: CTAContent;
    orderLayout?: OrderLayoutConfig;
    sections: {
        specs: {
            title: string;
            subtitle?: string;
        };
        order: {
            title: string;
            subtitle?: string;
        };
        testimonials?: {
            title: string;
            subtitle?: string;
        };
        faq?: {
            title: string;
            subtitle?: string;
        };
    };
}

/**
 * Layout configuration for the order section
 * Controls how form, carousel, and quantity selector are arranged
 */
export type OrderLayoutType =
    | 'form-right-carousel-quantity-left'  // Form right, Carousel top-left, Quantity bottom-left
    | 'form-left-carousel-quantity-right'  // Form left, Carousel top-right, Quantity bottom-right
    | 'side-by-side'                       // Form left, Quantity right (no carousel)
    | 'stacked'                            // All stacked vertically
    | 'custom';                            // Custom grid configuration

export interface OrderLayoutConfig {
    type: OrderLayoutType;
    showCarousel?: boolean;
    carouselPosition?: 'top-left' | 'top-right' | 'above-form' | 'below-form';
    gridColumns?: string; // CSS grid-template-columns value for custom layout
    gridAreas?: string;   // CSS grid-template-areas value for custom layout
}
