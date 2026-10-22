import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { ROOT } from "../scripts/lib.mjs";
import { hash } from "../scripts/lib.mjs";

// 导入案例时的机械字段同步：只处理草稿，已入库记录的输入不得被改写。
function fixture() {
  const temporary = fs.mkdtempSync(
    path.join(os.tmpdir(), "ai-archive-demo-sync-"),
  );
  const write = (p, value) => {
    const file = path.join(temporary, p);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, value);
  };
  for (const name of [
    "lib.mjs",
    "site-output.mjs",
    "model-ordering.mjs",
    "scoring.mjs",
    "scoring-v3.mjs",
    "new-demo.mjs",
    "demo-sync.mjs",
  ])
    write("scripts/" + name, fs.readFileSync(path.join(ROOT, "scripts", name)));
  fs.mkdirSync(path.join(temporary, "demos"));
  write("catalog/models.json", '[{"id":"unknown","label":"未记录"}]');
  write("catalog/categories.json", "[]");
  write("catalog/guides.json", "[]");
  write("catalog/tools.json", "[]");
  write("catalog/batches.json", "[]");
  write(
    "catalog/scoring-rubric.json",
    JSON.stringify({ version: 3, dimensionMaximums: {}, tasks: {} }),
  );
  return { temporary, write };
}

const run = (temporary, args) =>
  execFileSync(
    process.execPath,
    [path.join(temporary, "scripts/demo-sync.mjs"), ...args],
    { cwd: temporary, stdio: "pipe", encoding: "utf8" },
  );

const cleanup = (temporary) => {
  if (
    path.dirname(temporary) !== path.resolve(os.tmpdir()) ||
    !path.basename(temporary).startsWith("ai-archive-demo-sync-")
  )
    throw Error("Unsafe test cleanup path");
  fs.rmSync(temporary, { recursive: true, force: true });
};

test("demo sync writes the input fingerprint of a draft and lists what is still missing", () => {
  const { temporary, write } = fixture();
  try {
    execFileSync(
      process.execPath,
      [
        path.join(temporary, "scripts/new-demo.mjs"),
        "--topic",
        "sample",
        "--title",
        "Example",
        "--type",
        "prompt",
      ],
      { cwd: temporary, stdio: "pipe" },
    );
    const runDirectory = path.join(
      temporary,
      "demos/sample/runs/unknown-unknown-r01",
    );
    // 维护者填入真实输入后，脚手架里的占位指纹立刻失配。
    fs.writeFileSync(path.join(runDirectory, "prompt.md"), "真实原始输入\n");
    fs.writeFileSync(
      path.join(temporary, "demos/sample/prompts/v1/prompt.md"),
      "真实任务正文\n",
    );
    const before = JSON.parse(
      fs.readFileSync(path.join(runDirectory, "run.json"), "utf8"),
    );
    assert.notEqual(before.input.hash, "");

    const output = run(temporary, ["sample--unknown-unknown-r01", "--check"]);
    assert.match(output, /未写入任何文件/);
    assert.match(output, /输入正文仍是脚手架占位文字|未登记截图/);

    run(temporary, ["sample--unknown-unknown-r01"]);
    const after = JSON.parse(
      fs.readFileSync(path.join(runDirectory, "run.json"), "utf8"),
    );
    const prompt = JSON.parse(
      fs.readFileSync(
        path.join(temporary, "demos/sample/prompts/v1/prompt.json"),
        "utf8",
      ),
    );
    assert.notEqual(after.input.hash, before.input.hash);
    assert.equal(after.input.hash.length, 64);
    assert.equal(prompt.hash.length, 64);
    assert.equal(after.status, "draft");
  } finally {
    cleanup(temporary);
  }
});

