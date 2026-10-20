import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "../scripts/lib.mjs";

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
    JSON.stringify({ version: 2, dimensionMaximums: {}, tasks: {} }),
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
    fs.writeFileSync(
      path.join(runDirectory, "prompt.md"),
      "真实原始输入\n",
    );
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
