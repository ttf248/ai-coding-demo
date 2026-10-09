# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。

核心实现：
1. **技术栈与布局**：采用 React 18 + Tailwind CSS，配合 Mini-Zustand 响应式状态管理。使用响应式列计算，移动端 2 列、平板 3 列、桌面端 4 列。
2. **卡片细节**：展示自适应高度图片、两行截断标题、24px 圆形头像、点赞数及红心按钮；悬浮上浮与阴影加深、点击按压反馈。
3. **交互与加载**：初始加载 20 条图文数据，触底自动追加 10 条并展示加载中动画；支持移动端触屏下拉刷新；图片加载失败展示友好兜底图；点赞触发心跳放大缩小动效。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：使用当前模型执行 v2 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.37 USD（11 个案例；原始消耗 414 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-gemini-3-8-flash-high-2026-10-09；未记录单案例费用）
- [瀑布流社区](../../../../demos/bluebook/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/gemini-3.8-flash`，提交 `7fea10d`。迁入时原始输入与实现未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
