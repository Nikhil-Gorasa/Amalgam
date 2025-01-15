import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: 'es'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    port: 3000
  }
})
