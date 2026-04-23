import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'ES2020',
    minify: 'terser',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
})