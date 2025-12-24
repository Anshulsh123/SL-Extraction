import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use absolute base so assets load correctly on GitHub Pages
  base: '/SL-Extraction/',
  server: {
    port: 5173,
    open: '/index.dev.html',
  },
  build: {
    rollupOptions: {
      input: 'index.dev.html',
    },
  },
})
