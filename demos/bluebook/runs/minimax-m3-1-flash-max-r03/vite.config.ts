import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), { name: "archive-analytics-path", apply: "build", transformIndexHtml(html) { return html.replace("../../../../assets/analytics.js", "../../../assets/analytics.js"); } }],
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
