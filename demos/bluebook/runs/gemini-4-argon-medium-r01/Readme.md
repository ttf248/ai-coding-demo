# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：
  - 本地开发：在本目录执行 `npm ci && npm run dev`。
  - 静态预览：通过 `npm run build:demo -- bluebook--gemini-4-argon-medium-r01` 构建并同步至 `previews/bluebook/gemini-4-argon-medium-r01/`。
- **核心架构**：
  1. **技术栈严格对齐**：采用 React 18 + TypeScript + Vite + Tailwind CSS + Zustand 状态管理 + `react-lazyload` 图片懒加载组件。
  2. **响应式分列瀑布流与本地高颜值 SVG/Canvas 多尺寸图源**：实现移动端 2 列、平板端 3 列、桌面端 4 列的真实最短列分配瀑布流布局；内置不同宽高比的精美主题矢量插画海报与故障回退测试图，既保证离线/构建预览 100% 稳定加载，又完整演示图片加载失败时的默认占位图机制。
  3. **丰富的交互细节**：包含顶部「小蓝书」搜索栏与实时关键词过滤、分类频道渐入切换动画、触摸/鼠标下拉刷新、底部 IntersectionObserver 自动触底加载更多（首次 20 条）、红心点赞弹跳缩放动画、图文详情弹窗与新笔记发布弹窗。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：按 demos/bluebook/prompts/v2/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../previews/bluebook/gemini-4-argon-medium-r01/index.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 为独立构建移除未使用的仓库根目录 file 依赖，沿用兼容 react-lazyload 的锁文件安装配置，并适配构建产物的统计脚本相对路径。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
