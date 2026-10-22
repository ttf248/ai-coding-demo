import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics|googletagmanager/, (route) =>
    route.abort(),
  );
});
test("saved comparisons restore their exact views and notes stay local across reloads", async ({
  page,
}) => {
  const left = "circuit-lab--claude-opus-5-5-max-r01",
    right = "circuit-lab--gpt-6-1-sol-max-r01";
  await page.goto(
    `compare.html?left=${left}&right=${right}&tab=snapshot&viewport=mobile&leftCapture=mobile-initial`,
  );
  await expect(page.locator(".difference-summary")).toBeVisible();
  await page.locator("#save-comparison").click();
  await expect(page.locator("#notebook-status")).toContainText("已保存");
  await page.goto("library.html");
  await expect(page.locator(".saved-item")).toHaveCount(1);
  const note = "<script>private note</script> 比较移动布局";
  await page.locator(".saved-item textarea").fill(note);
  await page.locator('.saved-item button[type="submit"]').click();
  await expect(page.locator("#notebook-status")).toContainText("备注已保存");
  await page.reload();
  await expect(page.locator(".saved-item textarea")).toHaveValue(note);
  await expect(page.locator(".saved-item script")).toHaveCount(0);
  expect(
    await page.evaluate(() => JSON.stringify(window.dataLayer)),
  ).not.toContain("private note");
  await page.locator(".saved-item h3 a").click();
  await expect(page.locator('[data-tab="snapshot"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(new URL(page.url()).searchParams.get("leftCapture")).toBe(
    "mobile-initial",
  );
  await page.goto("index.html");
  await expect(page.locator("#continue-browsing")).toBeVisible();
  await page.locator(".cover-preview").first().click();
  await page.locator("#save-preview").click();
  await page.goto("library.html");
  await expect(page.locator(".saved-item")).toHaveCount(2);
  await page.locator(".saved-item h3 a").first().click();
  await expect(page).toHaveURL(/assets\/generated\/readers\//);
  await page.goBack();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#update-kind").selectOption("capture");
  await expect(page.locator(".archive-update").first()).toContainText(
    "截图采集 / 补拍",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.locator("#clear-recent").click();
  await expect(page.locator("#recent-items")).toContainText("还没有最近浏览");
  await expect(page.locator(".saved-item")).toHaveCount(2);
  await page.locator("[data-remove-saved]").first().click();
  await expect(page.locator(".saved-item")).toHaveCount(1);
});

test("saving a topic shortcut records the resolved pair and default captures", async ({
  page,
}) => {
  await page.goto("compare.html?group=circuit-lab/v1&tab=snapshot");
  await expect(page.locator(".difference-summary")).toBeVisible();
  await page.locator("#save-comparison").click();
  await page.goto("library.html");
  const href = await page.locator(".saved-item h3 a").getAttribute("href");
  const params = new URL(href, "https://example.test").searchParams;
  expect(params.get("left")).toBeTruthy();
  expect(params.get("right")).toBeTruthy();
  expect(params.get("left")).not.toBe(params.get("right"));
  expect(params.get("leftCapture")).toBeTruthy();
  expect(params.get("rightCapture")).toBeTruthy();
});
test("unavailable storage reports failure while preview and browsing continue", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new Error("storage disabled");
    };
  });
  await page.goto("index.html");
  await page.locator(".cover-preview").first().click();
  await page.locator("#save-preview").click();
  await expect(page.locator("#notebook-status")).toContainText("尚未保存");
  await expect(page.locator("#preview-stage img")).toBeVisible();
});
test("corrupt local notes are preserved and the activity feed can retry", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("archive-notebook-v1", "{broken"),
  );
  let fail = true;
  await page.route("**/assets/generated/updates.json", (route) =>
    fail ? route.fulfill({ status: 503, body: "failed" }) : route.continue(),
  );
  await page.goto("library.html");
  await expect(page.locator("#notebook-status")).toContainText(
    "已保留原存储内容",
  );
  await expect(page.locator("#update-items")).toContainText("暂时无法加载");
  fail = false;
  await page.locator("#update-items button").click();
  await expect(page.locator(".archive-update").first()).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("archive-notebook-v1")),
  ).toBe("{broken");
});
