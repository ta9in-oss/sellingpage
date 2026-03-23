import type { Theme } from './theme.types';

// Dark, high-converting sales page theme inspired by acquisition.com
// Orange accent, dark background, clean professional look
export const acquisitionTheme: Theme = {
    name: 'acquisition',
    mode: 'dark',
    colors: {
        primary: '#F97316',    // orange-500 — brand / CTA color
        secondary: '#FFFFFF',  // white text
        accent: '#F97316',     // orange — highlights, stars, buttons
        background: '#0A0A0A', // near black page background
        foreground: '#FFFFFF', // primary text
        border: '#262626',     // subtle dark borders
        muted: '#161616',      // card / section backgrounds
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
        cardPadding: '2rem',
        buttonPadding: '1rem 2rem',
    },
    effects: {
        borderRadius: '8px',
        borderWidth: '1px',
        shadow: '0 4px 12px rgba(0,0,0,0.4)',
        hoverShadow: '0 8px 24px rgba(249,115,22,0.2)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    direction: 'rtl',
};
