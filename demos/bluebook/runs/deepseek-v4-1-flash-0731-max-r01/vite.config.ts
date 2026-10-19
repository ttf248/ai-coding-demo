import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 构建为相对路径产物，可直接静态托管 / file:// 打开
export default defineConfig({
  plugins: [react()],
  base: "./",
});
