import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" 使构建产物可放在任意子路径（GitHub Pages previews 目录）下直接托管
export default defineConfig({
  plugins: [react()],
  base: "./",
});
