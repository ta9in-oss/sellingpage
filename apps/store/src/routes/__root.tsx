// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from "react";

import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "@/styles/app.css?url";
import analytics from "@/utils/analytics";
import { seo } from "@/utils/seo";
import { siteConfig } from "@/config/site.config";
import { ThemeProvider, themeToRootCss } from "@7aba/store-ui";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: siteConfig.site.description
          ? `${siteConfig.site.name} | ${siteConfig.site.description}`
          : siteConfig.site.name,
        description: siteConfig.site.description || siteConfig.site.name,
        image: "https://7aba.store/og_image.webp",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // Preconnect for Google Fonts (non-blocking font strategy)
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap",
      },
      // Preload LCP image (hero product image)
      {
        rel: "preload",
        as: "image",
        href: "/bagpack_001.webp",
        type: "image/webp",
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/apple-touch-icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    /**
     * Work around for duplicate scripts in ssr
     * https://github.com/TanStack/router/issues/4585
     * Fix duplicate scripts in hmr
     */
    scripts: import.meta.env.SSR ? [...analytics()] : [],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const isDark = siteConfig.theme.mode === 'dark';
  // Whole-store text direction from the merchant's theme. Individual fields (e.g.
  // phone/number inputs in the order form) may still override dir locally.
  const dir = siteConfig.theme.direction ?? 'rtl';
  return (
    <html dir={dir} className={isDark ? 'dark' : ''}>
      <head>
        <HeadContent />
        {/* Merchant theme → shadcn CSS vars, so shadcn components AND sections
            share one source of truth. SSR-rendered → no flash of default theme. */}
        <style dangerouslySetInnerHTML={{ __html: themeToRootCss(siteConfig.theme) }} />
      </head>
      <body>
        <ThemeProvider value={siteConfig.theme}>
          <GoogleOAuthProvider clientId={siteConfig.payment.googleClientId ?? ''}>
            {children}
          </GoogleOAuthProvider>
        </ThemeProvider>
        <Scripts />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${
              import.meta.env.VITE_META_PIXEL_ID
            }&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
