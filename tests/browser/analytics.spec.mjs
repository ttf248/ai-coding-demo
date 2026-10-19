import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
import { readerPath } from "../../scripts/site-output.mjs";

const catalog = loadCatalog();
const googleTagURL = "https://www.googletagmanager.com/gtag/js?id=G-8E54P1HX3G";

test("public pages and generated readers load the shared analytics script", async ({
  page,
  baseURL,
}) => {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url === googleTagURL)
      return route.fulfill({
        contentType: "text/javascript",
        body: "window.googleTagLoaded = true;",
      });
    return new URL(url).origin === new URL(baseURL).origin
      ? route.continue()
      : route.abort();
  });
  const paths = [
    "index.html",
    "topic.html?id=circuit-lab",
    "compare.html",
    "404.html",
    ...catalog.guides.map((guide) => guide.example),
    readerPath(catalog.runs[0].document),
    readerPath("docs/maintenance.md"),
  ];
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response.ok(), path).toBe(true);
    const reference = page.locator('head script[src$="analytics.js"]');
    await expect(reference).toHaveCount(1);
    await expect(reference).toHaveAttribute("defer", "");
    expect(await reference.evaluate((script) => script.src)).toBe(
      new URL("assets/analytics.js", baseURL).href,
    );
    await expect
      .poll(() => page.evaluate(() => window.googleTagLoaded))
      .toBe(true);
    await expect(
      page.locator('head script[src*="googletagmanager.com/gtag/js"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('head script[src*="googletagmanager.com/gtag/js"]'),
    ).toHaveJSProperty("async", true);
    expect(
      await page.evaluate(() =>
        window.dataLayer.map((args) => [
          args[0],
          args[1] instanceof Date ? "date" : args[1],
        ]),
      ),
      path,
    ).toEqual([
      ["js", "date"],
      ["config", "G-8E54P1HX3G"],
    ]);
  }
});

test("duplicate imports initialize once and tracking failure preserves the page", async ({
  page,
  baseURL,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let loads = 0;
  await page.route(googleTagURL, (route) => {
    loads++;
    return route.abort();
  });
  await page.addInitScript(() => {
    window.dataLayer = [{ event: "existing" }];
  });
  await page.goto("index.html");
  await expect(page.locator("#result-count")).not.toBeEmpty();
  await page.addScriptTag({
    url: new URL("assets/analytics.js", baseURL).href,
  });
  expect(await page.evaluate(() => window.dataLayer.length)).toBe(3);
  expect(await page.evaluate(() => window.dataLayer[0])).toEqual({
    event: "existing",
  });
  expect(loads).toBe(1);
  await page.locator("#q").fill("简化电路实验台");
  await expect(page.locator("#result-count")).toContainText("1 个主题");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  expect(errors).toEqual([]);
});
