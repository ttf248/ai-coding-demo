import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), {
    name: "archive-analytics-path",
    transformIndexHtml: {
      order: "post",
      handler: (html) => html.replace("../../../../assets/analytics.js", "../../../assets/analytics.js"),
    },
  }],
  base: "./",
});
