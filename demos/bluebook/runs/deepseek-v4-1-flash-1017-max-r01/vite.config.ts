import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react(), { name: 'archive-analytics', apply: 'build', transformIndexHtml(html) { return html.replace('../../../../assets/analytics.js', '../../../assets/analytics.js'); } }],
});
