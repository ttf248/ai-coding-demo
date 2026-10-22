import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "archive-analytics-path",
      apply: "build",
      transformIndexHtml(html) {
        return html.replace(
          "../../../../assets/analytics.js",
          "../../../assets/analytics.js",
        );
      },
    },
  ],
});
