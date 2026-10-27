import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { ROOT } from "./lib.mjs";

export function reviewBrowserLaunch(backend = "default") {
  if (backend === "default")
    return {
      args: ["--enable-unsafe-swiftshader"],
      renderer: "Chromium / software WebGL allowed",
    };
  if (backend === "d3d11")
    return {
      args: ["--use-angle=d3d11"],
      renderer: "Chromium / ANGLE D3D11 requested",
    };
  throw Error("Unsupported review rendering backend");
}

// Use ordinary keyboard input and explicit, bounded settling; never change app state directly.
export async function pressReviewKey(locator, key) {
  if (
    ![
      "Home",
      "End",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Enter",
    ].includes(key)
  )
    throw Error("Unsupported review key");
  await locator.press(key, { timeout: 5000 });
}

export async function settleReviewState(page, milliseconds = 0) {
  if (
    !Number.isInteger(milliseconds) ||
    milliseconds < 0 ||
    milliseconds > 30000
  )
    throw Error("Invalid review settling duration");
  if (milliseconds) await page.waitForTimeout(milliseconds);
}

export async function doubleClickReviewTarget(locator) {
  await locator.dblclick({ timeout: 5000 });
}

export async function dragReviewTarget(page, locator, start, end) {
  if (
    ![start, end].every(
      (point) =>
        Array.isArray(point) &&
        point.length === 2 &&
        point.every((n) => Number.isFinite(n) && n >= 0 && n <= 1),
    )
  )
    throw Error("Invalid review drag coordinates");
  await locator.scrollIntoViewIfNeeded({ timeout: 10000 });
  const box = await locator.boundingBox();
  if (!box) throw Error("Pointer target is absent");
  const position = ([x, y]) => ({
    x: box.x + box.width * x,
    y: box.y + box.height * y,
  });
  const from = position(start),
    to = position(end);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  try {
    await page.mouse.move(to.x, to.y, { steps: 16 });
  } finally {
    await page.mouse.up();
  }
  return { box, start, end, steps: 16 };
}

export async function uploadReviewFixture(locator) {
  const file = "scripts/fixtures/pixel-flow-review.png";
  const absolute = path.join(ROOT, file);
  await locator.setInputFiles(absolute, { timeout: 5000 });
  return {
    file,
    sha256: crypto
      .createHash("sha256")
      .update(fs.readFileSync(absolute))
      .digest("hex"),
  };
}
