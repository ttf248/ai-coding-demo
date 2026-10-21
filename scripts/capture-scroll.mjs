export async function scrollExistingDocument(
  page,
  { stepWaitMs = 450, finalWaitMs = 1800, maximumHeight = 5400 } = {},
) {
  const geometry = await page.evaluate(() => ({
    documentHeight: document.documentElement.scrollHeight,
    containers: [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.width > 160 &&
          r.height > 160 &&
          el.scrollHeight > el.clientHeight + 100 &&
          /auto|scroll/.test(getComputedStyle(el).overflowY)
        );
      })
      .map((el) => ({
        tag: el.tagName,
        id: el.id,
        height: el.clientHeight,
        scrollHeight: el.scrollHeight,
      })),
  }));
  const height = Math.max(
    geometry.documentHeight,
    ...geometry.containers.map((c) => c.scrollHeight),
  );
  const positions = [];
  for (let y = 0; y < Math.min(height, maximumHeight); y += 720) {
    await page.evaluate((position) => {
      scrollTo(0, position);
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (
          r.width > 160 &&
          r.height > 160 &&
          el.scrollHeight > el.clientHeight + 100 &&
          /auto|scroll/.test(getComputedStyle(el).overflowY)
        )
          el.scrollTop = position;
      }
    }, y);
    await page.waitForTimeout(stepWaitMs);
    positions.push(y);
  }
  await page.waitForTimeout(finalWaitMs);
  return {
    action: "scroll-existing-document",
    ...geometry,
    positions,
    waitMsPerStep: stepWaitMs,
    finalWaitMs,
    limit: `只扫描最初页面或内部滚动区的前 ${maximumHeight}px，不声称穷尽无限列表`,
  };
}

export async function restoreScrollTop(page) {
  await page.evaluate(() => {
    scrollTo(0, 0);
    for (const el of document.querySelectorAll("body *"))
      if (el.scrollTop) el.scrollTop = 0;
  });
}
