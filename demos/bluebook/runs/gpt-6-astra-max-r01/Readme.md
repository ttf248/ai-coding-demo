# 小蓝书 · 瀑布流社区 · Astra Max

React 18 图片瀑布流：搜索与分类、分页懒加载、点赞收藏、笔记详情和本地图片发布。

任务版本：v2。模型与档位按用户提供记录为 **gpt-6-astra / max**。开始日期 2026-10-16，2026-10-17（Asia/Shanghai）继续完成验证与归档；本轮在同一会话直接执行，未委派子代理。

[输入快照](prompt.md) · [首次产物与修复](evidence/Readme.md) · [后续输入](evidence/follow-up.md) · [整轮实验报告](../../../../docs/experiments/gpt-6-astra-max-20261016/Readme.md)

输入完整性为 partial：保留了批量请求、仓库指令和所选任务正文，未完整导出系统/开发者上下文及工具历史；不作为隔离或同输入公平评测。

## 运行

从仓库根目录运行 `npm run preview`，打开 `/previews/bluebook/gpt-6-astra-max-r01/index.html`。开发时在本实验目录执行 `npm ci`、`npm run dev`。重新生成提交用预览请在仓库根目录执行 `npm run build:demo -- bluebook--gpt-6-astra-max-r01`。

## 实现

- React 18 + TypeScript 组件拆分，Tailwind CSS 样式、Zustand 状态、react-lazyload 图片懒加载。80 条 mock 笔记，初始显示 20 条，滚动分页加载。
- 移动端两列、平板三列、桌面四列；下拉刷新、搜索、分类、点赞动画、收藏、详情评论与发布弹窗。12 张演示照片随产物保存，见 [图片来源](photos.md)。

## 验证

- 生产构建通过 TypeScript 检查与 Vite 打包；预览包含相对路径的 JS、CSS 和本地图片。
- 浏览器验证首批 20 条、滚动加载、搜索空结果与恢复、点赞、收藏、详情评论及本地发布。390px 为两列且无页面水平溢出。

具体脚本、运行报告与截图见整轮实验报告。自动验证环境为 Windows、Node.js 22.16.0、Playwright 1.58.2 和无头 Chromium，3D 检查使用 SwiftShader。

## 边界与复盘

- 这是 mock 内容展示应用；点赞、收藏、发布和评论保留在当前页面会话，刷新后恢复演示数据，没有账号或服务端。
- 已构建预览不依赖外网，但 ES module 资源须由 HTTP 静态服务器提供，不能双击源码 index.html 预览 TSX。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gpt-6-astra-max-r01`
- 模型：GPT-6 Astra；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：保存用户批量请求、用户仓库指令与所选任务正文原文。当前会话逐个执行，系统/开发者上下文与其他主题的工具过程未完整导出，不作为隔离或同输入公平评测。 用户后续“继续”另存 evidence/follow-up.md，未改写首次输入快照或任务正文。
- 工具：Codex。Windows / PowerShell / Node.js 22.16.0；按用户明确指定记录 gpt-6-astra / max；当前会话直接执行，未委派子代理。最新版本优先；已归档主题跳过。基线目录已有其他实验残留，未读取实现，移至 .cache/preexisting-run-artifacts-20261016 保留。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：OpenAI 批次合计 13 %（ChatGPT Plus 周额度）（11 个案例；批次 gpt-6-astra-max-2026-10-16；未记录单案例费用）
- [主页面](../../../../previews/bluebook/gpt-6-astra-max-r01/index.html)

### 部署适配记录

- 本轮按所选任务正文创建新实验，当前会话直接执行；首次实现保留为 evidence/first-pass.zip，后续修复均由本会话代理完成，无人工代码修改。
- 将不符合 ES2020 类型目标的 Array.at 调用改为下标访问。
- 显式添加 react-lazyload 运行所需的 prop-types 15.8.1，更新独立 lockfile，重新执行 build:demo 并验证生产预览。
- 从 experiment/gpt-6-astra-max-20261016 分支迁移到 main；保留原始实现、输入、首次产物、修复记录和验证报告。
- 迁移归档时于 2026-10-17 在 1440px 桌面视口补拍真实运行截图，并按案例截图评分规则 v2 逐图复核；截图、维度与依据保存在本实验记录。
- 本轮 11 个案例的订阅额度消耗与耗时由用户按批次提供，关联 billing batch gpt-6-astra-max-2026-10-16，不拆分为单案例。
<!-- archive:end -->
