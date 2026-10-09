import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
const data = loadCatalog();

test("homepage exposes archived topics and keeps its directory compact", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.locator("#project-grid")).toHaveClass(/list/);
  await expect(page.locator('[data-testing="archived"]')).toBeVisible();
  await expect(page.locator("#testing")).toBeVisible();
  const first = page.locator(".topic-card").first();
  await expect(first).toBeVisible();
  expect((await first.boundingBox()).y).toBeLessThan(500);
  await page.locator('[data-testing="archived"]').click();
  await expect(page.locator(".topic-card")).toHaveCount(
    data.topics.filter((t) => t.testingStatus === "archived").length,
  );
  await expect(
    page.locator('.topic-card h3 a[href="topic.html?id=stock-watching"]'),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator('[data-testing="archived"]')).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.locator('[data-testing="all"]').click();
  if (data.topics.length > 9) {
    await page.locator("#load-more").click();
  }
  await expect(page.locator(".topic-card")).toHaveCount(data.topics.length);
  await page.locator('[data-view="grid"]').click();
  await expect(page.locator("#project-grid")).not.toHaveClass(/list/);
  await page.locator('[data-view="list"]').click();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator('.topic-card h3 a[href="topic.html?id=stock-watching"]')
    .click();
  await expect(page).toHaveURL(/topic.html\?id=stock-watching/);
  expect(errors).toEqual([]);
});
