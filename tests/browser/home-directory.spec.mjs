import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
const data = loadCatalog();

test("insufficient screenshot evidence remains visible without a numeric score", async ({
  page,
}) => {
  const run = data.runs.find((item) => item.score.status === "insufficient");
  const topic = data.topics.find((item) => item.id === run.topicId);
  const query = new URLSearchParams({
    group: "runs",
    testing: "all",
    model: run.modelId,
    q: topic.title,
  });
  await page.goto("./?" + query);
  const screenshot = page.locator(`[data-screenshot-run="${run.id}"]`);
  const card = page.locator(".run-card").filter({ has: screenshot });
  await expect(card).toHaveCount(1);
  await expect(card.locator(".score-chip")).toHaveText("证据不足");
  await expect(card.locator(".score-chip")).toHaveAttribute(
    "title",
    run.score.evidence,
  );
  await expect(screenshot.locator("img")).toHaveAttribute(
    "data-original",
    `${run.directory}/${run.screenshot}`,
  );
  const selected = await page.evaluate((topicId) => {
    const candidates = window.ARCHIVE.runs.filter(
      (item) => item.topicId === topicId,
    );
    return window.ArchiveUI.bestScoredRun(candidates)?.score.status;
  }, topic.id);
  expect(selected).toBe("rated");
});

