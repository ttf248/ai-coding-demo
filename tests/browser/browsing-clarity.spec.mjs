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
