import { test, expect } from "@playwright/test";
import {
  scrollExistingDocument,
  restoreScrollTop,
  discoverHorizontalContainers,
  scrollHorizontalContainer,
} from "../../scripts/capture-scroll.mjs";

test("capture scrolling reaches lazy content in fixed-height internal feeds without changing source state", async ({
  page,
}) => {
  await page.setContent(
    `<style>body{margin:0;height:600px;overflow:hidden}main{height:500px;width:500px;overflow:auto}.spacer{height:1300px}</style><main id="feed"><div class="spacer"></div><p id="lazy">not observed</p><div style="height:200px"></div></main><script>new IntersectionObserver(entries=>{if(entries[0].isIntersecting)document.querySelector('#lazy').textContent='visible after real scroll';},{root:document.querySelector('#feed')}).observe(document.querySelector('#lazy'));</script>`,
  );
  const log = await scrollExistingDocument(page, {
    stepWaitMs: 40,
    finalWaitMs: 80,
    maximumHeight: 2200,
  });
  expect(log.containers).toContainEqual(
    expect.objectContaining({ id: "feed" }),
  );
  await expect(page.locator("#lazy")).toHaveText("visible after real scroll");
  expect(
    await page.locator("#feed").evaluate((el) => el.scrollTop),
  ).toBeGreaterThan(0);
  await restoreScrollTop(page);
  expect(await page.locator("#feed").evaluate((el) => el.scrollTop)).toBe(0);
});

test("horizontal evidence reaches hidden prototype pages through real snap scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 430, height: 900 });
  await page.setContent(
    `<style>body{margin:0}main{display:flex;width:400px;height:500px;overflow-x:auto;scroll-snap-type:x mandatory}section{flex:0 0 360px;height:480px;scroll-snap-align:start}.chips{width:320px;overflow:auto;height:40px}</style><main><section>First</section><section>Middle</section><section><p id="last">not observed</p><div class="chips"><div style="width:1000px">Small filter strip</div></div></section></main><script>new IntersectionObserver(es=>{if(es[0].isIntersecting)document.querySelector('#last').textContent='last page loaded';},{root:document.querySelector('main')}).observe(document.querySelector('#last'));</script>`,
  );
  const containers = await discoverHorizontalContainers(page);
  expect(containers).toHaveLength(1);
  const observed = await scrollHorizontalContainer(
    page,
    containers[0],
    9999,
    150,
  );
  await expect(page.locator("#last")).toHaveText("last page loaded");
  expect(observed.left).toBe(observed.maxLeft);
  await page.screenshot();
  expect(await page.locator("main").evaluate((e) => e.scrollLeft)).toBe(
    observed.left,
  );
  expect(await page.locator("[data-capture-id]").count()).toBe(0);
  const session = await page.context().newCDPSession(page);
  const shot = await session.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  const png = Buffer.from(shot.data, "base64");
  expect(png.readUInt32BE(16)).toBe(430);
  expect(png.readUInt32BE(20)).toBe(900);
  expect(await page.locator("main").evaluate((e) => e.scrollLeft)).toBe(
    observed.left,
  );
  await session.detach();
});
