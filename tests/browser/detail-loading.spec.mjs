import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics|googletagmanager/, (route) =>
    route.abort(),
  );
});
const left = "circuit-lab--claude-opus-5-5-max-r01",
  right = "circuit-lab--gpt-6-1-sol-max-r01";
test("comparison fetches selected records and caches details while screenshots fetch one", async ({
  page,
}) => {
  const requests = [];
  page.on("request", (r) => {
    if (/generated\/(records|topics)\//.test(r.url())) requests.push(r.url());
  });
  await page.goto(`compare.html?left=${left}&right=${right}&tab=snapshot`);
  await expect(page.locator(".difference-summary")).toBeVisible();
  expect(requests).toHaveLength(2);
  expect(requests.every((url) => url.includes("/records/"))).toBe(true);
  await page.locator('[data-tab="conditions"]').click();
  await expect(page.locator("#conditions-view")).toBeVisible();
  await page.locator('[data-tab="snapshot"]').click();
  await expect(page.locator(".difference-summary")).toBeVisible();
  expect(requests).toHaveLength(2);
  requests.length = 0;
  await page.goto(`screenshots.html?run=${left}`);
  await expect(page.locator(".captures-stage img")).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0]).toContain(`/records/${left}.json`);
});
test("individual detail failure can be retried and missing slots remain usable", async ({
  page,
}) => {
  let fail = true;
  await page.route(`**/assets/generated/records/${left}.json`, (route) =>
    fail
      ? route.fulfill({ status: 503, body: "unavailable" })
      : route.continue(),
  );
  await page.goto(`compare.html?left=${left}&right=${right}&tab=snapshot`);
  await expect(page.locator("#data-retry")).toBeVisible();
  fail = false;
  await page.locator("#data-retry").click();
  await expect(page.locator(".difference-summary")).toBeVisible();
  await expect(page.locator("#data-retry")).toHaveCount(0);
});