test("experiment list defaults to screenshot score and keeps actions on one line", async ({
  page,
}) => {
  await page.goto("./?group=runs&view=list&testing=all");
  await expect(page.locator("#sort")).toHaveValue("score");
  // 默认按截图评分降序，与主题页口径一致。
  const scores = await page
    .locator("#project-grid .run-list-score")
    .evaluateAll((nodes) =>
      nodes.map((node) => Number(node.textContent.replace(/[^\d]/g, ""))),
    );
  expect(scores.length).toBeGreaterThan(3);
  expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  // 三个操作按钮在同一行（按垂直中心判断，避免按钮高度不同造成误判）。
  const centers = await page
    .locator("#project-grid .run-card")
    .first()
    .locator(".card-actions :is(a, button)")
    .evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return Math.round(r.top + r.height / 2);
      }),
    );
  expect(centers.length).toBe(3);
  expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(8);
  // 列表头与实际列对应：缩略图单独成列，作品列带主题名。
  await expect(page.locator(".run-list-heading span").first()).toHaveText(
    "截图",
  );
  await expect(
    page.locator("#project-grid .run-card .run-topic").first(),
  ).not.toBeEmpty();
});
test("homepage exposes grouped semantics, a valid heading order and no chatty live regions", async ({
  page,
}) => {
  await page.goto("./");
  // 分组容器带可访问名称，aria-label 不再落在 role=generic 上。
  await expect(page.getByRole("list", { name: "实验统计" })).toHaveCount(1);
  await expect(page.getByRole("group", { name: "快捷筛选" })).toHaveCount(1);
  await expect(page.getByRole("group", { name: "目录视图" })).toHaveCount(1);
  // 标题层级不跳级。
  const levels = await page.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((heading) =>
      Number(heading.tagName.slice(1)),
    ),
  );
  expect(levels[0]).toBe(1);
  for (let i = 1; i < levels.length; i += 1) {
    expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  }
  // 正常渲染不产生实时区域。
  await expect(page.locator('#project-grid [role="status"]')).toHaveCount(0);
  await expect(page.locator("#result-count")).toHaveAttribute("role", "status");
});
test("homepage covers pick the variant that matches the displayed size", async ({
  page,
}) => {
  // 紧凑视图在 1440px 下封面约 400px 宽，取 480w 即可；大图视图铺满两列取 960w。
  await page.goto("./?view=compact");
  const compact = page.locator("#project-grid .topic-cover img").first();
  await expect(compact).toHaveAttribute("srcset", /240w.*480w.*960w/);
  await expect(compact).toHaveAttribute("sizes", /400px/);
  expect(await compact.evaluate((img) => img.currentSrc)).toMatch(/-480\.webp$/);

  await page.goto("./?view=grid");
  const grid = page.locator("#project-grid .topic-cover img").first();
  await expect(grid).toHaveAttribute("sizes", /610px/);
  expect(await grid.evaluate((img) => img.currentSrc)).toMatch(/-960\.webp$/);

  await page.goto("./?group=runs&view=list");
  const ledger = page.locator("#project-grid .run-card-screenshot img").first();
  await expect(ledger).toHaveAttribute("sizes", /88px/);
  expect(await ledger.evaluate((img) => img.currentSrc)).toMatch(/-240\.webp$/);

  // 主题列表与实验账本是两套槽位：主题列表在桌面上铺到 224px，
  // 声明成账位的 88px 会让浏览器按更窄的宽度选图。
  await page.goto("./?view=list");
  const list = page.locator("#project-grid .topic-cover img").first();
  await expect(list).toHaveAttribute("sizes", /224px/);
  const listWidth = await list.evaluate((img) => img.getBoundingClientRect().width);
  expect(Math.round(listWidth)).toBe(224);
  expect(await list.evaluate((img) => img.currentSrc)).toMatch(/-240\.webp$/);
});
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
      .sort(window.ArchiveUI.compareRunScores)[0];
    return {
      path: `${run.directory}/${run.screenshot}`,
      modelId: run.modelId,
      label: window.ArchiveUI.modelLabel(window.ARCHIVE, run),
    };
  }, topic.id);
  await expect(card.locator(".topic-cover img")).toHaveAttribute(
    "data-original",
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
  await expect(card.locator(".latest-run")).toContainText("当前筛选代表截图");
  const previewHref = await card.locator(".preview-link").getAttribute("href");
  expect(previewHref).toBeTruthy();
  const response = await page.request.get(previewHref);
  expect(response.ok()).toBe(true);
  const otherModel = data.models.find(
    (m) =>
      m.id !== source.modelId &&
      data.runs.some((r) => r.modelId === m.id && r.topicId === topic.id),
  );
  await openHomeControls(page);
  await page.locator("#model").selectOption(otherModel.id);
  const filteredScreenshot = await page.evaluate(
    ({ topicId, modelId }) =>
      window.ARCHIVE.runs
        .filter(
          (run) =>
            run.topicId === topicId &&
            run.modelId === modelId &&
            run.screenshot,
        )
        .sort(window.ArchiveUI.compareRunScores)[0],
    { topicId: topic.id, modelId: otherModel.id },
  );
  if (filteredScreenshot) {
    await expect(card.locator(".topic-cover img")).toHaveAttribute(
      "data-original",
      `${filteredScreenshot.directory}/${filteredScreenshot.screenshot}`,
    );
  } else {
    await expect(card.locator(".topic-cover")).toHaveCount(0);
    await expect(card.locator(".topic-placeholder")).toContainText("暂无截图");
  }
  await page.locator("nav a[href='#guides']").click();
  await expect(page.locator("#guides")).toHaveAttribute("open", "");
  await expect(page.locator("#guide-search")).toBeVisible();
});

