# 小蓝书瀑布流社区

本轮按主题提示词 v2 实现 React 18 + TypeScript + Tailwind CSS + Zustand + react-lazyload 瀑布流页面。完整原始输入保存在 [prompt.md](prompt.md)。

## 运行与构建

```sh
npm ci
npm run dev
npm run build
```

仓库使用 `npm run build:demo -- bluebook--minimax-m3-1-flash-preview-max-r03` 构建 Pages 预览。构建结果登记在 `previews/bluebook/minimax-m3-1-flash-preview-max-r03/`。图片使用 `picsum.photos` 外链，因此预览需要网络；头像由本地 SVG 生成。

## 实现与验证记录

- 瀑布流通过容器宽度选择 2 / 3 / 4 列，并将卡片分配到当前最短列；图片占位按 mock 数据宽高比预留空间。
- 初始显示 20 条，滚动加载后按 20 条追加；支持搜索、下拉刷新、点赞动画和图片失败回退。
- 源测试记录了 20→40→60 条加载、刷新后回到 20 条、点赞数 +1、搜索过滤与空结果状态，以及 390px 视口无横向溢出。
- `react-lazyload` 缺少对 `prop-types` 的声明依赖，实验 lockfile 显式固定 `prop-types`；另外修正了类型导出和 `TopBar` 图标引用，使 TypeScript 检查通过。
- 原先头像外链在 Chromium 中触发跨源资源策略拦截，改为按昵称本地生成 SVG；图片仍通过 `picsum.photos` 加载。

本轮由 MiniMax Code 桌面版执行，未使用 Claude Code。实验模型为 MiniMax M3.1 Flash Preview，推理档位 max。迁移来源、轮号调整和批次额度见自动生成的归档信息及 `run.json`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-preview-max-r03`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：按 docs/model-test-workflow.md「没有指定时使用版本号最大的版本」取 v2。本目录 prompt.md 与 demos/bluebook/prompts/v2/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code 桌面版（MiniMax M3.1 Flash Preview）。Node 22 + npm ci（独立 lockfile）；tsc --noEmit 类型检查通过后 vite build 产出 dist，再由 npm run build:demo 复制到 previews/bluebook/minimax-m3-1-flash-preview-max-r03/。图片用 picsum.photos 外链；头像按昵称本地生成 SVG，因此 preview.network 为 required。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。 实测：2/3/4 列响应式正确，首屏 20 条、滚动到底依次 20→40→60，下拉刷新会更换内容并回到 20 条，点赞数值 +1，搜索可过滤且空态正确，图片失败自动切换本地兜底图，390px 下无横向溢出。 本轮使用 MiniMax Code 桌面版执行，未使用 Claude Code。 本地补拍截图用于确认迁移后的预览；图片使用 picsum.photos 外链，头像改为本地 SVG 生成，不依赖 i.pravatar.cc。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：MiniMax 批次合计 37 %（Max 订阅套餐五小时额度）（11 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-13；未记录单案例费用）
- [瀑布流主页](../../../../previews/bluebook/minimax-m3-1-flash-preview-max-r03/index.html)

### 部署适配记录

- 按提示词选用了 v2 提示词（该主题存在 v1/v2 两版，未指定时取版本号最大的一版）；实际输入保存在本目录 prompt.md，与 demos/bluebook/prompts/v2/prompt.md 逐字节一致。
- react-lazyload@3.2.1 在运行时 require('prop-types')，但其 package.json 未声明该依赖，构建产物会留下裸 ESM import 导致离线 404；在本项目 package.json 中显式补充 prop-types@15.8.1 修复。
- 瀑布流按容器实测宽度分列（ResizeObserver），卡片按估算高度投递到当前最矮列，而不是用 CSS columns，避免列序从上到下与阅读顺序不一致。
- 卡片图片高度由 mock 数据的原始宽高比推算并提前占位，懒加载完成后不发生布局跳动。
- 搜索框接了真实过滤（标题 + 昵称），下拉刷新会更换 mock 起始偏移；发布按钮给出提示浮层而非空按钮，这两处提示词未明确要求，按原型完整性补齐。
- 头像最初用 i.pravatar.cc，实测该服务返回带跨源资源策略的响应，在浏览器中 12 个请求全部被拦为 ERR_BLOCKED_BY_RESPONSE.NotSameOrigin；改为按昵称本地生成 SVG 剪影头像，去掉该第三方依赖，移动端 26 张图 0 失败、0 控制台错误。
- 修复两处使 tsc 报错的问题：useInfiniteScroll 导出为默认导出但按具名导入，以及 TopBar 漏引 Icons。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/minimax-m3-1-flash-preview-max）/demos/bluebook/runs/minimax-m3-1-flash-preview-max-r01；当前 main 已存在该轮号，保留历史并迁入为 minimax-m3-1-flash-preview-max-r03。 源 Readme.md 中的提示词版本、工具、网络状态、历史目录及截图说明与本次 run.json/源码不一致；改写运行说明，以本次 run.json、源码和测试记录为准。
- 迁移验证：使用本仓库本地 HTTP 入口补拍实际桌面截图 screenshot.png；Chromium 确认入口可加载且无页面异常，390px 视口横向溢出为 0。
- 迁移整理：修正环境说明中的旧 r01 预览目录，并按源码与依赖修复记录注明图片仅使用 picsum.photos、头像为本地 SVG。
<!-- archive:end -->
