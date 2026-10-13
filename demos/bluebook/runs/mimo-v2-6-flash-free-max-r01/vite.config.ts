import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 预览通过仓库根目录 previews/... 相对路径访问，必须使用相对 base。
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
});
