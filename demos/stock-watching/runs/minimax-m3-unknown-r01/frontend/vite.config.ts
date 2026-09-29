import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 配置 —— 启动时默认访问 http://localhost:8080 后端
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});