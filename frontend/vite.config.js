import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ Ensures Azure serves files correctly from root
  base: './',

  // ✅ Output directory matches Azure’s default
  build: {
    outDir: 'dist', // Azure expects this for static web apps
    assetsDir: 'assets', // Optional, keeps structure clean
  },

  // ✅ Allow environment variables with VITE_ prefix
  envPrefix: 'VITE_',

  // ✅ Ensure Azure handles image formats properly
  assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.JPEG', '**/*.PNG', '**/*.png'],

  // ✅ Optional: Set server host for local testing on Azure
  server: {
    port: 5173,
    host: true, // Makes it accessible to Azure App Service during build/test
  },
})
