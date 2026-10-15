import { test, expect } from "@playwright/test";
test("directory density, quick filters and grouped ledger restore from URL", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator('[data-view="compact"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const columns = await page
    .locator("#project-grid")
    .evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
    );
  expect(columns).toBe(3);
  await page.locator('[data-quick="screenshot"]').click();
  await page.locator('[data-quick="comparable"]').click();
  await page.reload();
  await expect(page.locator('[data-quick="screenshot"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const valid = await page.evaluate(() => {
    const d = window.ARCHIVE,
      u = window.ArchiveUI,
      r = u.filterRuns(d, {
        testing: "active",
        screenshot: "yes",
        comparable: "yes",
      });
    return r.every(
      (a) =>
        a.screenshot &&
        r.some(
          (b) =>
            a.modelId !== b.modelId &&
            u.promptFor(d, a).hash === u.promptFor(d, b).hash,
        ),
    );
  });
  expect(valid).toBe(true);
  await page.locator('[data-group="runs"]').click();
  await page.locator('[data-view="list"]').click();
  await page.locator("#run-grouping").check();
  await expect(page.locator(".run-group-title").first()).toBeVisible();
  await page.reload();
  await expect(page.locator("#run-grouping")).toBeChecked();
  await expect(page.locator("#advanced-filters")).not.toHaveAttribute("open");
  await page.locator(".run-card [data-compare]").first().click();
  expect(
    await page
      .locator(".run-card")
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).not.toBe("rgb(255, 255, 255)");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
test("returning to the directory marks the previously viewed case", async ({
  page,
}) => {
  await page.goto("./");
  const card = page.locator(".topic-card").nth(2);
  const id = await card.getAttribute("data-item");
  await card.locator("h3 a").click();
  await expect(page.locator("#topic-content")).toContainText("实验主题");
  await page.goBack();
  await expect(page.locator(`[data-item="${id}"]`)).toHaveClass(/last-visited/);
});
