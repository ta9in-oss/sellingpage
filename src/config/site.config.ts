import { brutalistTheme } from './themes/brutalist';
import type { Theme } from './themes/theme.types';

export const siteConfig = {
    // Theme selection - change this to switch themes at build time
    theme: brutalistTheme as Theme,

    // Site metadata
    site: {
        name: 'حبة ستور',
        description: 'متجر إلكتروني للمنتجات المميزة',
        url: 'https://7aba.store',
        logo: '/assets/logo/7aba_store_logo_i1.svg',
    },

    // Feature flags
    features: {
        notifications: true,
        testimonials: false,
        faqs: false,
        guarantees: false,
        benefits: false,
        comparison: false,
        urgency: false,
        multiProduct: false,
    },

    // InstantDB product reference
    defaultProduct: {
        productNumber: 'PROD-234567-A1B2C3',
    },
} as const;
