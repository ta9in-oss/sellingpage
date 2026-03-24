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
            },
        }),
        viteReact(),
    ],
    publicDir: 'src/public',
})
