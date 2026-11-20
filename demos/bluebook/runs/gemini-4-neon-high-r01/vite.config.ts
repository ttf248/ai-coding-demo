import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "archive-analytics-path",
      apply: "build",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          return html.replace(
            "../../../../assets/analytics.js",
            "../../../assets/analytics.js",
          );
        },
      },
    },
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
