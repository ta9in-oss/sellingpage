// vite.config.ts
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        tsConfigPaths(),
        tanstackStart({
            customViteReactPlugin: true,
            server: {
                preset: process.env.CF_PAGES ? 'cloudflare-pages' : 'node-server',
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
                    if (id.includes('node_modules/@react-oauth')) return 'vendor-oauth'
                },
            },
        },
    },
})
