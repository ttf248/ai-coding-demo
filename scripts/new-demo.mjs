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
  options: Object.fromEntries(
    ["topic", "title", "model", "effort", "type", "prompt"].map((k) => [
      k,
      { type: "string" },
    ]),
  ),
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
if (!catalog.models.some((m) => m.id === model))
  throw Error("Register model in catalog/models.json first.");
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
  stack: [],
  tags: [],
  input: {
    file: "prompt.md",
    hash: hash("待填写完整原始输入"),
    completeness: "unknown",
    notes: "待补充",
  },
  environment: { tool: null, notes: "未记录" },
  changes: [],
  preview: {
    kind: "none",
    pages: [],
    defaultPage: null,
    network: "unknown",
    embed: false,
    externalUrl: null,
  },
  build: null,
  links: [],
});
console.log(
  `Created ${dir}. Fill prompt and metadata, calculate input hash with node, then generate and validate. Drafts have no preview by default.`,
);
