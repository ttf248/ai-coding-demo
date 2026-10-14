import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// images/ 目录作为静态资源根，构建时自动拷贝到产物根目录
export default defineConfig({
  plugins: [react()],
  publicDir: "images",
  // 相对路径产物支持 Pages 子路径托管；浏览器会阻止 file:// 加载 ES module/CSS。
  base: "./",
  build: { outDir: "dist", assetsDir: "assets" },
});
