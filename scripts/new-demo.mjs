import fs from "node:fs";
import { parseArgs } from "node:util";
import {
  readJSON,
  writeJSON,
  write,
  resolveLocal,
  hash,
  loadCatalog,
} from "./lib.mjs";
const { values } = parseArgs({
  options: {
    "allow-archived": { type: "boolean" },
    ...Object.fromEntries(
      ["topic", "title", "model", "effort", "type", "prompt"].map((k) => [
        k,
        { type: "string" },
      ]),
    ),
  },
});
const {
  topic,
  title,
  model = "unknown",
  effort = "unknown",
  type = "single-html",
  prompt,
} = values;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
if (
  !slug.test(topic || "") ||
  !title ||
  !slug.test(model) ||
  !slug.test(effort)
)
  throw Error(
    'Usage: npm run new:demo -- --topic topic-slug --title "Title" [--model model-slug --effort high --type single-html --prompt v1]',
  );
if (
  !["single-html", "prototype", "app", "fullstack", "prompt", "other"].includes(
    type,
  )
)
  throw Error("Unknown type");
const catalog = loadCatalog();
if (
  catalog.topics.find((t) => t.id === topic)?.testingStatus === "archived" &&
  !values["allow-archived"]
)
  throw Error(
    "This topic is archived and excluded from future testing. Restore it first, or explicitly use --allow-archived for a one-off run.",
  );
if (!catalog.models.some((m) => m.id === model))
  throw Error("Register model in catalog/models.json first.");
// 查重：主题、提示词和模型都不重复登记。提示词正文相同是允许的
// （同一任务正文可以对应不同原始输入），这里只提示可以复用的版本。
const notes = [];
const slugOf = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
for (const existing of catalog.topics) {
  if (existing.id === topic) continue;
  if (existing.title === title)
    notes.push(
      `主题「${existing.title}」（${existing.id}）与本次标题相同，确认不是重复登记。`,
    );
  else {
    // 中文标题规范化后为空，只能按标题原文比对，不能按空 slug 匹配。
    const slug = slugOf(title);
    if (slug && slugOf(existing.title) === slug)
      notes.push(
        `主题「${existing.title}」（${existing.id}）与本次标题的规范化形式相同，确认不是重复登记。`,
      );
  }
}
for (const existing of catalog.models) {
  if (existing.id === model) continue;
  if (existing.label === model)
    notes.push(
      `模型「${existing.label}」（${existing.id}）与本次 ${model} 指向同一型号，确认模型字典没有重复条目。`,
    );
  else {
    const slug = slugOf(existing.label);
    if (slug && slug === model)
      notes.push(
        `模型「${existing.label}」（${existing.id}）与本次 ${model} 指向同一型号，确认模型字典没有重复条目。`,
      );
  }
}
if (prompt) {
  const target = catalog.prompts.find(
    (p) => p.topicId === topic && p.id === prompt,
  );
  const same = catalog.prompts.filter(
    (p) => p.topicId === topic && p.id !== prompt && p.hash === target?.hash,
  );
  if (same.length)
    notes.push(
      `提示词 ${prompt} 与 ${same.map((p) => p.id).join("、")} 正文相同，属于同一任务正文的不同版本，不需要重复登记。`,
    );
}
const base = `demos/${topic}`;
if (
  prompt &&
  !catalog.prompts.some((p) => p.topicId === topic && p.id === prompt)
)
  throw Error("Requested prompt does not exist");
if (!fs.existsSync(resolveLocal(`${base}/topic.json`)))
  writeJSON(`${base}/topic.json`, {
    schemaVersion: 1,
    id: topic,
    title,
    description: "待补充",
    category:
      type === "fullstack"
        ? "fullstack"
        : type === "prompt"
          ? "prompt"
          : "frontend",
    tags: [],
  });
let n = 1;
while (
  fs.existsSync(
    resolveLocal(
      `${base}/runs/${model}-${effort}-r${String(n).padStart(2, "0")}`,
    ),
  )
)
  n++;
const runId = `${model}-${effort}-r${String(n).padStart(2, "0")}`,
  dir = `${base}/runs/${runId}`,
  id = `${topic}--${runId}`;
let pId = prompt;
if (!pId) {
  let v = 1;
  while (fs.existsSync(resolveLocal(`${base}/prompts/v${v}`))) v++;
  pId = `v${v}`;
  write(`${base}/prompts/${pId}/prompt.md`, "待填写任务正文");
  writeJSON(`${base}/prompts/${pId}/prompt.json`, {
    schemaVersion: 1,
    id: pId,
    topicId: topic,
    title: `任务正文 ${pId}`,
    previousId: null,
    source: `${dir}/prompt.md`,
    extraction: "待记录正文与原始输入的关系",
    hash: hash("待填写任务正文"),
  });
}
write(`${dir}/prompt.md`, "待填写完整原始输入");
write(
  `${dir}/Readme.md`,
  `# ${title}\n\n## 原始提示词\n\n见 [完整原始输入](prompt.md)。\n\n## 运行与复盘\n\n待补充运行方式、入口和验证记录。\n`,
);
writeJSON(`${dir}/run.json`, {
  schemaVersion: 1,
  id,
  runId,
  topicId: topic,
  promptId: pId,
  title,
  modelId: model,
  effort,
  date: new Date().toISOString().slice(0, 10),
  description: "待补充",
  type,
  status: "draft",
  archivedAt: new Date().toISOString().slice(0, 10),
  sourceRunId: null,
  screenshotCapturedAt: null,
  stack: [],
  tags: [],
  input: {
    file: "prompt.md",
    hash: hash("待填写完整原始输入"),
    completeness: "unknown",
    notes: "待补充",
  },
  environment: { tool: null, toolId: null, notes: "未记录" },
  changes:
    values["allow-archived"] &&
    catalog.topics.find((t) => t.id === topic)?.testingStatus === "archived"
      ? ["显式追加已归档主题实验；主题归档状态保持不变。"]
      : [],
  preview: {
    kind: "none",
    pages: [],
    defaultPage: null,
    network: "unknown",
    embed: false,
    externalUrl: null,
  },
  score: {
    rubricVersion: 3,
    status: "pending",
    total: null,
    dimensions: null,
    taskChecks: null,
    visualChecks: null,
    observations: null,
    confidence: null,
    limitations: [],
    captureManifest: null,
    evidenceSetHash: null,
    captureInventoryHash: null,
    rubricHash: null,
    reviewedFrames: [],
    captureState: null,
    ceiling: null,
    assessedAt: null,
    screenshotHash: null,
    inputHash: null,
    criteriaHash: null,
    evidence: "草稿待补齐真实截图并按案例评分规则完成评分。",
  },
  build: null,
  links: [],
});
console.log(
  `Created ${dir}. Fill prompt and metadata, then run npm run demo:sync -- ${id} to write the input fingerprint and list what is still missing. Drafts have no preview by default.`,
);
for (const note of notes) console.log(`注意：${note}`);
