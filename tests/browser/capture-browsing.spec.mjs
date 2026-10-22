import { test, expect } from "@playwright/test";
import { loadCatalog, readJSON } from "../../scripts/lib.mjs";
const catalog = loadCatalog(),
  run = catalog.runs.find(
    (r) => r.id === "circuit-lab--claude-opus-5-5-max-r01",
  ),
  frames = readJSON(run.score.captureManifest).frames;
const mobile = frames.find((f) => f.id === "mobile-initial"),
  next = catalog.runs.find((r) => r.id === "circuit-lab--gpt-6-1-sol-max-r01");

for (const width of [1440, 390]) {
  test(`capture collection browses mobile and original size without preloading all PNGs at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const pngs = [];
    page.on("request", (req) => {
      if (/\/captures\/.*\.png/.test(req.url())) pngs.push(req.url());
    });
    await page.goto("screenshots.html?run=" + run.id);
    await expect(page.locator("#captures-image")).toBeVisible();
    await expect(page.locator("#captures-frame option")).toHaveCount(
      frames.length,
    );
    await expect(page.locator("#captures-position")).toContainText(
      "共 " + frames.length + " 张",
    );
    expect(new Set(pngs).size).toBe(1);
    await page.locator("#captures-device").selectOption("mobile");
    await expect(page.locator("#captures-image")).toHaveAttribute(
      "src",
      mobile.file,
    );
    await expect(page.locator("#captures-original")).toHaveAttribute(
      "href",
      mobile.file,
    );
    await page.reload();
    await expect(page.locator("#captures-device")).toHaveValue("mobile");
    await expect(page.locator("#captures-frame")).toHaveValue(mobile.id);
    await page.locator('[data-capture-scale="actual"]').click();
    await expect(page.locator("#captures-stage")).toHaveAttribute(
      "data-scale",
      "actual",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.locator("#captures-compare")).toHaveAttribute(
      "href",
      new RegExp("leftCapture=" + mobile.id),
    );
  });
  test(`snapshot panels keep independent frame choices and restore them at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      "compare.html?left=" + run.id + "&right=" + next.id + "&tab=snapshot",
    );
    const before = await page.locator("#capture-right").inputValue();
    await page.locator("#capture-left").selectOption(mobile.id);
    await expect(page.locator("#panel-left .snapshot-preview")).toHaveAttribute(
      "href",
      mobile.file,
    );
    await expect(page.locator("#capture-right")).toHaveValue(before);
    await page.locator('[data-zoom-snapshot="left"]').click();
    await expect(page.locator("#screenshot-zoom-image")).toHaveAttribute(
      "src",
      mobile.file,
    );
    await page.locator("#screenshot-zoom-close").click();
    await page.reload();
    await expect(page.locator("#capture-left")).toHaveValue(mobile.id);
    if (width === 390)
      await expect(
        page.locator("#panel-right .snapshot-preview img"),
      ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("iframe")).toHaveCount(0);
  });
}

test("capture links are discoverable in topic, home preview and published reading pages", async ({
  page,
}) => {
  await page.goto("topic.html?id=circuit-lab&view=list");
  const row = page.locator("#run-" + run.id);
  await expect(row.locator(".topic-capture-link")).toHaveAttribute(
    "href",
    "screenshots.html?run=" + run.id,
  );
  await page.goto(
    "assets/generated/readers/" + run.document.replace(/\.md$/i, ".html"),
  );
  const readerLink = page.getByRole("link", { name: "浏览截图集 →" });
  await expect(readerLink).toBeVisible();
  const href = await readerLink.getAttribute("href");
  expect(
    (await page.request.get(new URL(href, page.url()).href)).status(),
  ).toBe(200);
  await page.goto("index.html?q=简化电路");
  await page.locator("[data-preview]").first().click();
  await expect(page.locator("#preview-collection")).toBeVisible();
  await expect(page.locator("#preview-collection")).toHaveAttribute(
    "href",
    /screenshots\.html\?run=circuit-lab/,
  );
});

test("capture browsing handles missing records, absent images and image retry", async ({
  page,
}) => {
  await page.goto("screenshots.html?run=missing");
  await expect(page.locator("#captures-status")).toContainText("没有找到");
  await expect(page.locator("#captures-image")).toBeHidden();
  await page.goto(
    "screenshots.html?run=stock-watching--claude-haiku-45-default-r01",
  );
  await expect(page.locator("#captures-status")).toContainText("没有所选取景");
  await expect(page.locator("#captures-compare")).toBeHidden();
  const pattern = /\/captures\/.*\.png(?:\?.*)?$/;
  await page.route(pattern, (route) =>
    route.fulfill({ status: 503, body: "Unavailable" }),
  );
  await page.goto("screenshots.html?run=" + run.id);
  await expect(page.locator("#captures-status")).toContainText("截图加载失败");
  await page.unroute(pattern);
  await page.locator("#captures-retry").click();
  await expect(page.locator("#captures-image")).toBeVisible();
  await expect(page.locator("#captures-retry")).toBeHidden();
});
