import { test, expect } from "@playwright/test";

// 计算样式钉子：样式表收敛后，页面渲染结果必须保持不变。
// 改动这些值等于改了页面外观，需要连带更新本文件并在提交信息里说明。
const PAGES = {
  home: "index.html?testing=all",
  topic: "topic.html?id=bluebook&view=list",
  compare:
    "compare.html?group=circuit-lab/v1&left=circuit-lab--claude-opus-5-5-max-r01&right=circuit-lab--gpt-6-1-sol-max-r01",
};

const BASELINE = {
  "home@1440": {
    ".hero h1": {
      "font-size": "46px",
      "line-height": "55.2px",
      "letter-spacing": "-1.15px",
    },
    ".stats strong": {
      "font-size": "30px",
      "font-weight": "650",
      "font-variant-numeric": "tabular-nums",
    },
    ".stats span": {
      "font-size": "12px",
    },
    ".section-title": {
      "align-items": "center",
      "justify-content": "space-between",
      gap: "12px",
      "margin-bottom": "20px",
    },
    ".section-title h2": {
      "font-size": "22px",
      margin: "0px",
    },
    ".primary-filters": {
      "grid-template-columns": "799px 140px 185px",
      padding: "0px 96px 0px 0px",
      gap: "10px",
    },
    ".secondary-filters": {
      "grid-template-columns":
        "238.391px 238.406px 238.391px 238.406px 238.391px",
      padding: "16px 0px 0px",
      gap: "12px",
    },
    ".filters": {
      padding: "0px 96px 0px 0px",
      gap: "10px",
    },
    ".card": {
      padding: "0px",
    },
    ".about": {
      padding: "26px 30px",
    },
    ".recent-list": {
      "grid-template-columns": "604px 604px",
      gap: "normal 32px",
    },
    ".recent-list a": {
      "grid-template-areas": '"topic date" "meta date"',
      gap: "2px 16px",
    },
    "nav a": {
      "font-size": "13px",
      padding: "8px 0px",
    },
  },
  "home@390": {
    ".hero h1": {
      "font-size": "32px",
      "line-height": "38.4px",
      "letter-spacing": "-0.8px",
    },
    ".stats strong": {
      "font-size": "18px",
      "font-weight": "650",
      "font-variant-numeric": "tabular-nums",
    },
    ".stats span": {
      "font-size": "11px",
    },
    ".section-title": {
      "align-items": "flex-start",
      "justify-content": "space-between",
      gap: "12px",
      "margin-bottom": "20px",
    },
    ".section-title h2": {
      "font-size": "22px",
      margin: "0px",
    },
    ".primary-filters": {
      "grid-template-columns": "175px 175px",
      padding: "0px",
      gap: "8px",
    },
    ".secondary-filters": {
      "grid-template-columns": "repeat(2, minmax(0px, 1fr))",
      padding: "16px 0px 0px",
      gap: "12px",
    },
    ".filters": {
      padding: "0px",
      gap: "8px",
    },
    ".card": {
      padding: "0px",
    },
    ".about": {
      padding: "20px",
    },
    ".recent-list": {
      "grid-template-columns": "358px",
      gap: "normal 32px",
    },
    ".recent-list a": {
      "grid-template-areas": '"topic date" "meta date"',
      gap: "2px 12px",
    },
    "nav a": {
      "font-size": "12px",
      padding: "8px 0px",
    },
  },
  "topic@1440": {
    ".topic-toolbar": {
      gap: "16px",
      padding: "8px 0px",
      "align-items": "center",
    },
    ".topic-filters": {
      gap: "10px",
      padding: "0px",
    },
    ".topic-runs-table": {
      "table-layout": "fixed",
      "min-width": "0px",
      "font-size": "12px",
    },
    ".topic-run-duration": {
      "font-variant-numeric": "tabular-nums",
    },
    ".topic-run-input": {
      "font-size": "11px",
    },
    ".topic-run-row": {
      gap: "normal",
      padding: "0px",
    },
    ".page-heading p": {
      "font-size": "13px",
      "line-height": "20.8px",
      "-webkit-line-clamp": "none",
    },
  },
  "topic@390": {
    ".topic-toolbar": {
      gap: "10px",
      padding: "4px 0px",
      "align-items": "stretch",
    },
    ".topic-filters": {
      gap: "6px",
      padding: "0px",
    },
    ".topic-runs-table": {
      "table-layout": "fixed",
      "min-width": "0px",
      "font-size": "12px",
    },
    ".topic-run-duration": {
      "font-variant-numeric": "tabular-nums",
    },
    ".topic-run-input": {
      "font-size": "11px",
    },
    ".topic-run-row": {
      gap: "8px",
      padding: "12px",
    },
    ".page-heading p": {
      "font-size": "13px",
      "line-height": "20.8px",
      "-webkit-line-clamp": "2",
    },
  },
  "compare@1440": {
    ".compare-controls": {
      "justify-content": "center",
      gap: "9px",
      padding: "0px",
      "align-items": "center",
    },
    ".compare-controls .segments": {
      padding: "2px",
      "border-radius": "11px",
      gap: "2px",
    },
    ".compare-controls .segments button": {
      padding: "5px 9px",
      "font-size": "12px",
    },
    ".panel-header": {
      padding: "6px 8px",
      gap: "6px",
    },
    ".workspace-bar": {
      padding: "3px 2px 6px",
      gap: "8px 20px",
    },
    ".compare-grid": {
      gap: "8px",
      "grid-template-columns": "708px 708px",
    },
  },
  "compare@390": {
    ".compare-controls": {
      "justify-content": "center",
      gap: "4px 8px",
      padding: "0px",
      "align-items": "center",
    },
    ".compare-controls .segments": {
      padding: "2px",
      "border-radius": "11px",
      gap: "2px",
    },
    ".compare-controls .segments button": {
      padding: "5px 7px",
      "font-size": "13px",
    },
    ".panel-header": {
      padding: "10px",
      gap: "8px",
    },
    ".workspace-bar": {
      padding: "0px 0px 6px",
      gap: "8px",
    },
    ".compare-grid": {
      gap: "8px",
      "grid-template-columns": "380px",
    },
  },
};

