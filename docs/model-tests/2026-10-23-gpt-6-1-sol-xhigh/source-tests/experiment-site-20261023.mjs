import { chromium, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";
import { loadCatalog } from "../scripts/lib.mjs";
const server = spawn(process.execPath, ["scripts/serve.mjs", "--read-only"], {
  env: { ...process.env, PORT: "43904", SITE_BASE: "/ai-coding-demo/" },
  stdio: "ignore",
  windowsHide: true,
});
const data = loadCatalog(),
  runId = "gpt-6-1-sol-xhigh-r01";
fs.mkdirSync(".cache/model-test-20261023", { recursive: true });
let browser;
const results = [];
try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch("http://127.0.0.1:43904/ai-coding-demo/")).ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({
    headless: true,
    args: ["--enable-unsafe-swiftshader"],
  });
  for (const base of [
    "http://127.0.0.1:43903/",
    "http://127.0.0.1:43904/ai-coding-demo/",
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base);
    await page.locator('[data-group="runs"]').click();
    await expect(page.locator("#project-grid .card")).toHaveCount(9);
    await page.locator("#load-more").click();
    await expect(page.locator("#project-grid .card")).toHaveCount(11);
    await page.locator("#model").selectOption("gpt-6-1-sol");
    await page.locator("#q").fill("电路");
    await expect(page.locator("#project-grid .card")).toHaveCount(1);
    await page.locator("#q").fill("");
    await page.locator("#advanced-filters summary").click();
    await page.locator("#sort").selectOption("title");
    const sorted = await page
      .locator("#project-grid .card h3")
      .allTextContents();
    expect(sorted).toEqual(
      [...sorted].sort((a, b) => a.localeCompare(b, "zh-CN")),
    );
    for (const run of data.runs) {
      expect(
        (await page.request.get(base + run.preview.pages[0].href)).status(),
      ).toBe(200);
      expect(
        (await page.request.get(base + run.directory + "/prompt.md")).status(),
      ).toBe(200);
    }
    const left = `pathfinding-lab--${runId}`,
      right = `circuit-lab--${runId}`;
    await page.goto(
      base + `compare.html?left=${left}&right=${right}&scope=all&related=0`,
    );
    await expect(page.locator("iframe")).toHaveCount(2);
    await expect(page.locator("#relation")).toContainText("跨主题");
    await page.locator('[data-unload="right"]').click();
    await expect(page.locator("iframe")).toHaveCount(1);
    await page.locator('[data-unload="right"]').click();
    await expect(page.locator("iframe")).toHaveCount(2);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("iframe")).toHaveCount(1);
    await page.locator('[data-mobile="right"]').click();
    await expect(page.locator("#panel-right iframe")).toHaveCount(1);
    await page.locator("#share").click();
    await expect(page.locator("#share-message")).not.toHaveText("");
    const share = page.url();
    await page.goto(share);
    await expect(page.locator("#panel-right iframe")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    // Same input, same task but changed input, unknown input and no-preview records
    // are isolated in an in-memory fixture, never written as experiment history.
    const fixture = structuredClone(data),
      a = fixture.runs.find((r) => r.id === left),
      b = structuredClone(a);
    b.id = "fixture--same";
    b.runId = "same";
    fixture.runs.push(b);
    await page.route("**/assets/generated/catalog.js", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body:
          "window.ARCHIVE=" +
          JSON.stringify(fixture).replace(/</g, "\\u003c") +
          ";",
      }),
    );
    async function relation(text) {
      await page.goto(
        base +
          `compare.html?left=${left}&right=fixture--same&scope=all&related=0`,
      );
      await expect(page.locator("#relation")).toContainText(text);
    }
    await relation("已记录的原始输入一致");
    b.raw += "\nFixture follow-up";
    b.rawHash = "different";
    await relation("任务正文一致");
    b.input.completeness = "unknown";
    await relation("输入信息不足");
    b.preview = {
      kind: "none",
      pages: [],
      defaultPage: null,
      embed: false,
      network: "unknown",
      externalUrl: null,
    };
    await page.goto(
      base +
        `compare.html?left=${left}&right=fixture--same&scope=all&related=0&mobile=right`,
    );
    await expect(page.locator("#panel-right iframe")).toHaveCount(0);
    await expect(page.locator("#panel-right")).toContainText(
      /无.*预览|没有.*预览/,
    );
    expect(errors).toEqual([]);
    results.push({
      base,
      homepage: true,
      filters: true,
      sort: true,
      loadMore: true,
      links: true,
      compareRelations: true,
      noPreview: true,
      shareRestore: true,
      mobileSingleFrame: true,
    });
    await page.close();
  }
  const page = await browser.newPage({
    viewport: { width: 1440, height: 980 },
  });
  await page.goto(
    "http://127.0.0.1:43903/previews/bluebook/" + runId + "/index.html",
  );
  await page.waitForSelector("article");
  await page.screenshot({
    path: ".cache/model-test-20261023/bluebook-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: ".cache/model-test-20261023/bluebook-mobile.png",
    fullPage: true,
  });
  await page.close();
  fs.writeFileSync(
    ".cache/model-test-20261023/experiment-site-20261023.json",
    JSON.stringify({ pass: true, results }, null, 2) + "\n",
  );
  console.log(JSON.stringify({ pass: true, results }));
} finally {
  await browser?.close();
  server.kill();
}
