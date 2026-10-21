import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics|googletagmanager/, (route) =>
    route.abort(),
  );
});

test("home states sorting, count units and the exact comparison target", async ({
  page,
}) => {
  await page.goto("index.html");
  await expect(page.locator("#sort-context")).toHaveText(
    "主题按任务复杂度排列",
  );
  await expect(page.locator("#category option").first()).toContainText(
    "条实验",
  );
  const card = page.locator(".topic-card").first();
  await expect(card.locator(".card-badges")).toContainText("复杂度");
  const target = await card
    .locator("[data-screenshot-run]")
    .getAttribute("data-screenshot-run");
  const button = card.locator("[data-compare]");
  await expect(button).toHaveAttribute("data-compare", target);
  await expect(button).toHaveText("对比此实验");
  await expect(button).toHaveAttribute("title", /v\d/);
  await button.click();
  await expect(button).toHaveText("移出对比");
  await page.locator('[data-group="runs"]').click();
  await expect(page.locator("#sort-context")).toBeHidden();
});

test("conditions distinguish missing information from equal known conditions", async ({
  page,
}) => {
  await page.goto(
    "compare.html?left=bluebook--claude-opus-5-5-max-r01&right=bluebook--gpt-6-astra-max-r01&tab=conditions",
  );
  await expect(page.locator("#conditions-notice")).toContainText(
    "两侧均未记录表示信息缺失",
  );
  await page.locator("#differences-only").check();
  await expect(page).toHaveURL(/differencesOnly=1/);
});

test("mobile conditions show A and B by field and preserve the quad table", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "compare.html?left=bluebook--claude-opus-5-5-max-r01&right=bluebook--gpt-6-astra-max-r01&tab=conditions",
  );
  await expect(page.locator("#conditions-mobile")).toBeVisible();
  await expect(page.locator("#conditions-table")).toBeHidden();
  await expect(page.locator(".condition-section")).toHaveCount(3);
  const identity = page
    .locator(".condition-field")
    .filter({ has: page.locator("h3", { hasText: /^模型$/ }) });
  await expect(identity).toContainText("Claude Opus 5.5");
  await expect(identity).toContainText("GPT-6 Astra");
  await expect(page.locator(".condition-section").last()).not.toHaveAttribute(
    "open",
  );
  await page.locator("#differences-only").check();
  await expect(
    page.locator(".condition-field h3", { hasText: /^主题$/ }),
  ).toHaveCount(0);
  await page.goto(
    "compare.html?left=bluebook--claude-opus-5-5-max-r01&right=bluebook--gpt-6-astra-max-r01&tab=conditions&layout=quad",
  );
  await expect(page.locator("#conditions-mobile")).toBeHidden();
  await expect(page.locator("#conditions-table")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("topic selection shows the relation to the selected baseline", async ({
  page,
}) => {
  await page.goto("topic.html?id=bluebook&prompt=v2");
  const row = page.locator(".topic-run-row").first();
  await expect(row.locator("[data-relation-run]")).toBeHidden();
  await row.locator("[data-compare]").click();
  await expect(row.locator("[data-relation-run]")).toHaveText("当前比较基准");
  await expect(
    page.locator(".topic-run-row").nth(1).locator("[data-relation-run]"),
  ).toContainText("与已选基准");
  await row.locator("[data-compare]").click();
  await expect(row.locator("[data-relation-run]")).toBeHidden();
});

test("reader summary precedes the historical text and returns to its mobile contents", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "assets/generated/readers/demos/bluebook/runs/claude-opus-5-5-max-r01/Readme.html",
  );
  const summary = page.locator(".document-summary");
  await expect(summary).toContainText("Claude Opus 5.5");
  await expect(summary).toContainText("输入留存不完整");
  await expect(summary.locator("a")).toHaveAttribute("href", /prompt\.md$/);
  expect(
    await summary.evaluate(
      (el) =>
        el.compareDocumentPosition(
          document.querySelector(".document-content"),
        ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ),
  ).toBeTruthy();
  await page.locator(".document-toc-return").click();
  await expect(page.locator(".document-sidebar details")).toHaveAttribute(
    "open",
    "",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("home builds only the visible cards while keeping complete counts", async ({
  page,
}) => {
  await page.route("**/assets/core.js", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body:
        (await response.text()) +
        `;window.cardBuilds=0;const originalCard=window.ArchiveUI.runCard;window.ArchiveUI.runCard=(...args)=>{window.cardBuilds++;return originalCard(...args)};`,
    });
  });
  await page.goto("index.html?group=runs&testing=all");
  await expect(page.locator(".run-card")).toHaveCount(9);
  expect(await page.evaluate(() => window.cardBuilds)).toBe(9);
  const total = await page.evaluate(() => window.ARCHIVE.runs.length);
  await expect(page.locator("#result-count")).toContainText(
    `${total} 条匹配记录`,
  );
  await page.locator("#load-more").click();
  await expect(page.locator(".run-card")).toHaveCount(18);
  expect(await page.evaluate(() => window.cardBuilds)).toBe(27);
});

test("guide navigation uses catalog network data and reports metadata failures", async ({
  page,
}) => {
  await page.goto("docs/tailwindcss/what-is-tailwindcss-demo.html");
  await expect(page.locator(".guide-sitebar")).toContainText("可离线运行");
  await page.route("**/assets/generated/guides.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'window.ARCHIVE_GUIDES=[{slug:"tailwindcss",network:"required"}];',
    }),
  );
  await page.reload();
  await expect(page.locator(".guide-sitebar")).toContainText(
    "外部资源需要联网",
  );
  await page.unroute("**/assets/generated/guides.js");
  await page.route("**/assets/generated/guides.js", (route) => route.abort());
  await page.reload();
  await expect(page.locator(".guide-sitebar")).toContainText("联网要求未载入");
});

test("404 migration results show readable identity and keep the stable target", async ({
  page,
  baseURL,
}) => {
  const migrations = await (
    await page.request.get("assets/generated/migrations.js")
  ).text();
  const entry = JSON.parse(
    migrations.split(" = ")[1].trim().replace(/;$/, ""),
  )[0];
  await page.route("**/old-missing/**", async (route) =>
    route.fulfill({
      contentType: "text/html",
      body: await (await page.request.get("404.html")).text(),
    }),
  );
  await page.goto(
    new URL(`old-missing/${entry.oldPath}/index.html`, baseURL).href,
  );
  await expect(page.locator("#migration-match")).toContainText(entry.label);
  await expect(page.locator("#migration-match")).toContainText(entry.id);
  await expect(page.locator("#migration-match a").first()).toHaveAttribute(
    "href",
    new RegExp(encodeURIComponent(entry.id)),
  );
  await page.goto("404.html");
  await expect(page.locator("#missing-title")).toHaveText("未找到这个页面。");
});
