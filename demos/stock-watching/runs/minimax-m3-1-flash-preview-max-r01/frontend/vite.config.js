import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 前端通过 VITE_API_BASE 指向后端；开发期用代理避免跨域配置缺失。
// 生产构建仍以相对 /api/v1 访问，由网关或反代转发到 Go 服务。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
  },
  build: { outDir: "dist" },
});
