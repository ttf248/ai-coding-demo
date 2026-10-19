import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * 产物同时兼容 file:// 直接打开：
 * 1. 以 IIFE 格式打包，产出普通 <script> 而不是 ES module（ES module 在 file:// 下会被浏览器 CORS 策略拦截）；
 * 2. 去掉 Vite 默认注入的 crossorigin 属性（file:// 属于 null origin，带 crossorigin 的请求会被拦截）。
 */
function fileProtocolFriendly(): Plugin {
  return {
    name: "file-protocol-friendly",
    enforce: "post",
    transformIndexHtml(html) {
      return html
        .replaceAll("../../../../assets/analytics.js", "../../../assets/analytics.js")
        .replace(/ crossorigin/g, "")
        .replace(/<script type="module"/g, "<script defer")
        .replace(/<link rel="stylesheet" crossorigin/g, '<link rel="stylesheet"');
    },
  };
}

export default defineConfig({
  plugins: [react(), fileProtocolFriendly()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    target: "es2015",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "assets/app.js",
        assetFileNames: "assets/app.[ext]",
      },
    },
  },
});