BASELINE["compare@1440"]["#pick-models"] = {
  "background-color": "rgb(255, 255, 255)",
};
BASELINE["compare@390"]["#pick-models"] = {
  "background-color": "rgb(255, 255, 255)",
};
BASELINE["compare@390"][".panel-identity"] = {
  position: "static",
  "font-size": "14px",
};
BASELINE["topic@390"][".run-context > summary"] = { "min-height": "44px" };

for (const width of [1440, 390]) {
  BASELINE[`home@${width}`][".score-chip"] = {
    "background-color": "rgb(246, 247, 249)",
    color: "rgb(24, 34, 48)",
  };
  BASELINE[`compare@${width}`]["#relation"] = {
    color: "rgb(121, 86, 0)",
    "background-color": "rgb(255, 245, 221)",
  };
}

// 新增排序说明继承结果区字号，不能压缩成难读的辅助标签。
BASELINE["home@1440"]["#sort-context"] = { "font-size": "13px" };
BASELINE["home@390"]["#display-options > summary"] = {
  display: "flex",
  "min-height": "44px",
};
BASELINE["home@390"][".compact-hero"] = { padding: "8px 0px" };
BASELINE["topic@390"][".topic-run-facts"] = { "grid-row-start": "4" };
BASELINE["compare@390"][".compare-switcher"] = {
  position: "sticky",
  top: "0px",
};
BASELINE["compare@390"][".panel-header"]["grid-template-columns"] = "358px";

for (const [width, sizes] of [
  [1440, "desktop"],
  [390, "mobile"],
]) {
  test(`${sizes} computed styles stay pinned for every page`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, url] of Object.entries(PAGES)) {
      await page.goto(url, { waitUntil: "load" });
      await page.waitForTimeout(600);
      const expected = BASELINE[`${name}@${width}`];
      expect(expected, `missing baseline for ${name}@${width}`).toBeTruthy();
      const selectors = Object.fromEntries(
        Object.entries(expected).map(([selector, values]) => [
          selector,
          Object.keys(values),
        ]),
      );
      const actual = await page.evaluate((selectors) => {
        const result = {};
        for (const [selector, properties] of Object.entries(selectors)) {
          const element = document.querySelector(selector);
          if (!element) {
            result[selector] = null;
            continue;
          }
          const style = getComputedStyle(element);
          const values = {};
          for (const property of properties)
            values[property] = style.getPropertyValue(property);
          result[selector] = values;
        }
        return result;
      }, selectors);
      expect(actual, `${name}@${width} computed styles changed`).toEqual(
        expected,
      );
    }
  });
}
