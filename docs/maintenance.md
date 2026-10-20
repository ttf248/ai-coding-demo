# 实验档案维护指南

## 发布保持不变

仓库根目录就是 GitHub Pages 发布目录。继续使用已有分支自动发布及 CNB → GitHub 同步。提交源码、目录数据和必要的预览产物即可发布；不新增 Actions 发布工作流，不改发布源、域名或同步配置。

`index.html`、`topic.html`、`compare.html`、`assets/`、`previews/` 都是要提交的站点文件。构建缓存、`node_modules/`、demo 自身的 `dist/` 不提交。页面之间使用相对链接，支持域名根目录与 `/ai-coding-demo/` 子路径。整体站点使用 HTTP 预览，单 HTML demo 仍可直接打开。

需要后端或独立运行环境的项目继续由维护者人工部署到 Vercel；本站只登记实际地址。不因为目录改造推测这些服务已部署。目录迁移不会自动修改 Vercel 项目设置：迁移后先按 [Vercel Root Directory 对照表](vercel-root-directories.md) 更新 Root Directory，再重新部署；原有域名与环境变量保持原配置。股票项目的 Vercel 根目录需要指向 `demos/stock-watching/runs/unknown-unknown-r01/frontend/`。

## 目录和唯一事实来源

- `demos/{topic}/topic.json`：主题名称、简介、分类、标签。
- `demos/{topic}/prompts/{version}/`：不可覆盖的任务正文及来源。
- `demos/{topic}/runs/{run}/run.json`：每次实验的模型、档位、日期、输入、产物与预览配置。
- 每次实验的 `prompt.md`：完整原始输入快照；`Readme.md` 保留原始说明、复盘与自动元信息区块。
- `catalog/models.json`、`categories.json`、`guides.json`：共享字典和技术索引。
- `assets/generated/catalog.js`：自动生成的浏览器数据，不手改。
- `catalog/tools.json`：运行工具及历史名称的明确别名。模型厂商由 `models.json` 登记，工具或接入平台不作为模型厂商；旧 `environment.tool` 保留原始名称，新记录可同时填写 `environment.toolId`。
- `catalog/batches.json`：费用批次字典。新实验可使用 `billing: {"type":"batch","batchId":"已登记批次"}`。既有实验中的完整费用快照继续保留，校验器核对它与字典的一致性。
- 根 README 的 catalog 区块、主题 README、实验 README 的 archive 区块由脚本维护。区块外的历史记录不会被生成器覆盖。

### 模型发布日期与排序

模型排序依据保存在 `catalog/models.json` 的 `ordering`，契约见 `catalog/schema.json` 的 `modelOrdering`。查看[完整排序及官方来源核对表](model-ordering.md)，该表及其静态阅读页由 `npm run generate` 从模型字典生成，禁止手工维护第二份顺序。

