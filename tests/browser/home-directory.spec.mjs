import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
const data = loadCatalog();

test("homepage thumbnails preserve source labels, direct preview and filtered scope", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator("#guides")).not.toHaveAttribute("open");
  await expect(page.locator("#project-grid iframe")).toHaveCount(0);
  const topic = data.topics.find((t) => t.thumbnail);
  await page.locator("#q").fill(topic.title);
  const card = page.locator(".topic-card");
  await expect(card).toHaveCount(1);
  const source = data.runs.find((r) => r.id === topic.thumbnail.sourceRunId);
  await expect(card.locator(".topic-cover img")).toHaveAttribute(
    "src",
    topic.thumbnail.path,
  );
  expect(
    await card
      .locator(".topic-cover img")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  ).toBe(true);
  await expect(card.locator(".topic-cover figcaption")).toContainText(
    data.models.find((m) => m.id === source.modelId).label,
  );
  await expect(card.locator(".latest-run")).toContainText("最新实验");
  await expect(card.locator(".preview-link")).toHaveAttribute(
    "href",
    source.preview.pages[0].href,
  );
  const response = await page.request.get(source.preview.pages[0].href);
  expect(response.ok()).toBe(true);
  const otherModel = data.models.find(
    (m) => m.id !== source.modelId && data.runs.some((r) => r.modelId === m.id),
  );
  await page.locator("#model").selectOption(otherModel.id);
  await expect(page.locator(".topic-cover")).toHaveCount(0);
  await page.locator("nav a[href='#guides']").click();
  await expect(page.locator("#guides")).toHaveAttribute("open", "");
  await expect(page.locator("#guide-search")).toBeVisible();
});
test("homepage grid and list keep preview controls within a mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./?testing=active&sort=latest&group=topics&view=grid");
  for (const view of ["grid", "list"]) {
    await page.locator('[data-view="' + view + '"]').click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const card = page.locator(".topic-card").first();
    await expect(card.locator(".preview-link")).toBeVisible();
    await expect(card.locator(".latest-run strong")).not.toBeEmpty();
  }
  await page.reload();
  await expect(page.locator("#project-grid")).toHaveClass(/list/);
  await page.locator("#sort").selectOption("title");
  await page.reload();
  await expect(page.locator("#sort")).toHaveValue("title");
  await expect(page.locator("#advanced-filters")).not.toHaveAttribute("open");
});

test("homepage exposes archived topics and keeps its directory compact", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.locator("#project-grid")).not.toHaveClass(/list/);
  await expect(page.locator('[data-testing="archived"]')).toBeVisible();
  await expect(page.locator("#testing")).toBeHidden();
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
  while (await page.locator("#load-more").isVisible()) {
    await page.locator("#load-more").click();
  }
  await expect(page.locator(".topic-card")).toHaveCount(data.topics.length);
  await page.locator('[data-view="grid"]').click();
  await expect(page.locator("#project-grid")).not.toHaveClass(/list/);
  await page.locator('[data-view="list"]').click();
  while (await page.locator("#load-more").isVisible()) {
    await page.locator("#load-more").click();
  }
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