test("homepage sorts by task complexity and shows each topic's highest-rated record", async ({
  page,
}) => {
  const activeTopics = data.topics.filter(
    (topic) =>
      topic.testingStatus !== "archived" &&
      data.runs.some((run) => run.topicId === topic.id),
  );
  const latestDate = (topicId) =>
    data.runs
      .filter((run) => run.topicId === topicId)
      .reduce((date, run) => ((run.date || "") > date ? run.date : date), "");
  const firstTopic = [...activeTopics].sort(
    (a, b) =>
      (b.complexity?.level || 0) - (a.complexity?.level || 0) ||
      latestDate(b.id).localeCompare(latestDate(a.id)) ||
      a.id.localeCompare(b.id),
  )[0];
  const top = data.runs
    .filter(
      (run) => run.topicId === firstTopic.id && run.score.status === "rated",
    )
    .sort(
      (a, b) =>
        b.score.total - a.score.total ||
        (b.date || "").localeCompare(a.date || "") ||
        a.id.localeCompare(b.id, "en"),
    )[0];
  await page.goto("./");
  const first = page.locator(".topic-card").first();
  await expect(page.locator("#sort")).toHaveValue("complexity");
  await expect(
    first.locator(`h3 a[href="topic.html?id=${firstTopic.id}"]`),
  ).toHaveCount(1);
  await expect(first.locator(".topic-cover")).toHaveAttribute(
    "data-screenshot-run",
    top.id,
  );
  await expect(first.locator(".score-chip").first()).toHaveText(
    `截图评分 ${top.score.total}`,
  );
  await expect(first.locator(".topic-cover img")).toHaveAttribute(
    "data-original",
    `${top.directory}/${top.screenshot}`,
  );
  const href =
    top.preview.kind === "external"
      ? top.preview.externalUrl
      : top.preview.pages?.find((page) => page.id === top.preview.defaultPage)
          ?.href || null;
  if (href) {
    await expect(first.locator(".preview-link")).toHaveAttribute("href", href);
  } else {
    await expect(first.locator(".preview-link")).toHaveCount(0);
  }
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
  // 两列排布：每条记录不再横跨整个容器，日期紧贴条目右缘。
  const layout = await page.evaluate(() => {
    const list = document.querySelector("#recent-list");
    const items = [...list.querySelectorAll("a")];
    const first = items[0].getBoundingClientRect();
    const time = items[0].querySelector("time").getBoundingClientRect();
    return {
      columns: getComputedStyle(list).gridTemplateColumns.split(" ").length,
      count: items.length,
      itemWidth: Math.round(first.width),
      dateGap: Math.round(first.right - time.right),
    };
  });
  expect(layout.columns).toBe(2);
  expect(layout.count).toBe(5);
  expect(layout.itemWidth).toBeLessThan(700);
  expect(Math.abs(layout.dateGap)).toBeLessThan(24);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () =>
        getComputedStyle(document.querySelector("#recent-list"))
          .gridTemplateColumns.split(" ")
          .length,
    ),
  ).toBe(1);
});

test("active topic grouping shows a screenshot for every active topic", async ({
  page,
}) => {
  const topics = data.topics.filter(
    (topic) =>
      topic.testingStatus !== "archived" &&
      data.runs.some((run) => run.topicId === topic.id),
  );
  await page.goto("./?testing=active&sort=complexity&group=topics&view=grid");
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
        .sort(window.ArchiveUI.compareRunScores)[0];
      return run ? `${run.directory}/${run.screenshot}` : null;
    }, topic.id);
    expect(
      expected,
      `Missing registered screenshot for ${topic.id}`,
    ).toBeTruthy();
    await expect(card.locator(".topic-cover img")).toHaveAttribute(
      "data-original",
      expected,
    );
    await card.locator(".topic-cover img").scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        card
          .locator(".topic-cover img")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
      )
      .toBe(true);
  }
});

