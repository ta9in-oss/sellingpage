export default () => {
    const isProd = import.meta.env.MODE === 'production'

    const googleAnalytics = import.meta.env.VITE_GOOGLE_ANALYTICS;

    if (!isProd || !googleAnalytics) return [];

    return [
        {
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`,
            async: true,
            id: 'google-gtag-js'
        },
        {
            children: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalytics}');
            `,
            id: 'google-gtag-config'
        }
    ];

}