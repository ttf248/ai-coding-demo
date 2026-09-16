import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
import { resolveLocal } from "../../scripts/lib.mjs";
import { pathToFileURL } from "node:url";
const data = loadCatalog();
const city = data.runs.filter((r) => r.topicId === "neo-gothic-tower-city");
const voxel = data.runs.filter((r) => r.topicId === "voxel-construction-site");
const blue = data.runs.filter((r) => r.topicId === "bluebook");
const url = (a, b, extra = "") =>
  `compare.html?left=${a.id}&right=${b.id}${extra}`;
test("directory counts, filters, sort, views, pagination and selection", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(page.locator("#project-grid .card")).toHaveCount(
    Math.min(9, data.topics.length),
  );
  await expect(page.locator("#stats")).toContainText(String(data.runs.length));
  await page.locator('[data-group="runs"]').click();
  await expect(page.locator("#project-grid .card")).toHaveCount(
    Math.min(9, data.runs.length),
  );
  await page.locator("#load-more").click();
  await expect(page.locator("#project-grid .card")).toHaveCount(
    Math.min(18, data.runs.length),
  );
  await page.locator("#q").fill("Astra");
  await expect(page.locator("#project-grid .card")).toHaveCount(
    Math.min(9, data.runs.filter((r) => r.modelId === "gpt-6-astra").length),
  );
  await page.locator("#model").selectOption("gpt-6-astra");
  await page.locator("#sort").selectOption("title");
  await page.locator('[data-view="list"]').click();
  await expect(page.locator("#project-grid")).toHaveClass(/list/);
  await page.locator("#category").selectOption("prompt");
  await expect(page.locator("#empty")).toBeVisible();
  await page.locator("#empty [data-reset]").click();
  await page.locator("#load-more").click();
  await page.locator("[data-compare]").nth(0).click();
  await page.locator("[data-compare]").nth(1).click();
  await page.locator("[data-compare]").nth(2).click();
  await expect(page.locator("#replace-dialog")).toBeVisible();
  await page.locator('[data-slot="0"]').click();
  await expect(page.locator("#compare-tray a")).toHaveAttribute(
    "href",
    /left=.*&right=/,
  );
  await page.locator("#guide-search").fill("typescript");
  await expect(page.locator(".guide")).toHaveCount(1);
  expect(errors).toEqual([]);
});
test("topic detail and prompt comparison restore URLs without executing demos", async ({
  page,
}) => {
  await page.goto("topic.html?id=voxel-construction-site");
  await expect(page.locator(".cards .card")).toHaveCount(voxel.length);
  await page.locator("summary").first().click();
  await expect(page.locator("details pre")).toContainText("InstancedMesh");
  await page.goto(url(voxel[0], voxel[1], "&tab=prompt&source=raw"));
  await expect(page.locator("#relation")).toContainText("任务正文一致");
  await expect(page.locator("del").first()).toBeVisible();
  await page.locator("#swap").click();
  await expect(page.locator("#run-left")).toHaveValue(voxel[1].id);
  await page.goBack();
  await expect(page.locator("#run-left")).toHaveValue(voxel[0].id);
  await page.reload();
  await expect(page.locator("#prompt-source")).toHaveValue("raw");
  await page.locator("#run-right").selectOption(city[0].id);
  await expect(page.locator("#relation")).toContainText("跨主题");
  await page.goto(url(city[0], city[1], "&tab=prompt"));
  await expect(page.locator("#relation")).toContainText("原始输入一致");
  await expect(page.locator("iframe")).toHaveCount(0);
});
test("live previews, equal viewports, unloading and single-side reload", async ({
  page,
}) => {
  await page.goto(url(blue[0], blue[1], "&viewport=mobile"));
  await expect(page.locator("iframe")).toHaveCount(2);
  await expect
    .poll(() =>
      page
        .locator("iframe")
        .first()
        .evaluate((f) => f.style.width),
    )
    .toBe("390px");
  const first = page.locator("#panel-left iframe");
  await first.evaluate((f) => (f.dataset.preserved = "yes"));
  await expect
    .poll(() =>
      first.evaluate(
        (f) => f.contentDocument?.querySelector("#root")?.children.length || 0,
      ),
    )
    .toBeGreaterThan(0);
  await first.evaluate((f) => (f.contentWindow.__archiveState = "kept"));
  await page.locator('[data-reload="right"]').click();
  await expect(first).toHaveAttribute("data-preserved", "yes");
  expect(await first.evaluate((f) => f.contentWindow.__archiveState)).toBe(
    "kept",
  );
  await page.locator("#viewport").selectOption("tablet");
  expect(await first.evaluate((f) => f.contentWindow.__archiveState)).toBe(
    "kept",
  );
  await page.locator('[data-unload="left"]').click();
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator('[data-unload="left"]').click();
  await expect(page.locator("iframe")).toHaveCount(2);
  await page.locator('[data-tab="info"]').click();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator("#panel-left")).toContainText("人工修改与部署适配");
});
test("missing, duplicate, no preview and invalid page are recoverable", async ({
  page,
}) => {
  await page.goto("compare.html?left=missing&right=also-missing");
  await expect(page.locator("#panel-left")).toContainText("实验不存在");
  await page.goto(url(city[0], city[0]));
  await expect(page.locator("#panel-right")).toContainText("请选择不同");
  const prompt = data.runs.find((r) => r.type === "prompt");
  await page.goto(url(prompt, blue[0], "&rightPage=not-a-page"));
  await expect(page.locator("#panel-left")).toContainText("没有可用静态预览");
  await expect(page.locator("#panel-right")).toContainText("没有可用静态预览");
  await page.locator("#page-right").selectOption(blue[0].preview.defaultPage);
  await expect(page.locator("#panel-right iframe")).toHaveCount(1);
});
test("mobile pages do not overflow and only active preview is mounted", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["./", "topic.html?id=bluebook", url(blue[0], blue[1])]) {
    await page.goto(path);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator('[data-mobile="right"]').click();
  await expect(page.locator("#panel-left")).toBeHidden();
  await expect(page.locator("#panel-right iframe")).toHaveCount(1);
  await page.screenshot({
    path: `test-results/mobile-compare-${test.info().project.name}.png`,
    fullPage: true,
  });
});
test("module selection, sharing, missing HTTP preview and external fallback", async ({
  page,
  context,
}) => {
  const multi = data.runs.find((r) => r.preview.pages.length > 1);
  await page.goto(url(multi, blue[0], "&tab=info"));
  await page.locator("#page-left").selectOption(multi.preview.pages[1].id);
  await expect(page).toHaveURL(
    new RegExp("leftPage=" + multi.preview.pages[1].id),
  );
  await page.reload();
  await expect(page.locator("#page-left")).toHaveValue(
    multi.preview.pages[1].id,
  );
  await page.locator("#share").click();
  await expect(page.locator("#share-message")).toContainText(/已复制|请复制/);
  const preview = blue[0].preview.pages[0].href;
  await page.route("**/" + preview, (route) =>
    route.fulfill({ status: 404, body: "Missing" }),
  );
  await page.goto(url(blue[0], blue[1]));
  await expect(page.locator("#panel-left")).toContainText("预览文件不可用");
  const fixture = structuredClone(data),
    external = fixture.runs.find((r) => r.type === "prompt");
  external.preview = {
    kind: "external",
    pages: [],
    defaultPage: null,
    network: "required",
    embed: false,
    externalUrl: "https://example.com/",
  };
  await page.route("**/assets/generated/catalog.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "window.ARCHIVE=" + JSON.stringify(fixture),
    }),
  );
  await page.goto(url(external, blue[1]));
  await expect(page.locator("#panel-left")).toContainText("请独立打开");
  await expect(page.locator("#panel-left iframe")).toHaveCount(0);
  await expect(
    page.locator("#panel-left .panel-actions a").first(),
  ).toHaveAttribute("href", "https://example.com/");
});
test("single HTML entries remain directly openable", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "root",
    "File URLs are independent of hosting prefix",
  );
  for (const r of data.runs.filter(
    (r) => r.type === "single-html" && r.preview.kind === "static",
  )) {
    await page.goto(pathToFileURL(resolveLocal(r.preview.pages[0].href)).href, {
      waitUntil: "domcontentloaded",
    });
    expect(await page.locator("body").innerHTML()).not.toBe("");
    await expect(page.locator("canvas").first()).toBeAttached();
  }
});
test("desktop catalog screenshot", async ({ page }, testInfo) => {
  await page.goto("./");
  await expect(page.locator(".topic-card").first()).toBeVisible();
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
test("all catalog targets and published app assets are accessible", async ({
  request,
  baseURL,
}) => {
  const base = baseURL.endsWith("/") ? baseURL : baseURL + "/";
  const targets = new Set(
    data.runs
      .flatMap((r) => [
        r.document,
        `${r.directory}/prompt.md`,
        ...r.preview.pages.map((p) => p.href),
      ])
      .concat(data.guides.flatMap((g) => [g.document, g.example])),
  );
  for (const target of targets) {
    const response = await request.get(new URL(target, base).href);
    expect(response.status(), target).toBe(200);
  }
  for (const r of blue) {
    const entry = new URL(r.preview.pages[0].href, base),
      response = await request.get(entry.href),
      html = await response.text();
    for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      if (/^(https?:|data:)/.test(match[1])) continue;
      expect(
        (await request.get(new URL(match[1], entry).href)).status(),
        match[1],
      ).toBe(200);
    }
    expect(
      (await request.get(new URL("images/1.jpg", entry).href)).status(),
    ).toBe(200);
  }
});
test("built apps render their local images under the configured base", async ({
  page,
  baseURL,
}) => {
  for (const r of blue) {
    const failures = [];
    const watch = (res) => {
      if (res.url().startsWith(baseURL) && res.status() >= 400)
        failures.push(res.url());
    };
    page.on("response", watch);
    await page.goto(r.preview.pages[0].href);
    await expect
      .poll(
        () =>
          page
            .locator("img")
            .evaluateAll(
              (imgs) =>
                imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
            ),
        { timeout: 20000 },
      )
      .toBeGreaterThan(0);
    expect(failures).toEqual([]);
    page.off("response", watch);
  }
});
