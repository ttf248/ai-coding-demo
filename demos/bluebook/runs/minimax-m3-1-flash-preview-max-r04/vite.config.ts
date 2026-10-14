import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// images/ 目录作为静态资源根，构建时自动拷贝到产物根目录
export default defineConfig({
  plugins: [react()],
  publicDir: "images",
  // 相对路径产物：既能被 Pages 子路径托管，也能直接 file:// 打开
  base: "./",
  build: { outDir: "dist", assetsDir: "assets" },
});
