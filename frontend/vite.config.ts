import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      // Polyfill Node globals like crypto for Node 20+
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          crypto: true
        } as any)
      ]
    }
  },
  resolve: {
    alias: {
      // ensure crypto imports work
      crypto: 'crypto-browserify'
    }
  }
})
