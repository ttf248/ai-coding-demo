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

export async function discoverHorizontalContainers(page) {
  return page.evaluate(() => {
    const elements = [...document.querySelectorAll("body *")].filter((e) => {
      const r = e.getBoundingClientRect();
      return (
        r.width >= 300 &&
        r.height >= 200 &&
        e.scrollWidth > e.clientWidth + 150 &&
        /auto|scroll/.test(getComputedStyle(e).overflowX)
      );
    });
    return elements
      .filter(
        (e) => !elements.some((parent) => parent !== e && parent.contains(e)),
      )
      .map((e) => {
        const segments = [];
        for (
          let node = e;
          node && node !== document.body;
          node = node.parentElement
        ) {
          const tag = node.tagName.toLowerCase();
          segments.unshift(
            tag +
              ":nth-of-type(" +
              ([...node.parentElement.children]
                .filter((s) => s.tagName === node.tagName)
                .indexOf(node) +
                1) +
              ")",
          );
        }
        return {
          selector: "body > " + segments.join(" > "),
          width: e.clientWidth,
          maxLeft: e.scrollWidth - e.clientWidth,
        };
      });
  });
}

export async function scrollHorizontalContainer(
  page,
  container,
  left,
  waitMs = 1000,
) {
  await page.evaluate(
    ({ selector, left }) => {
      scrollTo(0, 0);
      document
        .querySelector(selector)
        .scrollTo({ left, top: 0, behavior: "instant" });
    },
    { ...container, left },
  );
  await page.waitForTimeout(waitMs);
  return page
    .locator(container.selector)
    .evaluate((e) => ({
      left: e.scrollLeft,
      top: e.scrollTop,
      maxLeft: e.scrollWidth - e.clientWidth,
    }));
}
