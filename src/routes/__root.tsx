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
        title: "حبة ستور | كل مرة حبة جديدة ما صراتش!!!",
        description:
          "حبة ستور والكل يتسوق في راحتو. عس مليح ، واشري اللي تحتاج برك.",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700&display=swap",
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
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${
              process.env.META_PIXEL_ID || import.meta.env.VITE_META_PIXEL_ID
            }&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
