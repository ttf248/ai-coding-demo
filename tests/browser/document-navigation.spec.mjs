import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
import { readerPath } from "../../scripts/site-output.mjs";
const catalog = loadCatalog();
test("reader actions preserve experiment identity and current section", async ({
  page,
}) => {
  const run = catalog.runs.find(
    (r) => r.topicId === "fluid-simulation" && r.modelId === "qwen3-8-flash",
  );
  await page.goto(readerPath(run.document));
  const actions = page.locator(".document-actions");
  await expect(
    actions.getByRole("link", { name: "对比此实验" }),
  ).toHaveAttribute("href", new RegExp("left=" + run.id));
  const preview = actions.getByRole("link", { name: "运行作品" });
  expect(
    (
      await page.request.get(
        new URL(await preview.getAttribute("href"), page.url()).href,
      )
    ).ok(),
  ).toBe(true);
  const links = page.locator(".document-sidebar nav a");
  await expect(links.first()).toHaveAttribute("aria-current", "location");
  const target = links.nth(2);
  await target.click();
  await expect(target).toHaveAttribute("aria-current", "location");
  expect(
    (await page.locator(".document-content").boundingBox()).width,
  ).toBeLessThanOrEqual(820);
  await actions.getByRole("link", { name: "对比此实验" }).click();
  await expect(page.locator("#run-left")).toHaveValue(run.id);
  await expect(page.locator('[data-tab="preview"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("#panel-left iframe")).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(readerPath(run.document));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
