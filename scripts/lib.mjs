import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export function resolveLocal(p) {
  if (
    typeof p !== "string" ||
    !p ||
    p.includes("\\") ||
    path.isAbsolute(p) ||
    p.split("/").includes("..")
  )
    throw Error(`Invalid relative path: ${p}`);
  const full = path.resolve(ROOT, p);
  if (!full.startsWith(ROOT + path.sep))
    throw Error(`Outside repository: ${p}`);
  return full;
}
export const read = (p) => fs.readFileSync(resolveLocal(p), "utf8");
export const readJSON = (p) => JSON.parse(read(p));
export function write(p, content) {
  fs.mkdirSync(path.dirname(resolveLocal(p)), { recursive: true });
  fs.writeFileSync(resolveLocal(p), content);
}
export const writeJSON = (p, value) =>
  write(p, JSON.stringify(value, null, 2) + "\n");
export const normalize = (text) =>
  text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
export const hash = (text) =>
  crypto.createHash("sha256").update(normalize(text)).digest("hex");
const ignoredArchiveNames = new Set([".gitignore", "rename.bat"]);
const ignoredArchiveDirs = new Set([
  ".claude",
  ".cursor",
  ".windsurf",
  ".codex",
]);
const isIgnoredArchiveFile = (f) => {
  const relative = f.split(/[\\/]/);
  const name = relative.at(-1);
  return (
    ignoredArchiveNames.has(name) ||
    ignoredArchiveDirs.has(relative.find((part) => ignoredArchiveDirs.has(part))) ||
    (name?.startsWith(".env") && !name.endsWith(".example") && !name.endsWith(".sample") && !name.endsWith(".template")) ||
    name?.endsWith(".local")
  );
};
const contentBytes = (f) =>
  /\.(?:json|[cm]?js|tsx?|html|css|txt|svg|bat|gitignore)$/.test(f)
    ? normalize(read(f))
    : fs.readFileSync(resolveLocal(f));
