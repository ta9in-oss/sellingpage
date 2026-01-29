import { siteConfig } from '@/config/site.config';
import type { Theme } from '@/config/themes/theme.types';

/**
 * Get the currently active theme
 */
export function getTheme(): Theme {
    return siteConfig.theme;
}

/**
 * Get a specific theme value by path
 * @example getThemeValue('colors.primary') => '#000000'
 */
export function getThemeValue(path: string): string {
    const theme = getTheme();
    const keys = path.split('.');
    let value: any = theme;

    for (const key of keys) {
        value = value?.[key];
    }

    return value || '';
}

/**
 * Build commonly used theme-based CSS classes
 */
export function buildThemeClasses(theme: Theme) {
    return {
        container: `max-w-[${theme.spacing.containerMaxWidth}] mx-auto`,
        section: `py-16 px-6`,
        heading: `font-[${theme.typography.fontWeight.black}] text-4xl`,
        card: `border-[${theme.effects.borderWidth}] border-[${theme.colors.border}] p-[${theme.spacing.cardPadding}]`,
        button: `bg-[${theme.colors.accent}] text-[${theme.colors.primary}] px-8 py-4 border-[${theme.effects.borderWidth}] border-[${theme.colors.border}] rounded-[${theme.effects.borderRadius}] font-[${theme.typography.fontWeight.black}] shadow-[${theme.effects.shadow}] hover:shadow-[${theme.effects.hoverShadow}] transition-[${theme.effects.transition}]`,
    };
}