test("demo sync refuses to rewrite a registered record and refuses an incomplete draft", () => {
  const { temporary } = fixture();
  try {
    execFileSync(
      process.execPath,
      [
        path.join(temporary, "scripts/new-demo.mjs"),
        "--topic",
        "sample",
        "--title",
        "Example",
        "--type",
        "prompt",
      ],
      { cwd: temporary, stdio: "pipe" },
    );
    const runDirectory = path.join(
      temporary,
      "demos/sample/runs/unknown-unknown-r01",
    );
    const file = path.join(runDirectory, "run.json");
    const record = JSON.parse(fs.readFileSync(file, "utf8"));

    // 草稿缺预览入口与评分时不能置为 ready。
    assert.throws(
      () => run(temporary, ["sample--unknown-unknown-r01", "--finalize"]),
      /还不能把 sample--unknown-unknown-r01 置为 ready|Command failed/,
    );
    assert.equal(JSON.parse(fs.readFileSync(file, "utf8")).status, "draft");

    // 已入库记录不再被脚本改写。
    record.status = "ready";
    fs.writeFileSync(file, JSON.stringify(record, null, 2) + "\n");
    assert.throws(
      () => run(temporary, ["sample--unknown-unknown-r01"]),
      /already registered|Command failed/,
    );
  } finally {
    cleanup(temporary);
  }
});

function preparedDraft() {
  const f = fixture();
  execFileSync(
    process.execPath,
    [
      path.join(f.temporary, "scripts/new-demo.mjs"),
      "--topic",
      "sample",
      "--title",
      "Example",
      "--type",
      "prompt",
    ],
    { cwd: f.temporary, stdio: "pipe" },
  );
  const directory = "demos/sample/runs/unknown-unknown-r01";
  const file = path.join(f.temporary, directory, "run.json");
  const record = JSON.parse(fs.readFileSync(file, "utf8"));
  f.write(`${directory}/prompt.md`, "真实输入");
  f.write("demos/sample/prompts/v1/prompt.md", "真实正文");
  f.write(
    `${directory}/screenshot.png`,
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
      "base64",
    ),
  );
  record.description = "真实描述";
  record.input.notes = "完整留存";
  record.screenshot = "captures/test/desktop.png";
  f.write(
    `${directory}/captures/test/desktop.png`,
    fs.readFileSync(path.join(f.temporary, directory, "screenshot.png")),
  );
  record.preview = {
    kind: "external",
    embed: true,
    pages: [],
    defaultPage: null,
    externalUrl: "https://example.com/demo",
    network: "required",
  };
  record.score = {
    ...record.score,
    rubricVersion: 3,
    status: "insufficient",
    captureState: "undemonstrated",
    assessedAt: "2026-10-22",
    confidence: "low",
    observations: Object.fromEntries(
      [
        "taskCoverage",
        "composition",
        "readability",
        "interactionClarity",
        "craft",
      ].map((k) => [k, "测试夹具未提供真实任务主体，不能判断这一维度。"]),
    ),
    limitations: ["仅用于验证同步指纹，不代表真实实验产物。"],
    captureManifest:
      "catalog/screenshot-captures/test/sample--unknown-unknown-r01.json",
    reviewedFrames: ["desktop-initial", "mobile-initial"],
    evidence:
      "这是测试夹具的证据说明，截图未展示任务主体，因此不能给出数值评分。",
  };
  f.write(
    "catalog/scoring-rubric.json",
    JSON.stringify({
      version: 3,
      tasks: { "sample/v1": { promptHash: hash("真实正文"), checks: [] } },
    }),
  );
  const png = fs.readFileSync(
    path.join(f.temporary, directory, record.screenshot),
  );
  const capture = {
    runId: record.id,
    topicId: "sample",
    promptId: "v1",
    inputHash: hash("真实输入"),
    status: "captured",
    capturedAt: "2026-10-22T00:00:00Z",
    environment: {
      browser: "fixture",
      deviceScaleFactor: 1,
      analytics: "blocked",
    },
    frames: ["desktop-initial", "mobile-initial"].map((id) => ({
      id,
      file: directory + "/" + record.screenshot,
      sha256: crypto.createHash("sha256").update(png).digest("hex"),
      width: 1,
      height: 1,
      viewport: { width: 1, height: 1 },
      observation: {},
    })),
    actions: [],
    errors: [],
    failedRequests: [],
  };
  f.write(record.score.captureManifest, JSON.stringify(capture));
  const save = () => fs.writeFileSync(file, JSON.stringify(record));
  save();
  return { ...f, file, record, save };
}

