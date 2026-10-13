# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)（提示词版本 v2，本主题采用版本号最大的提示词）。

## 运行方式

- 类型 `app`（构建型纯前端），源码在本目录，独立 `package-lock.json`。
- 本地开发：本目录 `npm ci` 后 `npm run dev`；构建：`npm run build`（`tsc --noEmit && vite build`）。
- 站点预览为构建产物 `previews/bluebook/mimo-v2-6-flash-free-max-r01/index.html`，由 `npm run build:demo -- bluebook--mimo-v2-6-flash-free-max-r01` 生成并随源码一起提交，仓库根目录静态托管可直接打开。
- 网络：`offline`（mock 图片为代码生成的 SVG data URI，无外部素材）。

## 实现要点

- React 18 + TypeScript + Tailwind CSS + Zustand + react-lazyload，Vite 打包且 `base: "./"` 保证子路径可访问。
- 瀑布流用 CSS multi-column 实现 2/3/4 列响应式；卡片含图片、两行标题、24px 圆形头像昵称、红心点赞数。
- 状态集中在 `src/store.ts`：首屏 20 条、滚动到底加载更多、加载/刷新状态、点赞与搜索关键词。
- 交互：hover 上浮加深阴影、按压缩放、点赞红心放大回弹（`heart-pop` 动画）、下拉刷新、页面渐入、图片加载失败回退默认图（`defaultCover()`）。

## 验收记录

- 工具：Playwright（Chromium，本地静态服务器提供 `dist`；临时脚本未入库）。
- 通过项：首屏 20 卡、滚动加载到 40 卡；移动端 `column-count: 2`、桌面 `column-count: 4`；主色 `rgb(254, 44, 85)`、背景 `rgb(245, 245, 245)`；搜索"露营"命中 2 条并显示结果提示；点赞 aria-pressed 切换、计数 +1 且动画触发；故意破坏的 mock 图回退默认图；390px 与 1440px 均无横向溢出；无未预期控制台错误。

## 人工适配与变更

见 run.json `changes`：按仓库构建型纯前端约定落目录与登记入口；补 `prop-types` 显式依赖消除 Vite 构建警告。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--mimo-v2-6-flash-free-max-r01`
- 模型：MiMo-V2.6-Flash Free；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整记录：与主题提示词原文一致，hash 为 BOM/换行规范化后的 SHA-256。 提示词版本 v2。
- 工具：OpenCode + Playwright 静态验收。实际执行模型 MiMo-V2.6-Flash Free，档位 max，在当前会话内直接执行（未委派子代理）。产物在本地用 Playwright 验收脚本回归，脚本存于系统临时目录、未入库。 预览产物由 npm run build:demo -- bluebook--mimo-v2-6-flash-free-max-r01 生成并提交到 previews/bluebook/mimo-v2-6-flash-free-max-r01。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：OpenCode · 免费模型 订阅；单案例货币金额未记录。用户说明本次使用 OpenCode 免费模型，无付费费用；未提供可折算的货币金额，amount 保持 null。
- [预览首页](../../../../previews/bluebook/mimo-v2-6-flash-free-max-r01/index.html)

### 部署适配记录

- 提示词只给组件要求，构建与目录结构按仓库构建型纯前端约定落到本 run 目录（独立 package-lock.json）。
- react-lazyload 运行时依赖 prop-types，补充为显式依赖以消除 Vite 构建外部化警告（构建修复登记）。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/mimo-v26-flash-free）/demos/bluebook/runs/mimo-v2-6-flash-free-max-r01；保留源测试轮号 r01，原始输入指纹与 main 的 vv2 提示词一致。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。
<!-- archive:end -->
