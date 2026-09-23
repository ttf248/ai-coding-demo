# 小蓝书 · GPT 6 Luna Max

## 本轮实现

基于主题 v1 任务正文新建 React 18 + TypeScript + Vite 应用。首页包含响应式两列至四列图片瀑布流、搜索与分类、点赞、下拉刷新和滚动加载。21 张 SVG 插画保存在 `images/`，头像用作者昵称生成。

## 运行与验证

在本目录执行 `npm ci`、`npm run dev`。已运行 `npm run build`，TypeScript 与 Vite 构建通过；归档构建命令会生成 GitHub Pages 预览。

- 原始任务：[prompt.md](prompt.md)
- 项目依赖：[package.json](package.json)
- 页面入口：[index.html](index.html)

## 运行信息

Codex CLI 以 `gpt-6-luna`、`max` 推理档位执行。本轮完整复用主题 v1 输入；未加载历史原型图。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gpt-6-luna-max-r01`
- 模型：GPT 6 Luna；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整保留主题 v1 任务正文；未把历史原型图或未记录会话作为本轮输入。
- 工具：Codex CLI。通过 --model gpt-6-luna 与 model_reasoning_effort=max 执行；CLI 完成并返回代码，具体平台上下文未随实验导出。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [主页面](../../../../previews/bluebook/gpt-6-luna-max-r01/index.html)

### 部署适配记录

- 基于主题 v1 新建独立 React/Vite 实现，保留所有历史运行记录。
- 生成 21 张本地 SVG 插画；头像使用昵称首字母，不依赖远程图片。
- 加入搜索、分类筛选、点赞动画、滚动加载、下拉刷新和图片失败兜底。
- 设置相对路径静态构建，供 GitHub Pages 预览。
<!-- archive:end -->
