import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base 由构建命令通过 --base=./ 注入，保证产物可放在任意子路径下。
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // 图片放在 public/images，Vite 会原样拷贝到 dist/images（编译发布自动拷贝）
    copyPublicDir: true,
  },
});
