import { Theme } from './theme.types';

export const brutalistTheme: Theme = {
    name: 'brutalist',
    mode: 'light',
    colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#FACC15', // yellow-400
        background: '#FFFFFF',
        foreground: '#000000',
        border: '#000000',
        muted: '#F3F4F6',
        error: '#EF4444',
        success: '#10B981',
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
        sectionPadding: '4rem 1.5rem',
        cardPadding: '2rem',
        buttonPadding: '1rem 2rem',
    },
    effects: {
        borderRadius: '0px',
        borderWidth: '2px',
        shadow: '2px 2px 0px 0px #000',
        hoverShadow: '4px 4px 0px 0px #000',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    direction: 'rtl',
};
