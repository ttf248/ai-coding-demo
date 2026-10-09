import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: {
    open: true,
    host: '0.0.0.0',
    port: 5173
  }
})
