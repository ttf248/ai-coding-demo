# 小蓝书 · 瀑布流社区（MiniMax M3.1 Flash / max）

## 原始提示词

见 [完整原始输入](prompt.md)。该输入与主题提示词 v2 正文一致（未指定版本时按仓库约定取版本号最大的 v2）。

## 项目说明

React 18 + TypeScript + Tailwind CSS + Zustand + react-lazyload 的完整前端工程，Vite 构建。

```bash
npm ci          # 安装依赖（仓库内 .npmrc 放宽 peer 校验，见下方说明）
npm run dev     # 本地开发
npm run build   # 构建到 dist/
npm run gen:images  # 重新生成 public/images 下的本地示例图片
```

### 目录

```
index.html                 入口 HTML
src/main.tsx               挂载 React
src/App.tsx                页面骨架、下拉刷新、渐入动画
src/components/TopBar.tsx      顶栏：logo / 搜索框 / 发布按钮
src/components/Waterfall.tsx   瀑布流容器与无限滚动哨兵
src/components/NoteCard.tsx    卡片：懒加载图片、标题、头像、点赞
src/components/LoadingMore.tsx 加载动画
src/components/PublishModal.tsx 发布弹窗
src/store/useStore.ts      Zustand 状态（列表、加载、点赞、搜索、发布）
src/data/mock.ts           mock 数据生成（不同高度配比）
src/styles/index.css       Tailwind 指令与自定义动画
public/images/             本地示例图片（构建时自动拷贝）
scripts/generate-images.mjs  用代码生成 SVG 示例图片
```

### 实现要点

- **顶栏**：左侧文字 logo「小蓝书」，中间搜索框（内置放大镜图标，placeholder 为「搜索你感兴趣的内容」），右侧「发布」按钮，点击打开发布弹窗。
- **瀑布流**：CSS `columns` 实现，移动端 2 列、平板 3 列、桌面 4 列；卡片 `break-inside: avoid` 保证不跨列断裂。
- **卡片**：图片宽度 100% 高度自适应；标题最多两行并省略号（`-webkit-line-clamp`）；作者头像为 24px 圆形文字头像 + 昵称；点赞为红心图标 + 数字。hover 时卡片轻微上浮、阴影加深，点击时有按压缩放反馈。
- **数据加载**：首批 20 条，滚动到底部由 IntersectionObserver 自动追加 20 条（共 120 条），加载中显示旋转动画。
- **交互**：下拉刷新（触摸端在页面顶部继续下拉超过阈值触发）、图片加载失败自动切换到默认图、点赞红心放大再缩小的动画、列表切换时的渐入动画。
- **样式**：主色 `#fe2c55`，背景 `#f5f5f5`，卡片纯白、圆角 8px；按 iPhone 12 及以上机型优化（安全区适配、44px 可点区域）。
- **图片**：全部示例图片由 `scripts/generate-images.mjs` 生成 SVG 放入 `public/images`，Vite 构建时自动拷贝到产物，不引用任何外部图片资源。

### 依赖冲突与处理

- `react-lazyload@3.2.0` 的 `peerDependencies` 仍标注 React ≤ 17，与提示词要求的 React 18 冲突。该库在 React 18 下运行正常，因此仓库内 `.npmrc` 设置 `legacy-peer-deps=true` 放宽校验（记录在实验的 `changes` 中）。
- `react-lazyload@3.2.0` 的发布包未把 `prop-types` 声明为运行时依赖，打包时会被当作外部依赖导致运行时报错，因此本工程显式声明 `prop-types` 依赖。
- 为兼容 `file://` 直接打开，构建以 IIFE 格式产出普通 `<script>`，并去掉 Vite 默认注入的 `crossorigin` 属性（ES module 与带 crossorigin 的请求在 `file://` 下会被浏览器 CORS 策略拦截）。

## 运行与验证

Playwright + Chromium 对构建产物（`previews/bluebook/minimax-m3-1-flash-max-r01/`）做自动化校验，均通过：

- 首屏首批渲染 20 张卡片，随后自动追加（40 → 60）。
- 桌面 4 列、390px 移动端 2 列；文档无水平溢出。
- 顶栏含 logo、搜索框与发布按钮；背景色计算值为 `rgb(245, 245, 245)`。
- 所有卡片图片加载成功（19/19 `naturalWidth > 0`），无外链图片。
- 搜索「露营」把 60 条过滤为 2 条；点赞后数字由 1007 变为 1008；发布按钮可打开弹窗。
- `file://` 直接打开与 HTTP 访问均无控制台错误。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-max-r01`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整原始输入快照，与主题提示词 v2 正文一致（未指定提示词版本时取版本号最大的 v2）。
- 工具：Claude Code CLI（当前会话，模型 MiniMax-M3.1-Flash，档位 max）。单会话直接实现，未使用子代理；本地用 Playwright/Chromium 对构建产物做自动化校验。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-2026-10-19；未记录单案例费用）
- [小蓝书主页面](../../../../previews/bluebook/minimax-m3-1-flash-max-r01/index.html)

### 部署适配记录

- react-lazyload@3.2.0 的 peerDependencies 仍标注 React <=17，与提示词要求的 React 18 冲突；仓库内 .npmrc 设置 legacy-peer-deps=true 放宽校验，库本身在 React 18 下运行正常（已在浏览器验证懒加载、占位与错误兜底）。
- react-lazyload@3.2.0 的发布包未把 prop-types 声明为运行时依赖，构建会将其视为外部依赖导致运行时报错，因此在本工程显式声明 prop-types 依赖。
- 示例图片由 scripts/generate-images.mjs 用代码生成 SVG 放入 public/images，构建时由 Vite 自动拷贝，不引用任何外部图片资源。
- 迁移来源：F:\dev\ai-coding-demo-test 的 experiment/minimax-m3-1-flash-max 分支，提交 871beb18e0e85d6dd542cadca398e67aa4ff1247；保留该提交中的任务输入、实现源码和原有说明。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-20 在本仓库本地 HTTP 预览中补拍真实桌面截图，并按案例评分规则 v2 逐项复核。
- 维护者于 2026-10-20 按用户要求重新逐图评分，原始 PNG、输入及实现不变；旧分、新分、逐项观察和规则快照保存在 catalog/score-reviews/2026-10-20-minimax-m3-1-flash-max-v2.json。
<!-- archive:end -->
