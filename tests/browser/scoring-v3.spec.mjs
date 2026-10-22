import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`v3 exposes twenty checks and real evidence at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("topic.html?id=circuit-lab&view=list&sort=score");
    const details = page.locator(".topic-run-score .score-details").first();
    const artwork = page.locator(".topic-run-art img").first();
    const before = await artwork.boundingBox();
    await details.locator(":scope > summary").click();
    await expect(details.locator(".score-check-list li")).toHaveCount(20);
    await expect(details.locator(".score-review-group")).toHaveCount(5);
    await expect(details).toContainText("规则 v3");
    await expect(details).toContainText("证据置信度");
    await expect(details.locator(".score-limitations")).toBeVisible();
    if (width === 1440) {
      const bounds = await details.locator(".score-evidence").boundingBox();
      expect(bounds.width).toBeGreaterThan(420);
    }
    const after = await artwork.boundingBox();
    expect(Math.abs(after.width - before.width)).toBeLessThan(2);
    const gallery = details.locator(".score-captures");
    await gallery.locator(":scope > summary").click();
    const links = gallery.locator(".score-frame-link");
    expect(await links.count()).toBeGreaterThanOrEqual(2);
    const href = await links.first().getAttribute("href");
    const response = await page.request.get(new URL(href, page.url()).href);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.reload();
    await expect(page.locator("#topic-sort")).toHaveValue("score");
  });
}
