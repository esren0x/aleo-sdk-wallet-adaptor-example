import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.wasm'],
    worker: {
        format: "es",
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    build: {
        target: "esnext",
        sourcemap: true,
    },
    optimizeDeps: {
        exclude: ["@provablehq/wasm"],
    },
    server: {
        fs: {
            allow: [searchForWorkspaceRoot(process.cwd()), "../sdk"],
        },
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
})