test("run grouping shows registered screenshots on their own experiment cards", async ({
  page,
}) => {
  const expected = data.runs.filter((run) => {
    const topic = data.topics.find((item) => item.id === run.topicId);
    return topic?.testingStatus !== "archived" && run.screenshot;
  });
  await page.goto("./?testing=active&sort=score&group=runs&view=grid");
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
  await page.goto("./?testing=active&sort=complexity&group=topics&view=grid");
  for (const view of ["grid", "list"]) {
    await openHomeControls(page);
    await page.locator('[data-view="' + view + '"]').click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const card = page.locator(".topic-card").first();
    await expect(card.locator(".preview-link")).toBeVisible();
    await card.locator(".experiment-info > summary").click();
    await expect(card.locator(".latest-run strong")).not.toBeEmpty();
  }
  await page.reload();
  await expect(page.locator("#project-grid")).toHaveClass(/list/);
  await page.locator('[data-group="runs"]').click();
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
  await openHomeControls(page);
  await page.locator('[data-view="grid"]').click();
  await expect(page.locator("#project-grid")).not.toHaveClass(/list/);
  await openHomeControls(page);
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

async function openHomeControls(page) {
  const toggle = page.locator("#mobile-filter-toggle");
  if (
    (await toggle.isVisible()) &&
    (await toggle.getAttribute("aria-expanded")) === "false"
  )
    await toggle.click();
  if ((await page.locator("#advanced-filters").getAttribute("open")) === null)
    await page.locator("#advanced-filters > summary").click();
}

test("gallery prioritizes artwork and reveals metadata and navigation on demand", async ({
  page,
}) => {
  await page.goto("./?testing=active&sort=complexity&group=topics&view=grid");
  const first = page.locator(".topic-card").first();
  expect((await first.boundingBox()).y).toBeLessThan(480);
  await expect(page.locator("#provider")).toBeHidden();
  await expect(first.locator(".latest-run")).toBeHidden();
  await expect(first.locator(".topic-cover figcaption")).toBeVisible();
  await expect(first.locator("figcaption")).toContainText("实际截图");
  await first.locator(".experiment-info > summary").click();
  await expect(first.locator(".preview-source")).toContainText("预览来源");
  await expect(page.locator('nav a[href="#guides"]')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect((await first.boundingBox()).y).toBeLessThan(520);
  await expect(page.locator('nav a[href="#guides"]')).toBeHidden();
  await page.locator(".nav-more > summary").click();
  await page.locator('nav a[href="#guides"]').click();
  await expect(page.locator("#guides")).toHaveAttribute("open", "");
  await expect(page.locator(".nav-more")).not.toHaveAttribute("open");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("portrait captures use a derived cover while the full capture stays reachable", async ({
  page,
}) => {
  await page.goto("./");
  const card = page.locator(".topic-card:has(img.cover-image)").first();
  await expect(card).toHaveCount(1);
  const cover = card.locator(".topic-cover img");
  await expect(cover).toHaveAttribute("src", /-cover-v1-\d+\.webp$/);
  await expect(card.locator(".topic-cover figcaption")).toContainText("首屏");
  // 原始长图仍然是封面点击后的目标。
  const original = await cover.getAttribute("data-original");
  expect(original).toMatch(/\.png$/);
  await card.locator(".cover-preview").click();
  await expect(page.locator("#preview-stage img")).toHaveAttribute("src", original);
  expect(
    await page.locator("#preview-stage img").evaluate((img) => img.naturalHeight),
  ).toBeGreaterThan(1500);
});
test("cover preview keeps screenshot, selected version and direct entry aligned", async ({
  page,
}) => {
  await page.goto("./");
  const card = page.locator(".topic-card").first();
  const id = await card.locator("figure").getAttribute("data-screenshot-run");
  const src = await card.locator("figure img").getAttribute("data-original");
  const href = await card.locator(".preview-link").getAttribute("href");
  await card.locator(".cover-preview").click();
  await expect(page.locator("#preview-dialog")).toBeVisible();
  await expect(page.locator("#preview-version")).toHaveValue(id);
  const effort = await page.evaluate(
    (runId) =>
      window.ArchiveUI.effortLabel(
        window.ARCHIVE.runs.find((run) => run.id === runId).effort,
      ),
    id,
  );
  await expect(page.locator("#preview-caption")).toContainText(effort);
  await expect(page.locator("#preview-stage img")).toHaveAttribute("src", src);
  await expect(page.locator("#preview-open")).toHaveAttribute("href", href);
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.locator('[data-preview-mode="live"]').click();
  await expect(page.locator("#preview-stage iframe")).toHaveAttribute(
    "src",
    href,
  );
  const next = data.runs.find(
    (run) =>
      run.topicId === id.split("--")[0] &&
      run.id !== id &&
      run.screenshot &&
      run.preview.embed,
  );
  await page.locator("#preview-version").selectOption(next.id);
  await expect(page.locator("#preview-stage iframe")).toHaveCount(1);
  await page.locator('[data-preview-mode="image"]').click();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator("#preview-stage img")).toHaveAttribute(
    "src",
    `${next.directory}/${next.screenshot}`,
  );
  await page.locator('[data-preview-mode="live"]').click();
  await page.locator("#preview-close").click();
  await expect(page.locator("#preview-dialog")).not.toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(card.locator(".cover-preview")).toBeFocused();
  await card.locator(".cover-preview").press("Enter");
  await page.keyboard.press("Escape");
  await expect(page.locator("#preview-stage")).toBeEmpty();
});

test("quick controls and preview versions follow filters on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./?model=gpt-6-astra&testing=active");
  await page.locator("#mobile-filter-toggle").click();
  await page.locator("#advanced-filters > summary").click();
  await expect(page.locator('[data-view="list"]')).toBeVisible();
  await page.locator("#preview-only").click();
  await expect(page.locator("#preview-only")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await expect(page.locator("#preview-only")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator(".cover-preview").first().click();
  const ids = await page
    .locator("#preview-version option")
    .evaluateAll((options) => options.map((o) => o.value));
  expect(ids.length).toBeGreaterThan(0);
  expect(
    ids.every(
      (id) => data.runs.find((run) => run.id === id).modelId === "gpt-6-astra",
    ),
  ).toBe(true);
  const bounds = await page.locator("#preview-dialog").boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
  expect(
    await page
      .locator("#preview-dialog")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.locator('[data-preview-mode="live"]').click();
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator("#preview-close").click();
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("preview distinguishes missing screenshots, archive records and external entries", async ({
  page,
}) => {
  await page.goto("./?testing=all");
  // Exercise each declared preview state without loading an external service.
  const mutatedId = await page.evaluate(() => {
    const run = window.ARCHIVE.runs.find(
      (r) => r.id === document.querySelector(".cover-preview").dataset.preview,
    );
    run.screenshot = null;
    run.preview = { kind: "none", pages: [], embed: false };
    return run.id;
  });
  await page.locator("#q").fill(" ");
  // 搜索输入有 150ms 防抖，等重渲染后封面换成同主题的另一条实验。
  await expect
    .poll(() =>
      page.locator(".cover-preview").first().getAttribute("data-preview"),
    )
    .not.toBe(mutatedId);
  await page.locator(".cover-preview").first().click();
  const id = await page.locator("#preview-version").inputValue();
  const unavailable = await page.evaluate(
    (current) =>
      window.ARCHIVE.runs.find(
        (r) =>
          r.topicId === current.split("--")[0] && r.preview.kind === "none",
      ).id,
    id,
  );
  await page.locator("#preview-version").selectOption(unavailable);
  await expect(page.locator("#preview-stage")).toContainText("暂无截图");
  await page.locator('[data-preview-mode="live"]').click();
  await expect(page.locator("#preview-stage")).toContainText("暂无在线预览");
  await expect(page.locator("#preview-open")).toBeHidden();
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.evaluate((id) => {
    window.ARCHIVE.runs.find((r) => r.id === id).preview = {
      kind: "external",
      externalUrl: "https://example.com/",
      embed: false,
    };
  }, unavailable);
  await page.locator('[data-preview-mode="image"]').click();
  await page.locator('[data-preview-mode="live"]').click();
  await expect(page.locator("#preview-stage")).toContainText("请独立打开");
  await expect(page.locator("#preview-open")).toHaveAttribute(
    "href",
    "https://example.com/",
  );
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("complexity is the home default across pagination, views and shared sorting", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator("#sort")).toHaveValue("complexity");
  const expected = await page.evaluate(() => {
    const d = window.ARCHIVE,
      U = window.ArchiveUI;
    const runs = U.filterRuns(d, { testing: "active" });
    return d.topics
      .filter((t) => !U.isTopicArchived(t))
      .sort((a, b) => U.compareTopics(a, b, runs, "complexity"))
      .map((t) => t.id);
  });
  const ids = () =>
    page
      .locator(".topic-card h3 a")
      .evaluateAll((links) =>
        links.map((a) => new URL(a.href).searchParams.get("id")),
      );
  expect(await ids()).toEqual(expected.slice(0, 9));
  await page.locator("#load-more").click();
  expect(await ids()).toEqual(expected);
  await page.goto("./?sort=score&group=topics");
  await expect(page.locator("#sort")).toHaveValue("complexity");
  await expect(page.locator("#sort").locator("xpath=..")).toBeHidden();
  expect(new URL(page.url()).searchParams.get("sort")).toBe("complexity");
  expect(await ids()).toEqual(expected.slice(0, 9));
  await page.locator('[data-group="runs"]').click();
  await expect(page.locator("#sort").locator("xpath=..")).toBeVisible();
  await page.locator("#sort").selectOption("score");
  await expect(page.locator("#sort")).toHaveValue("score");
  await page.locator('[data-group="topics"]').click();
  await expect(page.locator("#sort")).toHaveValue("complexity");
  await expect(page.locator("#sort").locator("xpath=..")).toBeHidden();
  expect(new URL(page.url()).searchParams.get("sort")).toBe("complexity");
  await page.locator('[data-group="runs"]').click();
  await page.locator("#sort").selectOption("recent");
  await page.reload();
  await expect(page.locator("#sort")).toHaveValue("recent");
  await page.locator("#sort").selectOption("complexity");
  await page.locator('[data-group="runs"]').click();
  await expect(
    page
      .locator("#project-grid .pill")
      .filter({ hasText: "复杂度 5/5" })
      .first(),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("legacy latest links return to complexity sorting and card badges stay grouped", async ({
  page,
}) => {
  await page.goto(
    "./index.html?testing=active&sort=latest&group=topics&view=grid",
  );
  await expect(page.locator("#sort")).toHaveValue("complexity");
  const firstIds = await page
    .locator(".topic-card h3 a")
    .evaluateAll((links) =>
      links.slice(0, 2).map((a) => new URL(a.href).searchParams.get("id")),
    );
  const topTopics = await page.evaluate(() => {
    const d = window.ARCHIVE,
      U = window.ArchiveUI,
      runs = U.filterRuns(d, { testing: "active" });
    return d.topics
      .filter((topic) => !U.isTopicArchived(topic))
      .sort((a, b) => U.compareTopics(a, b, runs, "complexity"))
      .slice(0, 2)
      .map((topic) => topic.id)
      .sort();
  });
  expect(firstIds.sort()).toEqual(topTopics);
  expect(new URL(page.url()).searchParams.get("sort")).toBe("complexity");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    for (const group of ["topics", "runs"]) {
      await page.locator('[data-group="' + group + '"]').click();
      await page.locator("#q").fill("自主设计版");
      if (group === "runs") {
        expect(
          await page.locator(".card-badges .execution-mode-chip").count(),
        ).toBeGreaterThan(0);
      } else {
        const details = page.locator(".experiment-info").first();
        await expect(details.locator(".topic-secondary .pill")).toBeHidden();
        await details.locator(":scope > summary").click();
        await expect(details.locator(".topic-secondary .pill")).toBeVisible();
      }
      const aligned = await page
        .locator("#project-grid .card-top")
        .evaluateAll((rows) =>
          rows.every((row) => {
            const box = row.getBoundingClientRect(),
              tags = [...row.querySelectorAll(".card-badges > span")];
            return tags.every((tag) => {
              const r = tag.getBoundingClientRect();
              return (
                r.left >= box.left - 1 &&
                r.right <= box.right + 1 &&
                r.top >= box.top - 1 &&
                r.bottom <= box.bottom + 1
              );
            });
          }),
        );
      expect(aligned).toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});
test("home distinguishes cumulative counts and selects the displayed screenshot experiment", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator(".overview-heading")).toHaveText("全站累计");
  await expect(page.locator("#stats > div")).toHaveCount(3);
  await expect(page.locator("#guide-count")).toContainText(
    `${data.guides.length} 个技术主题`,
  );
  const card = page.locator(".topic-card").first();
  await expect(card.locator("figcaption")).not.toContainText("评分");
  await expect(card.locator(".score-chip")).toHaveCount(1);
  await expect(card.locator(".topic-metrics")).toContainText("条实验");
  const id = await card
    .locator(".topic-cover")
    .getAttribute("data-screenshot-run");
  await expect(card.locator("[data-compare]")).toHaveAttribute(
    "data-compare",
    id,
  );
  await card.locator("[data-compare]").click();
  await expect(page.locator("#compare-tray")).toContainText("1/4");
  await expect(card.locator("[data-compare]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
