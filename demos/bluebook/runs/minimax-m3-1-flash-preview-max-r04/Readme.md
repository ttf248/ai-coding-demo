# 小蓝书 · 瀑布流社区（任务正文 v1）

## 原始提示词

见 [完整原始输入](prompt.md)。本轮为模型 minimax-m3-1-flash-preview、档位 max 重跑任务正文 v1（使用本地 images 目录、文字头像、下拉刷新与 Readme 要求）。

## 运行方式

本目录是完整源码。开发模式 `npm ci && npm run dev`；生产构建 `npm run build`，产物提交在 `previews/bluebook/minimax-m3-1-flash-preview-max-r04/`，由 Pages 直接托管。构建产物使用相对路径，因此也可放在任意子路径下访问。

## 实现要点

- 技术栈严格按任务正文：React 18 + TypeScript + Tailwind CSS + Zustand + react-lazyload，构建工具为 Vite。
- 组件拆分：`SearchBar`（顶栏与搜索）、`Waterfall`（瀑布流容器与加载态）、`NoteCard`（卡片）、`LazyImage`（懒加载与失败兜底）、`Avatar`（文字头像）、`PullToRefresh`（下拉刷新）。
- 状态集中在 `useFeedStore`（Zustand）：`notes` / `liked` / `page` / `status` / `hasMore`，加载与刷新都走异步并有真实的 loading 态。
- 图片资源放在**本地 `images/` 目录**，通过 `vite.config.ts` 的 `publicDir: 'images'` 在构建时自动拷贝到产物根目录，符合「编译发布时需要支持自动拷贝」；不引用任何外部图片数据。
- 文字头像：由昵称首字 + 确定性调色板生成渐变圆形，视觉与整体配色一致。
- 布局：移动端 2 列、平板 3 列、桌面 4 列；卡片 hover 上浮 + 阴影加深，点击有按压缩放。
- 交互：下拉刷新、滚动到底自动加载、加载动画、点赞红心放大回弹、搜索结果渐入、加载失败占位图。

## 验证记录

- `npm ci` 后 `npm run build` 通过 TypeScript 类型检查并产出 dist。
- 390×844 视口下为两列瀑布流，图片按比例自适应高度，文字头像、点赞数、标题两行截断均正常。
- 1280 宽度下自动变为四列。
- 顶部搜索框输入后出现搜索建议胶囊，无结果时显示空态并可一键清除。
- `dist` 目录内含 24 个本地 SVG 图片，证明 images 目录已自动拷贝。

## 复盘

**做得好的**：任务正文里最容易打折的是「展示用图片放在 images 文件夹、编译发布时自动拷贝」「用户头像做成文字类型」这两条容易被直接用外链糊过去的约束，本轮用 `publicDir` 真实落地了前者，用首字渐变实现了后者；组件拆分与状态收敛也做到了可读。

**不足**：
1. 构建产物里出现了 `from"prop-types"` 这样的裸模块导入（react-lazyload 的 CJS 依赖未被内联），浏览器端会直接报错；补装 prop-types 后才恢复正常，说明依赖解析没有在构建后检查。
2. 默认 Vite 产物使用绝对路径 `/assets/...`，在子路径托管与 file:// 下都会失效；改成 `base: './'` 才稳妥。
3. `react-lazyload@3.2.0` 的 peerDependencies 只声明到 React 17，需要在 `.npmrc` 里开 `legacy-peer-deps`，属于依赖选型上的妥协，应在 Readme 中说明。
4. 生成的 SVG 占位图里带了中文标题文字，缩到卡片尺寸后文字被裁切，视觉上是噪点。
5. 下拉刷新只监听 `data-scroll-root` 的 touch 事件，桌面端无法触发（没有鼠标下拉等价物），移动端与桌面端行为不一致。
6. 搜索只过滤已加载的 20 条数据，正文没有要求服务端搜索，但这会让「搜索」在数据量大时显得功能不完整。

## 批次记录

本批共 11 个主题案例、12 条实验记录（蓝皮书含 v1/v2）；MiniMax Max 五小时额度消耗 44%，token 消耗 60.6M，耗时 57m 10s。测试备注：自我审查五轮。以上为批次总计，不拆分为单条记录。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-preview-max-r04`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 执行模式：按原任务执行；备注：自我审查十轮
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整原始输入，等同于主题任务正文 v1（未增删），保存于本目录 prompt.md。
- 工具：Claude Code。Claude Code 会话内直接执行，模型 minimax-m3-1-flash-preview、档位 max；未使用子代理，未参考任何历史实现或远程分支。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：MiniMax 批次合计 44 %（Max 订阅套餐五小时额度）（12 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-14；未记录单案例费用）
- [小蓝书首页](../../../../previews/bluebook/minimax-m3-1-flash-preview-max-r04/index.html)

### 部署适配记录

- 构建期修复：react-lazyload 的 CJS 依赖 prop-types 未被打进产物，浏览器会因裸模块导入报错；已补为直接依赖。
- 构建期修复：Vite 默认产出绝对路径 /assets，子路径托管与 file:// 打开都会失效；已改为 base: './'。
- react-lazyload@3.2.0 的 peerDependencies 只声明到 React 17，已在 .npmrc 启用 legacy-peer-deps 以保证 npm ci 可重复。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base）/demos/bluebook/runs/minimax-m3-1-flash-preview-max-r01；main 已有该轮号，保留旧记录后迁入为 minimax-m3-1-flash-preview-max-r04。原始输入与产物按源分支复制，prompt.md 未改写。
- 用户提供的本批测试备注：自我审查五轮。
- 迁移截图：源测试分支未登记桌面截图；已在本仓库通过本地 HTTP 入口按实际页面补拍，并在 390px 视口确认无水平溢出（2026-10-14）。
- 迁移部署修复：本地图片路径从根绝对路径改为 Vite BASE_URL 相对路径，使 Pages 子路径可加载本地图片；模块构建的 file:// 入口受浏览器 CORS 限制，预览通过 HTTP 提供。图片资源和原始输入保留。
- 迁移说明：源 Readme 中“首次执行”改为“重跑”，因为 main 已有该模型的历史轮次；原始 prompt.md 未改写。
<!-- archive:end -->
