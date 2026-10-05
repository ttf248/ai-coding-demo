import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
import { updateTestingStatus } from "../../scripts/topic-lifecycle.mjs";
const data = loadCatalog();
test("archived baseline task remains readable with no historical experiments", async ({
  page,
}) => {
  await page.goto("topic.html?id=stock-watching");
  await expect(page.locator(".topic-testing-status")).toContainText("已归档");
  await expect(page.locator("#topic-testing-action")).toBeHidden();
  await page.locator(".topic-testing-history summary").click();
  await expect(page.locator(".topic-testing-history")).toContainText(
    "不再参与后续模型测试",
  );
  await page.locator(".prompt-library summary").first().click();
  await expect(page.locator(".prompt-library pre").first()).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("local baseline supports persisted topic lifecycle without importing previous answers", async ({
  page,
}) => {
  const fixture = structuredClone(data);
  const index = fixture.topics.findIndex((t) => t.id === "stock-watching");
  await page.route("**/assets/generated/catalog.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body:
        "window.ARCHIVE=" +
        JSON.stringify(fixture).replace(/</g, "\\u003c") +
        ";",
    }),
  );
  await page.route("**/__archive/capabilities", (route) =>
    route.fulfill({ json: { editable: true } }),
  );
  await page.route("**/__archive/topics/stock-watching", (route) => {
    const body = route.request().postDataJSON();
    fixture.topics[index] = updateTestingStatus(
      fixture.topics[index],
      body.status,
      body.reason,
      "2026-10-05",
    );
    return route.fulfill({ json: fixture.topics[index] });
  });
  await page.goto("topic.html?id=stock-watching");
  await page.locator("#topic-testing-action").click();
  await page.locator("#topic-testing-reason").fill("Fixture restore");
  await page.locator('#topic-testing-dialog [type="submit"]').click();
  await expect(page.locator("#topic-testing-action")).toHaveText("归档主题");
  await page.locator("#topic-testing-action").click();
  await page.locator("#topic-testing-reason").fill("Fixture archive");
  await page.locator('#topic-testing-dialog [type="submit"]').click();
  await expect(page.locator("#topic-testing-action")).toHaveText("恢复测试");
  expect(fixture.runs).toHaveLength(data.runs.length);
});
