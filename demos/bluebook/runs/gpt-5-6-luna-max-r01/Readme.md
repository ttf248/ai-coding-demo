# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)。本轮执行蓝书主题的最高版本 v2。

## 运行与复盘

这是一个可构建的 React 18 + TypeScript 单页应用。首页提供搜索、响应式瀑布流、点赞动画、下拉刷新、滚动加载和发布反馈；mock 图片由代码生成并随数据携带，不请求外部图片。

源码入口为 `src/main.tsx`，Tailwind 通过 Vite 插件处理，状态集中在 Zustand store，图片卡片使用 `react-lazyload`。执行 `npm run build` 可生成 `dist`，归档预览位于仓库的 `previews/bluebook/gpt-5-6-luna-max-r01/`。

验证记录：构建后检查了桌面四列、平板三列、移动双列布局；搜索、点赞、加载更多和下拉刷新均由浏览器事件驱动。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gpt-5-6-luna-max-r01`
- 模型：GPT 5.6 Luna；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整输入记录为提示词 v2 原文；未附加系统提示、图片或多轮输入。
- 工具：Codex。按用户指定记录模型 gpt-5.6-luna 与 max 档位；使用独立 Vite 构建并提交 Pages 预览。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [小蓝书应用](../../../../previews/bluebook/gpt-5-6-luna-max-r01/index.html)

### 部署适配记录

- 首次实现，不覆盖基线提示词或既有实验。
- 以本地 SVG data URL 生成不同尺寸的 mock 图片，避免引入外部图片数据。
- 使用相对 base 构建，确保 GitHub Pages 子路径可打开。
<!-- archive:end -->