export const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function folders(p) {
  return fs
    .readdirSync(resolveLocal(p), { withFileTypes: true })
    .filter((v) => v.isDirectory())
    .map((v) => v.name)
    .sort();
}
export function files(
  p,
  ignore = new Set(["node_modules", "dist", ".git", "build"]),
) {
  return fs
    .readdirSync(resolveLocal(p), { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .flatMap((v) =>
      ignore.has(v.name)
        ? []
        : v.isDirectory()
          ? files(`${p}/${v.name}`, ignore)
          : [`${p}/${v.name}`],
    );
}
export function sourceHash(run) {
  const h = crypto.createHash("sha256");
  for (const f of files(run.directory)) {
    // Documentation changes do not require rebuilding the preview.
    if (/\.(md)$/i.test(f) || f.endsWith("/run.json") || isIgnoredArchiveFile(f)) continue;
    h.update(f.slice(run.directory.length + 1));
    h.update("\0");
    h.update(contentBytes(f));
    h.update("\0");
  }
  h.update(JSON.stringify(run.build));
  h.update(normalize(read("scripts/build-demo.mjs")));
  return h.digest("hex");
}
export function treeHash(directory) {
  const h = crypto.createHash("sha256");
  for (const f of files(directory)) {
    if (f.endsWith("/build-info.json") || isIgnoredArchiveFile(f)) continue;
    h.update(f.slice(directory.length + 1));
    h.update("\0");
    h.update(contentBytes(f));
    h.update("\0");
  }
  return h.digest("hex");
}
export function loadCatalog() {
  const topics = [],
    runs = [],
    prompts = [];
  for (const topicId of folders("demos")) {
    const base = `demos/${topicId}`;
    topics.push({ ...readJSON(`${base}/topic.json`), directory: base });
    for (const promptId of folders(`${base}/prompts`)) {
      const directory = `${base}/prompts/${promptId}`;
      const text = normalize(read(`${directory}/prompt.md`));
      prompts.push({
        ...readJSON(`${directory}/prompt.json`),
        directory,
        text,
        hash: hash(text),
      });
    }
    for (const runId of folders(`${base}/runs`)) {
      const directory = `${base}/runs/${runId}`;
      const run = readJSON(`${directory}/run.json`);
      const raw = normalize(read(`${directory}/${run.input.file}`));
      const prefix =
        run.preview.kind === "build"
          ? `previews/${topicId}/${runId}`
          : directory;
      runs.push({
        ...run,
        directory,
        raw,
        rawHash: hash(raw),
        document: `${directory}/Readme.md`,
        preview: {
          ...run.preview,
          pages: run.preview.pages.map((p) => ({
            ...p,
            href: `${prefix}/${p.path}`,
          })),
        },
      });
    }
  }
  return {
    schemaVersion: 1,
    topics,
    runs,
    prompts,
    models: readJSON("catalog/models.json"),
    categories: readJSON("catalog/categories.json"),
    guides: readJSON("catalog/guides.json"),
  };
}
export function generatedFiles(catalog) {
  const outputs = new Map();
  const { topics, runs, guides } = catalog;
  outputs.set(
    "assets/generated/catalog.js",
    "// Generated by npm run generate. Do not edit.\nwindow.ARCHIVE = " +
      JSON.stringify(catalog).replace(/</g, "\\u003c") +
      ";\n",
  );
  const table = (list) =>
    "| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |\n|---|---|---|---|---|\n" +
    list
      .map((r) => {
        const model =
          catalog.models.find((m) => m.id === r.modelId)?.label || r.modelId;
        const preview =
          r.preview.pages.find((p) => p.id === r.preview.defaultPage)?.href ||
          r.preview.externalUrl;
        return `| [${r.title.replaceAll("|", "\\|")}](${r.document}) | ${model} / ${r.effort} | ${r.date || "未记录"} | [${r.promptId}](${r.directory}/prompt.md) | ${preview ? `[打开](${preview})` : "无静态预览"} |`;
      })
      .join("\n");
  const count = runs.filter((r) => r.preview.kind !== "none").length;
  const section =
    `\n## 项目统计\n\n- 实验主题：${topics.length}\n- 实验记录：${runs.length}\n- 可预览记录：${count}\n- 技术主题：${guides.length}\n\n## 实验目录\n\n` +
    topics
      .map(
        (t) =>
          `### ${t.title}\n\n[主题与版本对比](topic.html?id=${t.id}) · [主题说明](${t.directory}/Readme.md)\n\n${table(runs.filter((r) => r.topicId === t.id))}`,
      )
      .join("\n\n") +
    "\n\n## 技术文档\n\n" +
    guides
      .map((g) => `- [${g.title}](${g.document}) · [运行示例](${g.example})`)
      .join("\n") +
    "\n";
  const replaceBlock = (text, label, content) => {
    const a = `<!-- ${label}:start -->`,
      b = `<!-- ${label}:end -->`;
    if (!text.includes(a) || !text.includes(b))
      throw Error(`Missing generated block: ${label}`);
    return (
      text.slice(0, text.indexOf(a) + a.length) +
      content +
      text.slice(text.indexOf(b))
    );
  };
  outputs.set("Readme.md", replaceBlock(read("Readme.md"), "catalog", section));
  for (const t of topics) {
    const localTable = table(runs.filter((r) => r.topicId === t.id))
      .replaceAll("](demos/", "](../../demos/")
      .replaceAll("](previews/", "](../../previews/");
    outputs.set(
      `${t.directory}/Readme.md`,
      `<!-- Generated by npm run generate. -->\n# ${t.title}\n\n${t.description}\n\n[打开主题目录](../../topic.html?id=${t.id})\n\n${localTable}\n`,
    );
  }
  for (const r of runs) {
    const original = read(r.document);
    const prefix = original.includes("<!-- archive:start -->")
      ? original
      : original.trimEnd() +
        "\n\n<!-- archive:start -->\n<!-- archive:end -->\n";
    const model = catalog.models.find((m) => m.id === r.modelId)?.label;
    const content =
      `\n## 当前归档信息（自动生成）\n\n- 实验 ID：\`${r.id}\`\n- 模型：${model}；推理档位：${r.effort}\n- 类型：${r.type}；预览：${r.preview.kind}；网络：${r.preview.network}\n- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=${r.topicId})\n- 输入记录：${r.input.notes}\n- 工具：${r.environment.tool || "未记录"}。${r.environment.notes}\n- 运行方式：${r.preview.kind === "static" ? "浏览器直接打开本目录入口；CDN/外部素材需要联网。" : r.preview.kind === "build" ? "在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。" : r.preview.kind === "external" ? "使用登记的外部地址，独立部署由维护者操作。" : "无静态预览，参见上方历史说明与源码。"}\n` +
      r.preview.pages
        .map((p) => `- [${p.label}](../../../../${p.href})`)
        .join("\n") +
      "\n\n### 部署适配记录\n\n" +
      (r.changes.length
        ? r.changes.map((c) => `- ${c}`).join("\n")
        : "无新增实现改动。") +
      "\n";
    outputs.set(r.document, replaceBlock(prefix, "archive", content));
  }
  return outputs;
}
