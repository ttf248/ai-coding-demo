import fs from "node:fs";
import { parseArgs } from "node:util";
import {
  read,
  readJSON,
  writeJSON,
  normalize,
  hash,
  loadCatalog,
  resolveLocal,
} from "./lib.mjs";
import {
  criteriaHash,
  scoreErrors,
  rubricFingerprint,
  captureInventoryHash,
} from "./scoring.mjs";
import { evidenceSetHash } from "./scoring-v3.mjs";

// 导入案例时的机械字段同步：输入指纹、提示词指纹和首次评分指纹由脚本写入，
// 事实性内容（运行方式、复盘、分数、预览入口）仍由维护者填写。
//
// 只处理 draft 记录：已入库记录的输入属于历史证据，脚本不代为改写。
const parsed = parseArgs({
  options: {
    check: { type: "boolean" },
    finalize: { type: "boolean" },
  },
  allowPositionals: true,
});
const values = parsed.values;
if (values.check && values.finalize)
  throw Error("--check 与 --finalize 不能同时使用：只读检查不会执行入库。");
const runId = parsed.positionals?.[0];
if (!runId)
  throw Error("Usage: npm run demo:sync -- <run-id> [--check] [--finalize]");

const catalog = loadCatalog();
const run = catalog.runs.find((item) => item.id === runId);
if (!run) throw Error(`Unknown run: ${runId}`);
if (run.status !== "draft")
  throw Error(
    `${runId} is already registered (status: ${run.status}). Registered inputs are historical evidence; create a new run instead of rewriting them.`,
  );

const runFile = `${run.directory}/run.json`;
const promptDirectory = `demos/${run.topicId}/prompts/${run.promptId}`;
const promptFile = `${promptDirectory}/prompt.json`;
const raw = normalize(read(`${run.directory}/${run.input.file}`));
const rawHash = hash(raw);
const taskText = normalize(read(`${promptDirectory}/prompt.md`));
const taskHash = hash(taskText);
const stored = readJSON(runFile);
const storedPrompt = readJSON(promptFile);
const rubric = readJSON("catalog/scoring-rubric.json");
const definition = rubric.tasks?.[`${run.topicId}/${run.promptId}`];

const changes = [];
let runChanged = false;
if (stored.input.hash !== rawHash) {
  changes.push(`input.hash ${stored.input.hash} -> ${rawHash}`);
  stored.input.hash = rawHash;
  runChanged = true;
}
if (storedPrompt.hash !== taskHash) {
  const registered = catalog.runs.find(
    (item) =>
      item.topicId === run.topicId &&
      item.promptId === run.promptId &&
      item.status !== "draft",
  );
  if (registered)
    throw Error(
      `任务正文已被 ${registered.id} 入库引用，不能刷新其指纹；请恢复历史正文并新建提示词版本。`,
    );
  changes.push(`prompt ${run.promptId} hash -> ${taskHash}`);
  storedPrompt.hash = taskHash;
}
// 评分指纹只在还没有记录时补上；已存在的指纹与当前文件不一致说明证据变了，
// 必须重新看图复核，不能只刷新指纹。
const score = stored.score || {};
const scoreChanges = [];
if (["rated", "insufficient"].includes(score.status)) {
  const screenshotHash = run.screenshotInfo?.hash || null;
  const fingerprints = [
    ["screenshotHash", screenshotHash],
    ["inputHash", rawHash],
    ["criteriaHash", definition ? criteriaHash(definition) : null],
    ["rubricHash", rubricFingerprint(rubric)],
  ];
  if (score.captureManifest) {
    try {
      const capture = readJSON(score.captureManifest);
      // Hashes can be filled once, but the explicit reviewed frame list remains manual.
      fingerprints.push(
        ["evidenceSetHash", evidenceSetHash(capture)],
        ["captureInventoryHash", captureInventoryHash(run.id)],
      );
    } catch {
      /* The scoring checklist reports a missing or invalid manifest. */
    }
  }
  for (const [field, value] of fingerprints) {
    if (!value) continue;
    if (score[field] === null || score[field] === undefined) {
      scoreChanges.push(`${field} 补写`);
      score[field] = value;
      runChanged = true;
    } else if (score[field] !== value) {
      scoreChanges.push(`${field} 与当前文件不一致，需要重新复核后再写入`);
    }
  }
}

// 导入清单：只报告事实，不替维护者判断或补齐。
const checklist = [];
const placeholder = (text, exact) => text.trim() === exact;
if (placeholder(raw, "待填写完整原始输入"))
  checklist.push("输入正文仍是脚手架占位文字");
