import { defineConfig } from "@playwright/test";
// Local static servers must not be sent through a corporate HTTP proxy.
process.env.NO_PROXY = [process.env.NO_PROXY, "127.0.0.1", "localhost"]
  .filter(Boolean)
  .join(",");
process.env.no_proxy = process.env.NO_PROXY;
const launchOptions = {
  args: ["--enable-unsafe-swiftshader"],
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
};
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  expect: { timeout: 10000 },
  workers: 2,
  use: { headless: true, launchOptions, trace: "retain-on-failure" },
  projects: [
    {
      name: "root",
      use: {
        baseURL: "http://127.0.0.1:43871",
        viewport: { width: 1440, height: 960 },
      },
    },
    {
      name: "pages-subpath",
      use: {
        baseURL: "http://127.0.0.1:43872/ai-coding-demo/",
        viewport: { width: 1440, height: 960 },
      },
    },
  ],
  webServer: [
    {
      command: "node scripts/serve.mjs",
      url: "http://127.0.0.1:43871",
      env: { PORT: "43871" },
      reuseExistingServer: false,
    },
    {
      command: "node scripts/serve.mjs",
      url: "http://127.0.0.1:43872/ai-coding-demo/",
      env: { PORT: "43872", SITE_BASE: "/ai-coding-demo/" },
      reuseExistingServer: false,
    },
  ],
});
