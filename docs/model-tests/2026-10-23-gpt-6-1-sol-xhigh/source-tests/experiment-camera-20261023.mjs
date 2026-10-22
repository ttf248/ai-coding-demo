import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import fs from "node:fs";
fs.mkdirSync(".cache/model-test-20261023", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: [
    "--enable-unsafe-swiftshader",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
});
const context = await browser.newContext({ permissions: ["camera"] });
const page = await context.newPage();
const logs = [];
page.on("pageerror", (e) => logs.push(e.message));
const url =
  "http://127.0.0.1:43903/demos/pixel-flow/runs/gpt-6-1-sol-xhigh-r01/index.html";
try {
  await page.goto(url);
  await page.locator("#camera").click();
  await page.waitForFunction(
    () => !window.lab.state.starting,
    {},
    { timeout: 90000 },
  );
  const status = await page.locator("#status").textContent();
  assert.equal(
    await page.evaluate(() => window.lab.state.tracking),
    true,
    status,
  );
  const live = await page.evaluate(() =>
    [...document.querySelector("video").srcObject.getTracks()].map(
      (t) => t.readyState,
    ),
  );
  assert(live.every((x) => x === "live"));
  await page.evaluate(
    () =>
      (window.testTracks = [
        ...document.querySelector("video").srcObject.getTracks(),
      ]),
  );
  await page.locator("#camera").click();
  assert(
    await page.evaluate(() =>
      window.testTracks.every((t) => t.readyState === "ended"),
    ),
  );
  await page.evaluate(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException("Permission denied by test", "NotAllowedError");
    };
  });
  await page.locator("#camera").click();
  await page.waitForFunction(
    () => !window.lab.state.starting,
    {},
    { timeout: 90000 },
  );
  assert.equal(await page.evaluate(() => window.lab.state.tracking), false);
  assert.match(
    await page.locator("#status").textContent(),
    /Permission denied|权限/,
  );
  assert.deepEqual(logs, []);
  const result = {
    pass: true,
    modelLoaded: true,
    syntheticCameraStream: true,
    tracksReleased: true,
    permissionDenied: true,
    realHumanHand: "not tested; synthetic device has no hand",
  };
  fs.writeFileSync(
    ".cache/model-test-20261023/experiment-camera-20261023.json",
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
} catch (e) {
  fs.writeFileSync(
    ".cache/model-test-20261023/experiment-camera-20261023.json",
    JSON.stringify(
      {
        pass: false,
        error: e.message,
        status: await page.locator("#status").textContent(),
      },
      null,
      2,
    ) + "\n",
  );
  throw e;
} finally {
  await browser.close();
}