test("demo sync rejects conflicting flags without writes and accepts an external preview without local pages", () => {
  const f = preparedDraft();
  try {
    const before = fs.readFileSync(f.file, "utf8");
    assert.throws(
      () =>
        run(f.temporary, [
          "sample--unknown-unknown-r01",
          "--check",
          "--finalize",
        ]),
      /不能同时使用/,
    );
    assert.equal(fs.readFileSync(f.file, "utf8"), before);
    const output = run(f.temporary, ["sample--unknown-unknown-r01", "--check"]);
    assert.match(output, /待同步/);
    assert.equal(fs.readFileSync(f.file, "utf8"), before);
    f.record.preview.externalUrl = "http://example.com/demo";
    f.save();
    assert.throws(
      () => run(f.temporary, ["sample--unknown-unknown-r01", "--finalize"]),
      /HTTPS/,
    );
    f.record.preview.externalUrl = "https://example.com/demo";
    f.save();
    run(f.temporary, ["sample--unknown-unknown-r01", "--finalize"]);
    assert.equal(JSON.parse(fs.readFileSync(f.file)).status, "ready");
  } finally {
    cleanup(f.temporary);
  }
});

test("demo sync blocks stale evidence for both rated and insufficient reviews", () => {
  const f = preparedDraft();
  try {
    for (const status of ["rated", "insufficient"]) {
      f.record.score.status = status;
      f.record.score.inputHash = "outdated";
      f.save();
      assert.throws(
        () => run(f.temporary, ["sample--unknown-unknown-r01", "--finalize"]),
        /不一致/,
      );
      const result = JSON.parse(fs.readFileSync(f.file));
      assert.equal(result.status, "draft");
      assert.equal(result.score.inputHash, "outdated");
    }
  } finally {
    cleanup(f.temporary);
  }
});

test("demo sync rejects a new supplemental capture without refreshing existing review fingerprints", () => {
  const f = preparedDraft();
  try {
    const id = "sample--unknown-unknown-r01";
    run(f.temporary, [id]);
    const before = JSON.parse(fs.readFileSync(f.file));
    f.write(
      "catalog/screenshot-captures/supplement/" + id + ".json",
      fs.readFileSync(path.join(f.temporary, before.score.captureManifest)),
    );
    assert.throws(
      () => run(f.temporary, [id, "--finalize"]),
      /不一致|Capture inventory changed/,
    );
    const after = JSON.parse(fs.readFileSync(f.file));
    assert.equal(after.status, "draft");
    assert.equal(
      after.score.captureInventoryHash,
      before.score.captureInventoryHash,
    );
    assert.equal(after.score.evidenceSetHash, before.score.evidenceSetHash);
  } finally {
    cleanup(f.temporary);
  }
});

test("demo sync cannot refresh a changed prompt referenced by a registered run", () => {
  const f = preparedDraft();
  try {
    f.write(
      "demos/sample/runs/unknown-unknown-r02/run.json",
      JSON.stringify({
        ...f.record,
        id: "sample--unknown-unknown-r02",
        status: "ready",
        screenshot: null,
      }),
    );
    f.write("demos/sample/runs/unknown-unknown-r02/prompt.md", "历史输入");
    const promptFile = path.join(
      f.temporary,
      "demos/sample/prompts/v1/prompt.json",
    );
    const before = fs.readFileSync(promptFile, "utf8");
    assert.throws(
      () => run(f.temporary, ["sample--unknown-unknown-r01"]),
      /新建提示词版本/,
    );
    assert.equal(fs.readFileSync(promptFile, "utf8"), before);
  } finally {
    cleanup(f.temporary);
  }
});
