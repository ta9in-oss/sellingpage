export interface ColorScheme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    border: string;
    muted: string;
    error: string;
    success: string;
}

export interface Typography {
    fontFamily: string;
    headingFont?: string;
    fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
    };
    fontWeight: {
        normal: string;
        medium: string;
        semibold: string;
        bold: string;
        black: string;
    };
}

export interface Spacing {
    containerMaxWidth: string;
    sectionPadding: string;
    cardPadding: string;
    buttonPadding: string;
}

export interface Effects {
    borderRadius: string;
    borderWidth: string;
    shadow: string;
    hoverShadow: string;
    transition: string;
}

export interface Theme {
    name: string;
    colors: ColorScheme;
    typography: Typography;
    spacing: Spacing;
    effects: Effects;
    direction: 'rtl' | 'ltr';
}