厂商内部先按 `generation` 显式登记的代际从新到旧，再按同代 `capabilityRank` 从大到小，最后按 `releaseDate` 从新到旧。代际不直接等同显示版本：GPT-6.1 Sol 与 GPT-6 Astra / Sol / Luna 归入 `[6]`；Claude Opus / Sonnet / Haiku 5.5 归入 `[5, 5]`，因此较晚发布的 Haiku 5.5 不会越过同代 Opus / Sonnet。能力优先级依据已保存的官方产品定位和比较作维护判断，仅在同厂商同代比较，不是跨代或跨厂商分数。官方依据只能确认月份时保留 `YYYY-MM`，不能补造具体日期。缺少日期置于厂商末尾；同代能力未比较的型号置于已登记优先级之后；其余并列保留版本、变体及 ID 的稳定顺序，不表示能力强弱。筛选列表、档位矩阵和对比候选统一使用 `ArchiveUI.compareModels`，不按显示名称拆解或另排一套顺序。主题页实验记录默认按截图评分排序，模型排序改为显式选择 `sort=model` 后使用（见[主题页浏览](#主题页浏览)）。

`releaseDate` 记录模型首次官方公布的日期，不是实验日期、知识截止日期、文档修改日期、降价日、区域或第三方平台接入日期。Free 等接入标签可按明确可识别的基础型号首发排序，并在 `note` 注明边界；不得将正式版日期或能力结论套用到预览检查点。型号不明确或名称与官方不一致时保持原有 ID、名称及历史输入，日期和能力填 `null`，等待维护者确认。

新增模型前执行 `npm run models:pending`。输出中的 `needsResearch` 才需要查询官方消息；已有记录直接复用，包括已明确记为未知的型号。`needsConfirmation` 是查过但仍需确认的项目，不代表每次都要重新查询。除新增缺失记录或维护者明确要求刷新外，日常生成、校验和浏览都不联网查询模型资料。保存 `checkedAt`、官方 `sources`、日期说明 `note` 和能力依据 `capabilityNote`；`status` 分别使用 `verified`（已确认）、`partial`（月份确认但日不明确）、`unresolved`（仍待确认）或 `not-applicable`（仅 unknown）。不能将未查证和查证后未知混为一谈。

实验费用写在 `run.json` 的 `billing` 中。`type: "subscription"` 记录订阅方式，未知的货币金额填 `null`；`type: "batch"` 的 `amount` 是批次合计，关联批次的多条 run 可重复引用同一 `batchId`，不得将总额误读或拆算为单案例费用。金额换算时，`sourceAmount`、`sourceUnit` 与 `conversionRate` 保留原始数值及换算比例；`amount` 和 `unit` 记录换算结果。平台没有提供的额度或费用明细保持未知，并在 `note` 说明口径。

所有元数据使用 `schemaVersion: 1`，契约见 [schema](../catalog/schema.json)。实验 ID 为 `{topic}--{run}`；目录用小写 kebab-case，显示名称不受 slug 限制。模型重跑新增 `r02`，不是覆盖 `r01`。未知模型用 `unknown`；日期允许年、月、日精度，缺失为 null。

实验日期 `date`、归档日期 `archivedAt`、截图日期 `screenshotCapturedAt` 分别登记。历史未留存的日期保持 `null`，不得用迁移日期或文件修改时间补造。脚手架只登记实际创建当天的归档日期；有明确来源的重跑或迭代填写 `sourceRunId`，无来源关系填 `null`。截图展示尺寸、指纹和缩略图由原始 PNG 自动读取和生成，不修改证据原图。

## 生成的站点资料

`npm run generate` 会更新并提交以下静态产物：

- `assets/generated/catalog.js`：列表使用的轻量摘要，不包含原始输入和任务正文。
- `assets/generated/topics/*.json`：按主题读取的详情，批次费用引用共享字典。
- `assets/generated/inputs/*.json` 与 `tasks/*.json`：按指纹去重的输入和任务正文；仅统一 BOM 与换行，原始 Markdown 不变。查看正文时按需读取，失败可重试。
- `assets/generated/readers/`：实验、主题、技术说明与维护文档的静态 HTML 阅读页，保留原文下载、目录、代码复制及相对链接。缺失的历史附件显示“文件未留存”，原文路径继续保留。
- `assets/generated/screenshots/`：480 / 960 像素 WebP 缩略图；文件名含原图指纹，列表使用 `srcset`，放大预览保留原始 PNG。
- `assets/generated/vendor/`、`guide-demos.css` 和 `guide-react.js`：技术示例的本地运行资源、许可证及预编译脚本。技术示例修改后运行 generate 即可；已归档 demo 不统一升级依赖。

技术索引在 `catalog/guides.json` 登记 `status` 与 `network`。当前示例的脚本、样式无需远程 CDN；Unsplash 与 Skeleton 示例仍需联网加载外部图片，不能标为离线。新增技术示例保持本站导航和 390px 布局，禁止占位 JSX 作为可运行入口。

这些产物与源码一起提交即可静态发布。生成脚本是维护工具，已提交站点无需安装依赖或现场构建。

## 访问统计

本站通过公共脚本 [assets/analytics.js](../assets/analytics.js) 接入 Google Analytics；测量 ID `G-8E54P1HX3G`、初始化及远程脚本加载逻辑只在该文件维护。公共页面、技术示例和生成的阅读页统一引用此文件；后续新增或导入的实验记录，其阅读页和本仓库可维护的网页入口也只需引用公共脚本，不再复制 Google tag 或初始化代码。公共脚本防止重复加载导致同一页面重复初始化。

- 实验阅读页由 `scripts/site-output.mjs` 按页面位置生成公共脚本的相对引用，执行 `npm run generate` 后随站点提交，不手改生成文件。
- 静态 HTML 和多页面实验在每个登记入口的 `<head>` 中添加一个带 `defer` 的引用。仓库根目录页面使用 `assets/analytics.js`，技术示例使用 `../../assets/analytics.js`，run 目录内的顶层 HTML 使用 `../../../../assets/analytics.js`；嵌套页面按实际目录深度调整。不要使用会破坏 Pages 子路径的 `/assets/analytics.js`。已有内联 Google tag 时用公共引用替换，避免同时保留两套初始化。
- 构建型实验在 HTML 入口或框架公共文档模板中引用公共脚本，再执行 `npm run build:demo -- <id>`，源码与 previews 同步提交。源码和预览目录深度可能不同，需在构建配置中适配脚本 URL，并实际检查构建后的入口可加载站点公共脚本；不复制一份初始化实现进各个实验。独立部署需使用实际可访问的公共脚本地址，不能直接套用本站相对路径。
- 维护者补加代码时，在该 run 的 `changes` 中记录人工修改；保留原始 prompt，不将追踪代码伪装成模型原始产物。不为补统计批量改写历史实验源码或预览。
- 仅提示词或无网页入口的实验使用生成阅读页统计。外部部署能修改源码时按同一要求接入，发布仍由维护者人工操作，不修改外部部署设置或提前宣称线上生效。
- 统计脚本异步加载，加载失败不能阻塞页面或离线功能；原有功能依赖网络时仍按实际情况登记。浏览器检查应拦截或模拟远程追踪脚本，核对请求 URL、初始化 ID 和每页一次，避免测试访问污染正式统计。

```html
<!-- demos/{topic}/runs/{run}/index.html -->
<script src="../../../../assets/analytics.js" defer></script>
```

## 主题页浏览

主题页默认使用“全部记录”视图，直接列出模型与厂商、接入供应商与工具、档位与轮次、日期、费用、耗时、输入留存和执行模式。桌面使用紧凑表格，手机使用双列记录卡片，关键数据无需展开；费用备注可从费用摘要展开查看。

记录默认按截图评分排序，这是独立于模型排序的一套顺序：评分降序，同分按实验日期降序，再按实验 ID 升序；没有数值评分的记录（`unavailable`、`insufficient`）排在有评分记录之后，并且不回落到模型代际排序。评分只在同一任务正文内可比，因此比较以同一任务版本为单位，不同任务版本分区展示。“按模型”视图的模型分组同样按该分组内的最高评分排序。可在“更多筛选”的排序下拉框显式切换为模型代际顺序（`sort=model`）或实验日期（`sort=recent`），切换结果写入 URL 并可分享；默认排序不写入 `sort` 参数。排序规则见[评分规则](case-scoring.md)。

“按模型”视图分别按任务版本和模型显示记录数、已覆盖档位及最近登记日期。展开后使用七列语义表格：档位与轮次、日期、接入供应商与工具、费用、耗时、输入与执行模式、操作。各模型使用相同列宽；分组标题使用浅色底，档位使用标签，金额与时长采用等宽数字。展开时隐藏重复的档位摘要与快捷预览。手机在表格区域内横向滑动，档位列固定，页面本身不横向溢出。按档位、工具和执行模式分组，每组直接列出最近三条记录，更多记录通过“查看更早记录”展开；完整输入、费用备注、原始消耗及复盘通过“完整明细”进入实验阅读页。工具或执行模式未记录时保留未知，不推断它与其他记录使用相同条件。分组不表示原始输入一致，也不建立模型重跑的来源关系；原始输入与上下文仍以各条实验说明和对比页为准。

“档位覆盖”查看模型与档位矩阵，任务正文从顶部阅读入口打开。费用摘要始终区分订阅、批次总额、免费、单次金额和未记录，详细口径可展开查看。耗时由 billing.duration 登记，批次在 catalog/batches.json 维护，单次在 run.json 的 billing 中维护；text 保留来源中的时长描述，seconds 记录明确的总秒数，精确值未知填 null。不从备注动态解析、文件时间或订阅额度推断耗时。批次耗时始终显示案例数，不拆算为单案例；历史完整费用快照可以从批次字典补充新增耗时字段，不覆盖原始 run.json。缺失耗时显示“耗时未记录”。手机默认显示搜索和模型，档位与排序在“更多筛选”中。

筛选和视图通过 URL 恢复；`view=models`、`view=list`、`view=matrix` 和既有 `view=prompt` 均可直接访问。模型展开状态使用 `open`，历史展开状态使用 `history`，键来自任务版本、模型及实验条件，不依赖显示名称或列表位置。`#run-{实验 ID}` 在模型视图中自动展开对应模型和历史，在完整列表中继续定位对应行。

## 新增实验

### 停止案例的后续测试

归档以整个主题为单位，在 `topic.json` 保存 `testingStatus`（`active` / `archived`）及 `testingHistory`（状态、操作日期、原因）。未设置的既有主题默认参与后续测试；这不是对历史状态的推测。与单次实验的 `run.status` 分开：后者不决定整个主题是否继续重跑。

本地双击 `preview.bat`，在主题页点击“归档主题”，填写原因并保存；恢复时点击“恢复测试”。操作写入仓库并更新生成站点，需正常提交才会同步到其他机器。线上静态托管只展示状态，不提供写入操作。更改静态服务器代码后需要重启 BAT。

也可以执行：

```sh
npm run topic:status -- archive --topic pixel-flow --reason "此主题不再用于后续模型测试"
npm run topic:status -- restore --topic pixel-flow --reason "重新纳入测试"
npm run topics:active
npm run topic:status -- list --all
```

上面归档命令仅为示例，不表示该案例已归档。归档和恢复自动更新生成文件，不提交或推送。批量实验只选择参与主题；自动化需要纯 JSON 时执行 `node scripts/topic-status.mjs list --json`。已归档主题默认禁止 `new:demo`；用户明确要求一次性追加时可传 `--allow-archived`，新增实验记录例外而不解除归档。

首页默认显示参与主题，可通过“后续测试”筛选查看已归档或全部主题。归档主题仍能直接打开、预览、查看原始输入及加入对比；目录完整性检查与站点回归继续覆盖历史产物。

首次维护使用 Node 22+，在根目录执行 `npm ci`。已有实验的预览不需要安装依赖即可通过静态服务器打开。

Windows 本地预览：双击根目录的 `preview.bat`，自动启动静态服务器并打开 `http://127.0.0.1:4173/`。保持命令窗口打开，按 Ctrl+C 停止服务。只需安装 Node.js 22+，无需安装 npm 依赖或重新构建；首页、主题页、对比页与已提交的 previews 均可预览。需要独立后端的实验仍按各自说明运行。脚本不提交或推送代码。

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

嵌入展示是新增和导入案例的入库条件：设置 `preview.embed: true` 前，须在对比页实际打开该入口并确认主体可见。静态 HTML 与构建产物在本地 HTTP 和 Pages 子路径下验证；外部页面须使用真实可访问的 HTTPS 地址，并确认响应策略允许 iframe。验证失败或地址未就绪时，暂缓导入该记录。全栈案例保留源码和运行说明，取得可用部署地址后再登记；仅提示词或无网页产物的案例须先有明确标注的嵌入式记录展示入口，不能伪装成模型产物。历史记录可保留 `kind: "none"` 与 `embed: false`，不批量改写历史。

`new:demo` 生成的工作草稿可以暂时使用无预览配置；完成入口后再登记为正式记录。提交新导入案例前，运行 `npm run test:browser` 并确认对比页中的实际展示。

静态单文件和原型设置 `preview.kind: "static"`，入口相对于实验目录。新单文件入口用 `index.html`。多页面配置 `pages`，每项包含 `id`、`label`、`path`，`defaultPage` 指向其中一项。

新建或迁移可运行的 ready run 时，应登记一张代表性的桌面实际运行截图：PNG 放在本 run 目录，`run.json` 的 `screenshot` 填相对路径。迁移时优先复制源记录已有的实测截图；没有截图但入口可运行时，使用 HTTP 页面补拍。不要把占位图或主题缩略图登记成本 run 的截图。每张真实截图都要按[案例截图评分规则](case-scoring.md)写入 `run.json`；截图变化后需重评。首页按主题聚合时，默认显示当前筛选结果中评分最高的 run，其评分、截图和可用预览保持一致；按 run 聚合时显示各自已登记的截图。没有 run 截图时才回退到主题 `thumbnail`，且无截图记录不参加评分排序。

```json
{
  "kind": "static",
  "pages": [{ "id": "index", "label": "主页面", "path": "index.html" }],
  "defaultPage": "index",
  "network": "required",
  "embed": true,
  "externalUrl": null
}
```

可构建为纯静态的前端设置 `kind: "build"`，提交自己的 package-lock.json 和 build 配置：

```json
{ "command": ["run", "build", "--", "--base=./"], "output": "dist" }
```

```sh
npm run build:demo -- bluebook--minimax-m2-unknown-r01
```

脚本在该实验内 `npm ci`、执行登记的 npm 命令，复制产物到 `previews/{topic}/{run}/` 并记录源码和输出指纹。预览产物必须随源码提交；不要只提交源码 `index.html`。指纹覆盖源码、图片、构建配置与构建脚本，不含文档。默认每个 demo 独立依赖，不合并 lockfile。

外部部署设置 `kind: "external"`、HTTPS `externalUrl`、空 `pages`、null `defaultPage`、null `build`；新导入的外部案例经 iframe 验证后设置 `embed: true`，未验证或被站点策略阻止时暂缓导入。历史上的无预览记录可设置 `kind: "none"`、`embed: false`，新案例不得以此状态入库，也不提供伪预览。外部备用地址放在 `links` 中。

```sh
npm run generate
npm run validate
npm test
npm run test:browser
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

迁移已完成的实验时，源码、原始输入、验收记录和真实预览截图一并迁移。截图保存在对应 run 目录并登记 `screenshot`，同时核对 `Readme.md`、生成目录和首页都能访问。源记录只有验收报告截图时，可将其中对应本实验的实际运行截图复制到 run 目录；截图缺失而预览可运行时再补拍，不制作示意图冒充结果。

## 模型展示与对比排序

模型展示名称统一由 `catalog/models.json` 的 `label` 提供，采用品牌标准大小写、数字版本和空格分隔的变体，例如 `GPT-6.1 Sol`、`MiniMax M2`。显示名称修正不改实验 ID、原始输入或历史说明。

模型字典显式维护 `provider`（厂商）、`version`（数字版本数组，如 `[6, 1]`）和 `variant`（变体，无则为空字符串）。未知模型用 null 厂商和空版本数组，不从实验目录或标题猜测。

对比选择器按厂商英文名称升序分组，未知放最后；厂商内部按[模型发布日期与排序](#模型发布日期与排序)使用已登记的代际、同代能力优先级及发布日期。同模型的明确档位按 max、xhigh、high、medium、low 从高到低排列；ultra 等非标准标签随后单独保留，default 再后，unknown 最后。default 不映射为某个固定强度，不推断 ultra 与明确档位的强弱关系。排序统一由 assets/core.js 维护：模型顺序供筛选列表、档位筛选、矩阵列与对比选择器共用；主题页实验记录的默认排序是截图评分，模型顺序需显式选择 `sort=model`。同档位按实验日期降序、轮次降序，再按实验 ID 自然排序。分组计数反映当前范围和搜索结果；搜索支持显示名称、模型 ID 和厂商。首页模型筛选、侧栏下拉和弹窗使用同一模型排序与厂商分组；侧栏同正文候选用「同正文」标记，不改变模型顺序；上一/下一版本与默认填充采用选择器排序。

档位定义参考 [OpenAI 推理模型文档](https://developers.openai.com/api/docs/guides/reasoning)：支持的档位及默认值因模型而异。上述从高到低是本站的浏览顺序，不能作为跨模型性能排名；仅排序已有归档数据，不为历史实验补写档位。

展示名称与 API ID 分开维护：GPT 系列统一为 `GPT-版本 变体`，变体使用首字母大写；Claude、MiniMax 保留品牌大小写，不对所有品牌机械转成全大写或全小写。档位从 run.json 读取，展示原始档位名与中文说明（如「medium（中）」「max（最大）」），未记录时显示「档位未记录」；轮次显示中文（如「第 1 轮」），原始数据与分享参数保持不变。

## 浏览与对比工作区

首页、主题矩阵、统一四条选择栏和运行条件表的交互规则见 [工作区说明](archive-workspace.md)。修改这些交互时同步维护根路径和 Pages 子路径浏览器回归。所有计数与候选仍来自生成目录；截图评分是人工按版本化规则复核，不代表自动代码评分或模型能力。

## 首页评分与复杂度排序

主题视图固定按任务复杂度降序展示主题，复杂度相同时按最新实验日期和主题 ID 排序；评分、日期和名称排序不会改变主题顺序。每个主题卡片展示该筛选范围内评分最高的测试记录及对应截图和预览。实验记录视图可按复杂度、评分、最新记录与名称排序。评分衡量截图中可见的任务覆盖和呈现质量，不是模型能力或公平性能评测；评分维度、证据、并列规则和版本升级方法见[评分规则](case-scoring.md)。没有真实截图的记录为 `unavailable`；有截图但主产物尚未展示的记录为 `insufficient`，界面显示“证据不足”，两者均无数值评分，不参与最高分选取。

当前规则为 v2：任务覆盖 40 分（每份任务正文的四项检查各 10 分），构图 20 分、可读性 15 分、操作表达 10 分、完成细节 15 分，逐项独立评定。必须记录截图状态、可见证据与主要限制，并绑定原始输入、截图和任务检查的哈希；更新任一证据后重新审查，`validate` 会拒绝失效评分。仅未完成且无预览的草稿可用 `pending`。本次全量复核及旧分留档见[2026-10-15 复核报告](scoring-reviews/2026-10-15-v2.md)；后续重评必须保留前次评分快照。

主题复杂度继续在 `topic.json` 的 `complexity` 中维护 `level`（1–5）与 `reason`。评级依据为已归档任务正文，综合算法与模拟、交互与状态、系统集成：1 为基础展示，2 为常规交互原型，3 为多流程交互，4 为复杂交互或系统，5 为综合复杂任务。复杂度是任务分类，不随截图评分变化；缺失或 null 表示未评级，排在已评级主题之后。

主题聚合时始终按复杂度降序；同级主题按当前筛选结果中的最新实验日期降序，再按主题 ID 排序；无实验日期按空值处理。每张主题卡片选取当前筛选范围内分数最高的实验，评分并列时按实验日期降序、实验 ID 升序。实验记录视图继承主题复杂度，支持复杂度、评分、最新记录和名称排序。排序先于分页，筛选与分享链接保留排序选择；切回主题视图时固定为复杂度排序。默认按主题聚合以集中同任务的模型版本。卡片显示级别，悬停标签可查看依据。

旧首页链接的 `sort=latest` 未识别时回到复杂度优先；用户明确选择“最新记录”时使用 `sort=recent`，刷新与分享仍保留日期排序。卡片分类位于左侧，授权、评分、复杂度和归档/预览状态集中在右侧标签组，空间不足时换行。
