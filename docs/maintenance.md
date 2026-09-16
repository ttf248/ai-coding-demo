# 实验档案维护指南

## 发布保持不变

仓库根目录就是 GitHub Pages 发布目录。继续使用已有分支自动发布及 CNB → GitHub 同步。提交源码、目录数据和必要的预览产物即可发布；不新增 Actions 发布工作流，不改发布源、域名或同步配置。

`index.html`、`topic.html`、`compare.html`、`assets/`、`previews/` 都是要提交的站点文件。构建缓存、`node_modules/`、demo 自身的 `dist/` 不提交。页面之间使用相对链接，支持域名根目录与 `/ai-coding-demo/` 子路径。整体站点使用 HTTP 预览，单 HTML demo 仍可直接打开。

需要后端或独立运行环境的项目继续由维护者人工部署到 Vercel；本站只登记实际地址。不因为目录改造推测这些服务已部署。已有 Vercel 项目后续从新目录构建时，需要在 Vercel 项目设置中将 Root Directory 更新为对应 `demos/{topic}/runs/{run}/`（股票前端再追加 `frontend`），原有域名与环境变量保持原配置。

## 目录和唯一事实来源

- `demos/{topic}/topic.json`：主题名称、简介、分类、标签。
- `demos/{topic}/prompts/{version}/`：不可覆盖的任务正文及来源。
- `demos/{topic}/runs/{run}/run.json`：每次实验的模型、档位、日期、输入、产物与预览配置。
- 每次实验的 `prompt.md`：完整原始输入快照；`Readme.md` 保留原始说明、复盘与自动元信息区块。
- `catalog/models.json`、`categories.json`、`guides.json`：共享字典和技术索引。
- `assets/generated/catalog.js`：自动生成的浏览器数据，不手改。
- 根 README 的 catalog 区块、主题 README、实验 README 的 archive 区块由脚本维护。区块外的历史记录不会被生成器覆盖。

所有元数据使用 `schemaVersion: 1`，契约见 [schema](../catalog/schema.json)。实验 ID 为 `{topic}--{run}`；目录用小写 kebab-case，显示名称不受 slug 限制。模型重跑新增 `r02`，不是覆盖 `r01`。未知模型用 `unknown`；日期允许年、月、日精度，缺失为 null。

## 新增实验

首次维护使用 Node 22+，在根目录执行 `npm ci`。已有实验的预览不需要安装依赖即可通过静态服务器打开。

```sh
npm run new:demo -- --topic voxel-construction-site --title "新的工地实验" --model gpt-6-astra --effort high --type single-html --prompt v1
```

未提供 `--prompt` 时创建新的提示词草稿；新模型先加入模型字典。脚手架生成 draft，无预览，不制造虚假入口。补充以下信息后再标记 ready：

1. 写入真实任务正文和完整原始输入。相同正文复用已有 prompt ID，不覆盖已有正文。
2. 放入产物，填写说明、日期、技术栈、工具、网络要求以及 preview 配置。
3. 首次定稿时计算输入 hash，并填入 `input.hash`；新任务正文的 hash 同样写入 prompt.json。已归档输入变化必须新建实验或提示词版本，不能用更新 hash 掩盖改写。
4. 保留原始提示词或在 README 中链接本目录的 `prompt.md`；补充运行与验证记录。

计算输入指纹（替换文件路径）：

```sh
node --input-type=module -e "import {read,hash} from './scripts/lib.mjs'; console.log(hash(read('demos/TOPIC/runs/RUN/prompt.md')))"
```

### 预览配置

静态单文件和原型设置 `preview.kind: "static"`，入口相对于实验目录。新单文件入口用 `index.html`。多页面配置 `pages`，每项包含 `id`、`label`、`path`，`defaultPage` 指向其中一项。

```json
{"kind":"static","pages":[{"id":"index","label":"主页面","path":"index.html"}],"defaultPage":"index","network":"required","embed":true,"externalUrl":null}
```

可构建为纯静态的前端设置 `kind: "build"`，提交自己的 package-lock.json 和 build 配置：

```json
{"command":["run","build","--","--base=./"],"output":"dist"}
```

```sh
npm run build:demo -- bluebook--minimax-m2-unknown-r01
```

脚本在该实验内 `npm ci`、执行登记的 npm 命令，复制产物到 `previews/{topic}/{run}/` 并记录源码和输出指纹。预览产物必须随源码提交；不要只提交源码 `index.html`。指纹覆盖源码、图片、构建配置与构建脚本，不含文档。默认每个 demo 独立依赖，不合并 lockfile。

外部部署设置 `kind: "external"`、HTTPS `externalUrl`、空 `pages`、null `defaultPage`、null `build`，默认 `embed: false`，确认允许 iframe 后才能启用。仅源码或提示词记录设置 `kind: "none"`、`embed: false`，不提供伪预览。外部备用地址放在 `links` 中。

```sh
npm run generate
npm run validate
npm test
npm run preview
```

在浏览器打开 http://127.0.0.1:4173/ 检查新增主题与对比入口，然后提交。这些是提交前维护步骤，不是新的发布流程。

## 提示词与对比的含义

完整输入只规范换行和 BOM 后计算指纹，不删除空白、模型名称或改写措辞。共同任务正文需要明确提取并在 prompt.json 记录提取方法。原文一致、正文一致、同主题不同输入和跨主题分别标注。多轮追加输入、系统上下文、图片等材料没有留存时标记 partial，不能宣称公平评测。

需要补充新一轮输入或改进实现时，新增实验记录；保留前一次文件，在 `environment.notes` 和 `changes` 记录来源、追加输入及人工修改。未知模型、日期、平台不猜测。

对比 URL 只接受目录中的实验 ID，可选择子页面；两侧独立运行，无自动评分。手机只加载当前侧，切换可能重置状态；卸载会释放页面。外部站点嵌入失败时独立打开。双开 WebGL 不能作为单项目性能结论。

## 校验和浏览器回归

`npm run validate` 检查 schema、唯一 ID、引用、大小写敏感的文件路径、默认入口、输入指纹、构建新鲜度、产物完整性及生成区块；生成器重复执行应无差异。

```sh
npx playwright install chromium
npm run test:browser
```

已有浏览器可通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 指定可执行文件。回归测试同时覆盖根路径与 Pages 子路径、桌面和手机、目录交互、对比 URL 恢复和预览链接。历史 demo 的 CDN 不稳定与浏览器本身的功能限制，不应被误报为站点目录逻辑通过。

## 技术主题与迁移

技术主题继续放 `docs/{slug}/`，包含 `Readme.md` 与示例，并在 `catalog/guides.json` 登记明确入口，不从文件名猜测。

V2 的旧路径对照保存在 [迁移清单](../catalog/migration-v2.json)，旧目录不做重定向。历史输入中的路径属于证据，保留；当前有效文档和代码链接必须更新。迁移不能顺带改善历史 demo 的视觉或逻辑，必要部署适配写入 `changes`。
