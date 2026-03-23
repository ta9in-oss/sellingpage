import type { Theme } from './theme.types'

export const warmTheme: Theme = {
  name: 'warm',
  mode: 'light',
  colors: {
    primary: '#92400E',
    secondary: '#FFFBF5',
    accent: '#D97706',
    background: '#FFFBF5',
    foreground: '#1C1917',
    border: '#D6D3D1',
    muted: '#FEF3C7',
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
    borderRadius: '8px',
    borderWidth: '1px',
    shadow: '0 2px 8px rgba(0,0,0,0.08)',
    hoverShadow: '0 4px 16px rgba(0,0,0,0.12)',
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  direction: 'rtl',
}
