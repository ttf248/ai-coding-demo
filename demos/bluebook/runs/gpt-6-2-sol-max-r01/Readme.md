# 小蓝书 · 生活灵感集

## 原始输入

[完整输入快照](prompt.md) · [共享任务正文 v2](../../prompts/v2/prompt.md)

## 运行与操作

本目录执行 `npm ci`、`npm run dev`。静态预览位于仓库的 `previews/bluebook/gpt-6-2-sol-max-r01/`，也可从主题页打开。

首页首批为 20 条数据，滚动到底部自动追加。用顶部搜索和分类筛选，用刷新按钮或移动端下拉换一批笔记。点击卡片打开详情，点击爱心切换点赞。发布表单将所选本地图片加入当前页面。

## 实现与复盘

React 18 与 TypeScript 拆分卡片、详情和发布表单。Zustand 管理检索、分页、刷新与点赞。Vite 在构建时将 `public/images/` 打包到预览，图片在页面内按视口懒加载。

按小蓝书 v2 实现原创的杂志式瀑布流。24 张裁切照片是随源码保存的 Unsplash 样图。发布与点赞使用会话内的模拟数据。[Unsplash 素材许可](https://unsplash.com/license)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gpt-6-2-sol-max-r01`
- 模型：GPT-6.2-Sol；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：留存仓库用户指令、批量请求原文与本主题的原始任务正文。共享会话还包含其他主题以及平台和工具上下文。
- 工具：Codex。用户指定 GPT-6.2-Sol / max，在同一会话中执行 11 个参与主题。Windows、Node.js 22.16.0。实现在本地基线测试目录中生成。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：OpenAI 批次合计 $3.40 USD（11 个案例；批次 gpt-6-2-sol-max-codex-plus-2026-11-18；未记录单案例费用）
- [社区首页](../../../../previews/bluebook/gpt-6-2-sol-max-r01/index.html)

### 部署适配记录

- 采用原创的小蓝书界面，保留任务要求的瀑布流与 #fe2c55 主色。
- 固定 react-lazyload 运行所需的 prop-types 依赖，并生成可静态托管的预览。
- 迁入自 experiment/gpt-6-2-sol-max 的 ef8d75d7，保留原始输入、素材和实现。
- 维护者为登记的 HTML 入口补充公共访问统计引用。
- 维护者适配源码与构建预览的统计脚本相对路径，并在 main 重建 Vite 静态预览。
- 源分支无截图，维护者在 main 采集真实桌面及手机画面，由 Codex 逐帧按 v3 复核。
<!-- archive:end -->
