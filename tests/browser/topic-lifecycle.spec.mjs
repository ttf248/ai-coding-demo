import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
import { updateTestingStatus } from "../../scripts/topic-lifecycle.mjs";
const data = loadCatalog();
async function mockCatalog(page, fixture) {
  await page.route("**/assets/generated/catalog.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body:
        "window.ARCHIVE=" +
        JSON.stringify(fixture).replace(/</g, "\\u003c") +
        ";",
    }),
  );
}

test("archived topics are separately browsable and historical experiments remain comparable", async ({
  page,
}) => {
  const fixture = structuredClone(data);
  const index = fixture.topics.findIndex((t) => t.id === "bluebook");
  fixture.topics[index] = updateTestingStatus(
    fixture.topics[index],
    "archived",
    "This topic no longer needs reruns",
    "2026-10-05",
  );
  await mockCatalog(page, fixture);
  await page.goto("./");
  await expect(
    page.locator('.topic-card h3 a[href="topic.html?id=bluebook"]'),
  ).toHaveCount(0);
  await page.locator("#advanced-filters summary").click();
  await page.locator("#testing").selectOption("archived");
  await expect(page.locator(".topic-card")).toHaveCount(
    fixture.topics.filter(
      (t) =>
        t.testingStatus === "archived" &&
        fixture.runs.some((r) => r.topicId === t.id),
    ).length,
  );
  await expect(page.locator(".topic-card").first()).toContainText("已归档");
  await page.reload();
  await expect(page.locator("#testing")).toHaveValue("archived");
  await expect(page.locator("#advanced-filters")).toHaveAttribute("open", "");
  await page.locator('.topic-card h3 a[href="topic.html?id=bluebook"]').click();
  await expect(page.locator(".topic-testing-status")).toContainText(
    "不再参与后续测试",
  );
  await page.locator(".topic-testing-history summary").click();
  await expect(page.locator(".topic-testing-history")).toContainText(
    "This topic no longer needs reruns",
  );
  await expect(page.locator(".topic-run-row")).toHaveCount(
    data.runs.filter((r) => r.topicId === "bluebook").length,
  );
  await page.locator("#topic-list [data-compare]").first().click();
  await expect(page.locator(".selection-item")).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("compare.html?left=bluebook--gpt-6-1-sol-max-r01&tab=info");
  await expect(
    page.locator('#run-left option[value="bluebook--gpt-6-1-sol-max-r01"]'),
  ).toHaveCount(1);
});

test("local archive and restore forms persist status and retain history after reload", async ({
  page,
}) => {
  const fixture = structuredClone(data);
  const index = fixture.topics.findIndex((t) => t.id === "bluebook");
  fixture.topics[index] = {
    ...fixture.topics[index],
    testingStatus: "active",
    testingHistory: [],
  };
  await mockCatalog(page, fixture);
  await page.route("**/__archive/capabilities", (route) =>
    route.fulfill({ json: { editable: true } }),
  );
  const writes = [];
  await page.route("**/__archive/topics/bluebook", (route) => {
    const body = route.request().postDataJSON();
    writes.push(body);
    fixture.topics[index] = updateTestingStatus(
      fixture.topics[index],
      body.status,
      body.reason,
      "2026-10-05",
    );
    return route.fulfill({ json: fixture.topics[index] });
  });
  await page.goto("topic.html?id=bluebook");
  await page.locator("#topic-testing-action").click();
  await expect(page.locator("#topic-testing-dialog")).toBeVisible();
  await page.locator('#topic-testing-dialog [type="submit"]').click();
  expect(writes).toHaveLength(0);
  await page.locator("#topic-testing-reason").fill("不再进行模型重跑");
  await page.locator('#topic-testing-dialog [type="submit"]').click();
  await expect(page.locator("#topic-testing-action")).toHaveText("恢复测试");
  await expect(page.locator(".topic-testing-status")).toContainText("已归档");
  expect(writes[0]).toEqual({ status: "archived", reason: "不再进行模型重跑" });
  await page.locator("#topic-testing-action").click();
  await page.locator("#topic-testing-reason").fill("重新纳入模型实验");
  await page.locator('#topic-testing-dialog [type="submit"]').click();
  await expect(page.locator("#topic-testing-action")).toHaveText("归档主题");
  expect(fixture.topics[index].testingHistory).toHaveLength(2);
  await expect(page.locator(".topic-run-row")).toHaveCount(
    data.runs.filter((r) => r.topicId === "bluebook").length,
  );
});

test("read-only previews expose status without archive controls", async ({
  page,
}) => {
  await page.goto("topic.html?id=bluebook");
  await expect(page.locator(".topic-testing-status")).toContainText(
    "参与后续测试",
  );
  await expect(page.locator("#topic-testing-action")).toBeHidden();
});
