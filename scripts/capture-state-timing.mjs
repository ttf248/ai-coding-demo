import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { ROOT } from "./lib.mjs";

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
