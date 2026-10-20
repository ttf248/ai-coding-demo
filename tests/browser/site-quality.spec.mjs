import { test, expect } from "@playwright/test";
import { loadCatalog, readJSON } from "../../scripts/lib.mjs";
import { resolveLocal } from "../../scripts/lib.mjs";
import { pathToFileURL } from "node:url";
const catalog = loadCatalog();
const left = catalog.runs.find(
  (run) => run.id === "fluid-simulation--claude-sonnet-5-5-medium-r01",
);
const right = catalog.runs.find(
  (run) =>
    run.topicId === left.topicId &&
    run.id !== left.id &&
    run.rawHash === left.rawHash &&
    run.screenshot,
);
const pair = "compare.html?left=" + left.id + "&right=" + right.id;
test("topic and compare pages reach the guide index and archived topics", async ({
  page,
}) => {
  for (const target of [
    "topic.html?id=circuit-lab",
    "compare.html?group=circuit-lab/v1",
  ]) {
    await page.goto(target);
    const guides = page.locator('a[href="index.html#guides"]');
    const archived = page.locator('a[href="index.html?testing=archived#projects"]');
    await expect(guides).toHaveCount(1);
    await expect(archived).toHaveCount(1);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.setViewportSize({ width: 1440, height: 960 });
  }
  // 技术索引深链回到首页后自动展开折叠块。
  await page.goto("topic.html?id=circuit-lab");
  await page.locator('a[href="index.html#guides"]').click();
  await expect(page).toHaveURL(/#guides$/);
  await expect(page.locator("#guides")).toHaveAttribute("open", "");
});
test("guide examples remain directly openable", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route(/^https?:/, (route) => route.abort());
  for (const guide of catalog.guides) {
    await page.goto(pathToFileURL(resolveLocal(guide.example)).href);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator(".guide-sitebar")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

for (const guide of catalog.guides)
  test(
    "guide " + guide.slug + " uses local resources and fits mobile",
    async ({ page, baseURL }) => {
      const errors = [],
        remoteRuntime = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("**/*", (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (
          url.href ===
          "https://www.googletagmanager.com/gtag/js?id=G-8E54P1HX3G"
        )
          return route.fulfill({ contentType: "text/javascript", body: "" });
        if (url.origin !== new URL(baseURL).origin) {
          if (
            guide.network === "offline" ||
            ["script", "stylesheet", "font"].includes(request.resourceType())
          )
            remoteRuntime.push(url.href);
          return route.abort();
        }
        return route.continue();
      });
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 960 });
        await page.goto(guide.example);
        await expect(page.locator("h1").first()).toBeVisible();
        await expect(page.locator(".guide-sitebar")).toBeVisible();
        await expect(page.locator("body")).not.toContainText("${dir^}");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      expect(remoteRuntime).toEqual([]);
      expect(errors).toEqual([]);
    },
  );

test("six learning labs perform their operations", async ({ page }) => {
  const entry = (slug) =>
    catalog.guides.find((guide) => guide.slug === slug).example;
  await page.goto(entry("javascript"));
  await page.locator("#numbers").fill("[8,3,1]");
  await page.locator("#sort").click();
  expect(
    JSON.parse(await page.locator("#js-result").textContent()).result,
  ).toEqual([1, 3, 8]);
  await page.locator("#numbers").fill("invalid");
  await page.locator("#map").click();
  await expect(page.locator("#js-status")).not.toBeEmpty();
  await page.goto(entry("state-management"));
  await page.locator("#increment").click();
  await expect(page.locator("#state-a")).toHaveText("1");
  await expect(page.locator("#state-b")).toHaveText("1");
  await page.locator("#reset").click();
  await expect(page.locator("#state-a")).toHaveText("0");
  await page.goto(entry("api-rest"));
  await page.locator("#method").selectOption("POST");
  await page.locator("#send").click();
  await expect(page.locator("#response")).toContainText("201");
  await page.locator("#method").selectOption("DELETE");
  await page.locator("#resource-id").fill("2");
  await page.locator("#send").click();
  await expect(page.locator("#response")).toContainText("204");
  await page.locator("#method").selectOption("GET");
  await page.locator("#send").click();
  await expect(page.locator("#response")).toContainText("404");
  await page.goto(entry("frontend-build"));
  const compact = JSON.parse(
    await page.locator("#build-result").textContent(),
  ).bytes;
  await page.locator("#minify").uncheck();
  await page.locator("#build").click();
  expect(
    JSON.parse(await page.locator("#build-result").textContent()).bytes,
  ).toBeGreaterThan(compact);
  await page.goto(entry("npm"));
  await page.locator("#dev-dependency").check();
  await page.locator("#add-package").click();
  expect(
    JSON.parse(await page.locator("#package-json").textContent())
      .devDependencies.react,
  ).toBeTruthy();
  await expect(page.locator("#install-command")).toContainText("--save-dev");
  await page.goto(entry("component-based"));
  await page.locator("#component-title").fill("<script>example</script>");
  await page.locator("#component-cards button").first().click();
  const state = JSON.parse(
    await page.locator("#component-state").textContent(),
  );
  expect(state.localState).toEqual([{ count: 1 }, { count: 0 }]);
  await expect(page.locator("#component-cards h3").first()).toContainText(
    "<script>example</script>",
  );
});

test("Vue lifecycle logs stop growing and remount the child", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(catalog.guides.find((guide) => guide.slug === "vue").example);
  const rows = page.locator("#lifecycle li");
  await expect(rows).toHaveCount(2);
  await page.getByRole("button", { name: "更新子组件：0" }).click();
  await expect(rows).toHaveCount(3);
  await page.getByRole("button", { name: "重新创建组件" }).click();
  await expect(rows).toHaveCount(5);
  await expect(
    page.getByRole("button", { name: "更新子组件：0" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("homepage loads thumbnails and separates vendors from tools", async ({
  page,
}) => {
  const textRequests = [];
  page.on("request", (request) => {
    if (/generated\/(inputs|tasks|topics)\//.test(request.url()))
      textRequests.push(request.url());
  });
  await page.goto("./");
  await expect(page.locator(".topic-card")).toHaveCount(9);
  expect(textRequests).toEqual([]);
  const image = page.locator(".topic-cover img").first();
  await expect(image).toHaveAttribute("src", /\.webp$/);
  await expect(image).toHaveAttribute("srcset", /480w.*960w/);
  await expect(image).toHaveAttribute("data-original", /\.png$/);
  await page.locator("#advanced-filters summary").click();
  await page.locator("#provider").selectOption("Anthropic");
  await page.locator("#tool").selectOption("github-copilot");
  const count = catalog.runs.filter(
    (run) =>
      run.environment.toolId === "github-copilot" &&
      catalog.models.find((model) => model.id === run.modelId).provider ===
        "Anthropic" &&
      catalog.topics.find((topic) => topic.id === run.topicId).testingStatus !==
        "archived",
  ).length;
  await expect(page.locator("#result-count")).toContainText(
    count + " 条匹配记录",
  );
  await expect(page.locator('#provider option[value="Anthropic"]')).toHaveText(
    /Anthropic · \d+/,
  );
  await page.locator('[data-recent="archive"]').click();
  const latestArchiveDate = catalog.runs
    .filter(
      (run) =>
        run.archivedAt &&
        catalog.topics.find((topic) => topic.id === run.topicId)
          .testingStatus !== "archived",
    )
    .map((run) => run.archivedAt)
    .sort()
    .at(-1);
  await expect(page.locator("#recent-list time").first()).toHaveText(
    latestArchiveDate,
  );
});

test("returning from a topic restores loaded cards and scroll", async ({
  page,
}) => {
  await page.goto("./");
  await page.locator("#load-more").click();
  await expect(page.locator(".topic-card")).toHaveCount(11);
  await page.locator(".topic-card h3 a").nth(9).click();
  await expect(page.locator("#topic-count")).toBeVisible();
  await page.goBack();
  await expect(page.locator(".topic-card")).toHaveCount(11);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(300);
});

test("404 searches archived themes and maps legacy paths", async ({
  page,
  baseURL,
}) => {
  await page.goto("404.html");
  await page.locator('[name="q"]').fill("自选股");
  await page.locator("form button").click();
  await expect(page).toHaveURL(/testing=all/);
  await expect(page.locator(".topic-card h3")).toContainText("自选股");
  const record = readJSON("catalog/migration-v2.json").records[0];
  const legacy = new URL(record.oldPath + "/index.html", baseURL).href;
  await page.goto(legacy);
  await expect(page.locator("#migration-match")).toContainText(record.id);
  await page.locator("#migration-match a").click();
  await expect(page.locator("#run-" + record.id)).toBeVisible();
});

test("reading pages have formatted documents, navigation and mobile layout", async ({
  page,
}) => {
  for (const source of [
    left.document,
    "Readme.md",
    "docs/react/Readme.md",
    "docs/maintenance.md",
  ]) {
    await page.goto(
      "assets/generated/readers/" + source.replace(/\.md$/i, ".html"),
    );
    await expect(page.locator(".document-content h1").first()).toBeVisible();
    await expect(page.locator(".document-sidebar a").first()).toHaveAttribute(
      "href",
      /^#/,
    );
    await expect(page.locator(".document-actions a[download]")).toHaveAttribute(
      "href",
      /\.md$/,
    );
    // Generator block markers stay in the Markdown but never reach the reader.
    await expect(page.locator(".document-content")).not.toContainText(
      "<!-- archive:",
    );
    await expect(page.locator(".document-content")).not.toContainText(
      "<!-- catalog:",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("comparison loads text on demand and snapshot mode creates no frames", async ({
  page,
}) => {
  await page.route(/\/(previews|demos)\/.*\.html$/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><h1>Preview</h1>",
    }),
  );
  const rawRequests = [];
  page.on("request", (request) => {
    if (/generated\/inputs\//.test(request.url()))
      rawRequests.push(request.url());
  });
  await page.goto(pair + "&tab=snapshot");
  await expect(page.locator(".snapshot-preview img")).toHaveCount(2);
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(rawRequests).toEqual([]);
  await page.locator("#pick-models").click();
  await expect(page.locator('[data-choice="' + left.id + '"]')).toContainText(
    "原始输入已记录",
  );
  await page.locator("#close-picker").click();
  await page.locator('[data-tab="prompt"]').click();
  await expect(page.locator("#prompt-source")).toBeVisible();
  expect(rawRequests).toEqual([]);
  await page.locator("#prompt-source").selectOption("raw");
  await expect(page.locator("#relation")).toContainText("已记录的原始输入一致");
  await expect.poll(() => rawRequests.length).toBeGreaterThan(0);
  expect(rawRequests.length).toBeGreaterThan(0);
  await expect(page.locator("#relation")).toContainText("已记录的原始输入一致");
  await page.locator('[data-tab="snapshot"]').click();
  await page.reload();
  await expect(page.locator(".snapshot-preview img")).toHaveCount(2);
  await expect(page.locator("iframe")).toHaveCount(0);
});
