import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";

const data = loadCatalog();
const embeddedPixelFlowRuns = data.runs.filter((run) =>
  [
    "pixel-flow--claude-haiku-5-5-max-r01",
    "pixel-flow--claude-opus-5-5-max-r01",
    "pixel-flow--minimax-m3-1-flash-preview-max-r01",
  ].includes(run.id),
);

test("pixel-flow static runs load in comparison iframes", async ({ page }) => {
  expect(embeddedPixelFlowRuns).toHaveLength(3);

  for (const run of embeddedPixelFlowRuns) {
    expect(run.preview.embed).toBe(true);
    await page.goto(
      `compare.html?left=${encodeURIComponent(run.id)}&tab=preview`,
    );

    const iframe = page.locator("#panel-left iframe");
    await expect(iframe).toHaveCount(1);
    await expect(
      page
        .frameLocator("#panel-left iframe")
        .getByRole("heading", { name: /Pixel Flow|图片粒子化与手势还原/ }),
    ).toBeVisible();
  }
});