if (placeholder(taskText, "待填写任务正文"))
  checklist.push("提示词正文仍是脚手架占位文字");
if (stored.description === "待补充") checklist.push("description 仍是占位文字");
if (stored.input.notes === "待补充") checklist.push("input.notes 仍是占位文字");
if (!run.screenshot) checklist.push("未登记截图");
else if (!fs.existsSync(resolveLocal(`${run.directory}/${run.screenshot}`)))
  checklist.push(`截图文件不存在：${run.screenshot}`);
if (stored.preview.kind === "none")
  checklist.push("preview.kind 仍为 none，入库前必须登记可嵌入的预览入口");
if (!stored.preview.embed)
  checklist.push("preview.embed 仍为 false，入库前必须确认可嵌入对比页");
if (
  ["static", "build"].includes(stored.preview.kind) &&
  !stored.preview.pages.some((page) => page.id === stored.preview.defaultPage)
)
  checklist.push("preview.defaultPage 未指向已登记的页面");
if (stored.preview.kind === "external") {
  try {
    if (new URL(stored.preview.externalUrl).protocol !== "https:")
      throw Error("HTTPS required");
  } catch {
    checklist.push("外部预览必须登记有效的 HTTPS 地址");
  }
  if (stored.preview.pages.length || stored.preview.defaultPage !== null)
    checklist.push("外部预览应使用空 pages 和 null defaultPage");
}
if (score.status === "pending")
  checklist.push("评分仍为 pending，需要按案例评分规则复核后写入");
if (["rated", "insufficient"].includes(score.status) && !definition)
  checklist.push(
    `任务 ${run.topicId}/${run.promptId} 尚未在 catalog/scoring-rubric.json 登记检查项`,
  );
if (scoreChanges.some((item) => item.includes("不一致")))
  checklist.push("评分指纹与当前文件不一致，需要重新复核");
checklist.push(...scoreErrors({ ...run, score, rawHash }, rubric));
if (definition && definition.promptHash !== taskHash)
  checklist.push("任务检查项绑定的正文已变化，需要更新检查项并重新复核");
// 预览入口的实际路径与目录里的登记一致：构建型实验指向已提交的 previews 产物。
const previewPrefix =
  stored.preview.kind === "build"
    ? `previews/${run.topicId}/${run.runId}`
    : run.directory;
for (const page of stored.preview.pages) {
  const href = `${previewPrefix}/${page.path}`;
  if (!href.endsWith(".html")) continue;
  const file = resolveLocal(href);
  if (!fs.existsSync(file)) {
    checklist.push(`预览页面不存在：${href}`);
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  if (/googletagmanager\.com|gtag\('config'|G-8E54P1HX3G/.test(text))
    checklist.push(
      `${href} 内联了 Google tag，应改用公共脚本 assets/analytics.js`,
    );
  else if (!/assets\/analytics\.js/.test(text))
    checklist.push(`${href} 未引用公共脚本 assets/analytics.js`);
}

if (!values.check) {
  if (runChanged) {
    stored.score = score;
    writeJSON(runFile, stored);
  }
  if (storedPrompt.hash !== readJSON(promptFile).hash) {
    storedPrompt.hash = taskHash;
    writeJSON(promptFile, storedPrompt);
  }
}

console.log(`${runId} (${run.directory})`);
console.log(
  changes.length
    ? `  ${values.check ? "待同步" : "已同步"}：${changes.join("；")}`
    : "  输入与提示词指纹已经是最新，无需改动",
);
if (scoreChanges.length) console.log(`  评分指纹：${scoreChanges.join("；")}`);
console.log(
  checklist.length
    ? `  待完成 ${checklist.length} 项：\n${checklist.map((item) => `    - ${item}`).join("\n")}`
    : "  导入清单全部通过",
);

if (values.finalize) {
  const blocking = checklist;
  if (blocking.length) {
    console.error(
      `\n还不能把 ${runId} 置为 ready：\n${blocking
        .map((item) => `  - ${item}`)
        .join("\n")}`,
    );
    process.exitCode = 1;
  } else {
    const current = readJSON(runFile);
    current.status = "ready";
    writeJSON(runFile, current);
    console.log(
      `  已把 ${runId} 的 status 置为 ready；接着运行 npm run generate 与 npm run validate。`,
    );
  }
} else if (values.check) console.log("  --check：未写入任何文件");
