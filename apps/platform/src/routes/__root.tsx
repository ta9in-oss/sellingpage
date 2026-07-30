import * as React from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LangProvider } from '@/context/LangContext'
import { CookieNotice } from '@/components/marketing/CookieNotice'
import appCss from '@/styles/app.css?url'
import analytics from '@/utils/analytics'

const SITE_URL = 'https://7aba.app'
const DEFAULT_OG = `${SITE_URL}/og-image.webp`
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#F97316' },
      { name: 'color-scheme', content: 'dark light' },
      { name: 'geo.region', content: 'DZ' },
      { name: 'geo.placename', content: 'Algeria' },
      { name: 'geo.position', content: '28.0339;1.6596' },
      { name: 'ICBM', content: '28.0339, 1.6596' },
      { property: 'og:site_name', content: '7aba.store' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: DEFAULT_OG },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:image', content: DEFAULT_OG },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: FONT_URL },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
    scripts: [
      {
        children:
          "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','322683491235522');fbq('track','PageView');",
      },
      ...(import.meta.env.SSR ? analytics() : []),
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <LangProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID ?? ''}>
            <Outlet />
            <CookieNotice />
          </GoogleOAuthProvider>
        </LangProvider>
        <Scripts />
      </body>
    </html>
  )
}
