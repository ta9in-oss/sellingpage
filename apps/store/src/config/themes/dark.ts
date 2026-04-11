import type { Theme } from './theme.types';

// Dark Pro — High-converting dark e-commerce theme used by Algerian dropshipping pros
export const darkTheme: Theme = {
    name: 'dark',
    mode: 'dark',
    colors: {
        primary: '#10B981',     // emerald-500
        secondary: '#1A1A2E',   // deep navy
        accent: '#10B981',
        background: '#0D0D0D',  // near-black
        foreground: '#F9FAFB',  // gray-50
        border: '#262626',      // neutral-800
        muted: '#171717',       // neutral-900
        error: '#F87171',
        success: '#34D399',
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
        cardPadding: '2rem',
        buttonPadding: '0.875rem 2.5rem',
    },
    effects: {
        borderRadius: '8px',
        borderWidth: '1px',
        shadow: '0 0 0 1px rgba(16,185,129,0.1), 0 4px 24px rgba(16,185,129,0.06)',
        hoverShadow: '0 0 0 1px rgba(16,185,129,0.3), 0 8px 40px rgba(16,185,129,0.15)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    direction: 'rtl',
};
