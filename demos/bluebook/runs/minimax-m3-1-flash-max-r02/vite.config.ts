import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite 默认输出 ES module 脚本，带 crossorigin 属性，
 * 在 file:// 下会被 CORS 策略拦截。这里输出经典 IIFE 脚本并去掉 crossorigin，
 * 让构建产物既能用静态服务器访问，也能直接双击打开。
 */
function removeCrossorigin(): Plugin {
  return {
    name: "remove-crossorigin",
    transformIndexHtml(html) {
      const cleaned = html
        .replace(/\s+crossorigin/g, "")
        // 公共统计脚本在源码目录与 previews 目录的深度不同，构建时改写为预览目录的相对路径
        .replaceAll("../../../../assets/analytics.js", "../../../assets/analytics.js")
        // 经典脚本（非 module）才能在 file:// 下直接打开
        .replace(/<script type="module"/g, "<script");
      // 只搬动应用入口脚本，公共统计脚本保留在 head 中
      const script = cleaned.match(
        /<script(?![^>]*analytics\.js)[^>]*src="[^"]*"[^>]*><\/script>/,
      );
      if (!script) return cleaned;
      // 经典脚本会立即执行，需要放到 body 末尾，等 #root 挂载点先出现
      return cleaned
        .replace(script[0], "")
        .replace("</body>", `${script[0]}\n  </body>`);
    }
  };
}

export default defineConfig({
  plugins: [react(), removeCrossorigin()],
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    target: "es2018",
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
