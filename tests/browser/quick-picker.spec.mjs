import { test, expect } from "@playwright/test";
test("quick picker restores prompt and sorting, supports selection and mobile layout", async ({
  page,
}) => {
  await page.goto("./");
  const trigger = page.locator("[data-pick-topic]").first();
  await trigger.click();
  await expect(page.locator("#quick-picker")).toBeVisible();
  await expect(page.locator(".quick-candidate").first()).toBeVisible();
  await page.locator("#quick-sort").selectOption("recent");
  const prompt = await page.locator("#quick-prompt").inputValue();
  await page.reload();
  await expect(page.locator("#quick-picker")).toBeVisible();
  await expect(page.locator("#quick-prompt")).toHaveValue(prompt);
  await expect(page.locator("#quick-sort")).toHaveValue("recent");
  await page.locator(".quick-candidate [data-compare]").first().click();
  await expect(page.locator("#quick-selection")).toContainText("1/4");
  await expect(page.locator("#quick-start")).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  expect(
    await page
      .locator("#quick-picker")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.locator("#quick-picker")).not.toBeVisible();
  expect(new URL(page.url()).searchParams.has("pick")).toBe(false);
});
