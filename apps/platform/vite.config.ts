// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite only exposes VITE_*-prefixed values (and only to the client). Server
// functions read plain `process.env.X` — which in dev is Node's env, so nothing
// from .env is there and secrets like CHARGILY_PLATFORM_SECRET_KEY look
// "not configured" locally. Copy .env into process.env here so dev matches
// production, where Cloudflare provides these as real environment bindings.
// Never overwrite a value already present in the real environment.
for (const [key, value] of Object.entries(loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), ''))) {
    if (process.env[key] === undefined) process.env[key] = value
}

export default defineConfig({
    resolve: { tsconfigPaths: true },
    server: {
        port: 3001,
        headers: {
            'Cross-Origin-Opener-Policy': 'unsafe-none',
            'Cross-Origin-Embedder-Policy': 'unsafe-none',
        },
    },
    plugins: [
        tailwindcss(),
        tanstackStart(),
        nitro({
            // Cloudflare Pages in production (output: dist/), plain Node elsewhere.
            preset: process.env.CF_PAGES ? 'cloudflare-pages' : 'node-server',
            // Allow Google OAuth popup communication on all routes
            routeRules: {
                '/**': {
                    headers: {
                        'Cross-Origin-Opener-Policy': 'unsafe-none',
                        'Cross-Origin-Embedder-Policy': 'unsafe-none',
                    },
                },
            },
        }),
        viteReact(),
    ],
    build: {
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/@instantdb')) return 'vendor-instantdb'
                    if (id.includes('node_modules/@radix-ui')) return 'vendor-radix'
                    if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
                    if (id.includes('node_modules/@dnd-kit')) return 'vendor-dndkit'
                    if (id.includes('node_modules/zustand')) return 'vendor-zustand'
                },
            },
        },
    },
})
