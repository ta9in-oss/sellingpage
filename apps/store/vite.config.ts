// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    resolve: { tsconfigPaths: true },
    server: {
        port: 3000,
    },
    plugins: [
        tailwindcss(),
        tanstackStart(),
        nitro({
            // Cloudflare Pages in production (output: dist/), plain Node elsewhere.
            preset: process.env.CF_PAGES ? 'cloudflare-pages' : 'node-server',
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
                    if (id.includes('node_modules/@react-oauth')) return 'vendor-oauth'
                },
            },
        },
    },
})
