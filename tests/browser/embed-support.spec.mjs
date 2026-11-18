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

test("local video previews serve byte ranges under the site base", async ({
  request,
}) => {
  const clip = "demos/youtube-ui/runs/gpt-6-2-sol-max-r01/clips/coffee.mp4";
  const metadata = await request.head(clip);
  expect(metadata.status()).toBe(200);
  expect(metadata.headers()["content-type"]).toBe("video/mp4");
  expect(metadata.headers()["accept-ranges"]).toBe("bytes");
  const size = Number(metadata.headers()["content-length"]);
  expect(size).toBeGreaterThan(16);

  const partial = await request.get(clip, { headers: { range: "bytes=0-15" } });
  expect(partial.status()).toBe(206);
  expect(partial.headers()["content-range"]).toBe(`bytes 0-15/${size}`);
  const header = await partial.body();
  expect(header).toHaveLength(16);
  expect(header.subarray(4, 8).toString("ascii")).toBe("ftyp");

  const beyondEnd = await request.get(clip, {
    headers: { range: `bytes=${size}-` },
  });
  expect(beyondEnd.status()).toBe(416);
  expect(beyondEnd.headers()["content-range"]).toBe(`bytes */${size}`);
});
