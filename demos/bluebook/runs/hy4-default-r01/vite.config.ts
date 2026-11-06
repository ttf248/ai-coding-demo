import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base 使用相对路径，保证构建产物既能在 Pages 子路径下打开，也能直接用 file:// 预览。
export default defineConfig({
  plugins: [react(), { name: 'archive-analytics-path', transformIndexHtml: { order: 'post', handler: (html) => html.replace('../../../../assets/analytics.js', '../../../assets/analytics.js') } }],
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
