# 小蓝书瀑布流 v2 · minimax-m3 / max

## 原始提示词

完整原始输入见 [prompt.md](prompt.md)。

## 运行与复盘

按 v2 任务正文生成；与 v1 的差异在于数据要求“包含不同高度的图片”，取消了 v1 中“图片存储在 images 文件夹、用户头像做成文字类型”的要求。本实现保留文字头像和下拉刷新作为通用交互。

技术栈：

- React 18 + TypeScript
- Tailwind CSS（品牌色 `#fe2c55`、背景 `#f5f5f5`、卡片圆角 8px）
- Zustand 状态管理
- `react-lazyload` 处理图片懒加载

页面构成：

- `Header`：logo、搜索框、发布按钮
- `Waterfall`：CSS multi-columns 2/3/4 列瀑布流
- `PostCard`：图片懒加载、错误回退、点赞动画、文字头像
- `App`：下拉刷新指示

数据：

- 8 种高度集合 `HEIGHTS`，由 `id` 取模确保瀑布流节奏感
- 首次加载 20 条，滚动到底自动加载 10 条；总数据池 220 条

启动与构建同 v1。

## 验证记录

- TypeScript 编译通过
- Vite 构建成功
- 断点：移动端 2 列、平板 3 列、桌面 4 列

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-max-r02`
- 模型：MiniMax M3；推理档位：max
- 类型：prototype；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：原 prompts/v2/prompt.md 完整保存；hash 与 prompts/v2/prompt.json 保持一致。
- 工具：Claude Code (MiniMax-M3)。当前会话直接执行；不使用 worktree 或子代理。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [主页面](../../../../previews/bluebook/minimax-m3-max-r02/index.html)

### 部署适配记录

- 使用 8 种高度集合显式满足 v2 中“包含不同高度的图片”的要求。
- 保留文字头像与下拉刷新，与 v1 共用通用交互模式。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/bluebook/runs/minimax-m3-max-r02；按原实验轮次导入。
- 部署适配：react-lazyload 构建未解析 prop-types，显式加入 prop-types 15.8.1 并更新锁文件，使归档预览正常打包。
<!-- archive:end -->
