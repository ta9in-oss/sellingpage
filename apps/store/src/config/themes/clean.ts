import type { Theme } from './theme.types';

// Clean / Minimal — Shopify-style modern e-commerce theme
export const cleanTheme: Theme = {
    name: 'clean',
    mode: 'light',
    colors: {
        primary: '#0EA5E9',  // sky-500
        secondary: '#FFFFFF',
        accent: '#0EA5E9',
        background: '#F8FAFC',  // slate-50
        foreground: '#0F172A',  // slate-900
        border: '#E2E8F0',      // slate-200
        muted: '#F1F5F9',       // slate-100
        error: '#EF4444',
        success: '#22C55E',
    },
    typography: {
        fontFamily: 'Almarai, sans-serif',
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            black: '900',
        },
    },
    spacing: {
        containerMaxWidth: '80rem',
        sectionPadding: '5rem 1.5rem',
        cardPadding: '1.5rem',
        buttonPadding: '0.75rem 2rem',
    },
    effects: {
        borderRadius: '12px',
        borderWidth: '1px',
        shadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        hoverShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    direction: 'rtl',
};
