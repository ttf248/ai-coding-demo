import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// public/ 目录下的 images 会在编译时整体拷贝到 dist/images，
// 因此图片资源全部走本地相对路径，不依赖任何外部图床。
export default defineConfig({
  base: "./",
  plugins: [react()],
  publicDir: "public",
  build: { outDir: "dist", assetsDir: "assets" },
});
