export default () => {
  const isProd = (process.env.NODE_ENV || import.meta.env.MODE) === 'production'
  const gaId = process.env.GOOGLE_ANALYTICS || import.meta.env.VITE_GOOGLE_ANALYTICS

  if (!isProd || !gaId) return []

  return [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
      async: true,
      id: 'google-gtag-js',
    },
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `,
      id: 'google-gtag-config',
    },
  ]
}
