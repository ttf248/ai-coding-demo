import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
const data = loadCatalog();

test("homepage covers use registered run screenshots and direct previews", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator("#guides")).not.toHaveAttribute("open");
  await expect(page.locator("#project-grid iframe")).toHaveCount(0);
  const topic = data.topics.find((t) => t.thumbnail);
  await page.locator("#q").fill(topic.title);
  const card = page.locator(".topic-card");
  await expect(card).toHaveCount(1);
  const source = await page.evaluate((topicId) => {
    const run = window.ARCHIVE.runs
      .filter((item) => item.topicId === topicId && item.screenshot)
      .sort(
        (a, b) =>
          (b.date || "").localeCompare(a.date || "") ||
          window.ArchiveUI.compareModelRuns(window.ARCHIVE, a, b),
      )[0];
    return {
      path: `${run.directory}/${run.screenshot}`,
      label:
        window.ArchiveUI.modelLabel(window.ARCHIVE, run) +
        " · " +
        window.ArchiveUI.effortLabel(run.effort),
    };
  }, topic.id);
  await expect(card.locator(".topic-cover img")).toHaveAttribute(
    "src",
    source.path,
  );
  expect(
    await card
      .locator(".topic-cover img")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  ).toBe(true);
  await expect(card.locator(".topic-cover figcaption")).toContainText(
    source.label,
  );
  await expect(card.locator(".latest-run")).toContainText("最新实验");
  const previewHref = await card.locator(".preview-link").getAttribute("href");
  expect(previewHref).toBeTruthy();
  const response = await page.request.get(previewHref);
  expect(response.ok()).toBe(true);
  const otherModel = data.models.find(
    (m) => m.id !== source.modelId && data.runs.some((r) => r.modelId === m.id),
  );
  await page.locator("#model").selectOption(otherModel.id);
  const filteredScreenshot = data.runs.find(
    (run) =>
      run.topicId === topic.id &&
      run.modelId === otherModel.id &&
      run.screenshot,
  );
  if (filteredScreenshot) {
    await expect(card.locator(".topic-cover img")).toHaveAttribute(
      "src",
      `${filteredScreenshot.directory}/${filteredScreenshot.screenshot}`,
    );
  } else {
    await expect(card.locator(".topic-cover")).toHaveCount(0);
  }
  await page.locator("nav a[href='#guides']").click();
  await expect(page.locator("#guides")).toHaveAttribute("open", "");
  await expect(page.locator("#guide-search")).toBeVisible();
});

test("recent update cards keep text within their bounds on desktop and mobile", async ({
  page,
}) => {
  await page.goto("./");
  const textOverflows = await page
    .locator("#recent-list a")
    .evaluateAll((links) =>
      links.some((link) => {
        const bounds = link.getBoundingClientRect();
        return [...link.querySelectorAll("span, strong, small, time")].some(
          (element) => element.getBoundingClientRect().right > bounds.right + 1,
        );
      }),
    );
  expect(textOverflows).toBe(false);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("active topic grouping shows a screenshot for every active topic", async ({
  page,
}) => {
  const topics = data.topics.filter(
    (topic) =>
      topic.testingStatus !== "archived" &&
      data.runs.some((run) => run.topicId === topic.id),
  );
  await page.goto("./?testing=active&sort=latest&group=topics&view=grid");
  while (await page.locator("#load-more").isVisible())
    await page.locator("#load-more").click();
  await expect(page.locator(".topic-card")).toHaveCount(topics.length);
  for (const topic of topics) {
    const card = page.locator(".topic-card").filter({
      has: page.locator(`h3 a[href="topic.html?id=${topic.id}"]`),
    });
    const expected = await page.evaluate((topicId) => {
      const run = window.ARCHIVE.runs
        .filter((item) => item.topicId === topicId && item.screenshot)
        .sort(
          (a, b) =>
            (b.date || "").localeCompare(a.date || "") ||
            window.ArchiveUI.compareModelRuns(window.ARCHIVE, a, b),
        )[0];
      return run ? `${run.directory}/${run.screenshot}` : null;
    }, topic.id);
    expect(
      expected,
      `Missing registered screenshot for ${topic.id}`,
    ).toBeTruthy();
    await expect(card.locator(".topic-cover img")).toHaveAttribute(
      "src",
      expected,
    );
    expect(
      await card
        .locator(".topic-cover img")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    ).toBe(true);
  }
});

test("run grouping shows registered screenshots on their own experiment cards", async ({
  page,
}) => {
  const expected = data.runs.filter((run) => {
    const topic = data.topics.find((item) => item.id === run.topicId);
    return topic?.testingStatus !== "archived" && run.screenshot;
  });
  await page.goto("./?testing=active&sort=latest&group=runs&view=grid");
  while (await page.locator("#load-more").isVisible())
    await page.locator("#load-more").click();
  await expect(page.locator(".run-card-screenshot")).toHaveCount(
    expected.length,
  );
  const urls = await page
    .locator(".run-card-screenshot img")
    .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  expect(new Set(urls).size).toBe(expected.length);
  for (const url of urls) expect((await page.request.get(url)).ok()).toBe(true);
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
