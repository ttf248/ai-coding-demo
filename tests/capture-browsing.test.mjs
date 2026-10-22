import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { read } from "../scripts/lib.mjs";
const context = {};
vm.runInNewContext(read("assets/core.js"), context);
const U = context.ArchiveUI;

test("capture browsing only exposes frames of the selected experiment and keeps cover fallback", () => {
  const run = {
    id: "sample--model-high-r01",
    directory: "demos/sample/runs/model-high-r01",
    screenshot: "cover.png",
    screenshotInfo: { width: 1440, height: 900 },
  };
  const file = run.directory + "/captures/2030-01-01-import/mobile.png";
  run.scoreEvidence = {
    frames: [
      { id: "mobile-initial", file, viewport: { width: 390, height: 844 } },
      { id: "foreign", file: "demos/other/runs/model/captures/secret.png" },
      { id: "traversal", file: run.directory + "/../secret.png" },
      { id: "javascript", file: "javascript:alert(1)" },
    ],
  };
  assert.equal(U.captureFrames(run).length, 1);
  assert.equal(U.captureFrames(run)[0].file, file);
  assert.equal(U.captureDevice(U.captureFrames(run)[0]), "mobile");
  assert.equal(U.captureFrameLabel(U.captureFrames(run)[0]), "手机首屏");
  assert.equal(
    U.captureFrameLabel(
      { id: "page-01", pageId: "login" },
      { preview: { pages: [{ id: "login", label: "登录与注册" }] } },
    ),
    "登录与注册",
  );
  assert.equal(U.captureCount(run), 1);
  assert.equal(
    U.captureURL(run, "mobile-initial"),
    "screenshots.html?run=sample--model-high-r01&frame=mobile-initial",
  );
  delete run.scoreEvidence;
  assert.equal(U.captureFrames(run)[0].file, run.directory + "/cover.png");
  delete run.screenshot;
  assert.equal(U.captureFrames(run).length, 0);
});
