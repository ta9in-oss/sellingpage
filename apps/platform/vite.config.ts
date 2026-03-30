// vite.config.ts
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        port: 3001,
    },
    plugins: [
        tsConfigPaths(),
        tanstackStart({
            customViteReactPlugin: true,
            server: {
                // @ts-expect-error preset is valid at runtime
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
            },
        }),
        viteReact(),
    ],
    publicDir: 'src/public',
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
