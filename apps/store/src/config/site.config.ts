import { brutalistTheme } from './themes/brutalist';
import type { Theme } from './themes/theme.types';

export const siteConfig = {
    // Theme selection — swap at build time (brutalistTheme | acquisitionTheme)
    theme: brutalistTheme as Theme,

    // Site metadata
    site: {
        name: 'حبة ستور',
        description: 'متجر إلكتروني للمنتجات المميزة',
        url: 'https://7aba.store',
        logo: '/assets/logo/7aba_store_logo_i1.svg',
    },

    // FOMO order notification
    notifications: {
        style: 'brutalist' as 'brutalist' | 'soft' | 'minimal' | 'dark',
        message: '',
    },

    // Feature flags
    features: {
        notifications: true,
        testimonials: false,
        faqs: false,
        guarantees: false,
        benefits: false,
        socialProof: false,
        valueStack: false,
        cta: false,
        comparison: false,
        urgency: false,
        multiProduct: false,
    },

    // Payment configuration — configured by merchant, not shown to buyers
    payment: {
        activeMethod: 'cod' as 'cod' | 'chargily',
        googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,
    },

    // InstantDB product reference
    defaultProduct: {
        productNumber: 'PROD-234567-A1B2C3',
    },
} as const;
