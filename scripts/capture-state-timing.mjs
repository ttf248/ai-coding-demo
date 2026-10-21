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
