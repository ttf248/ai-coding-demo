import { test, expect } from "@playwright/test";
import {
  scrollExistingDocument,
  restoreScrollTop,
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
