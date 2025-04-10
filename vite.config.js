import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        '/Users/alex/dev/provablehq/sdk/wasm/dist/mainnet/aleo_wasm.wasm',
        '/Users/alex/dev/provablehq/sdk/wasm/dist/testnet/aleo_wasm.wasm',
        '/Users/alex/dev/provablehq/sdk/wasm/dist/mainnet/worker.js',
        '/Users/alex/dev/provablehq/sdk/wasm/dist/testnet/worker.js',
      ]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
})
