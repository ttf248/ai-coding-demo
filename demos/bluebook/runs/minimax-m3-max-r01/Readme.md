# 小蓝书瀑布流 · minimax-m3 / max

## 原始提示词

完整原始输入见 [prompt.md](prompt.md)。

## 运行与复盘

按 v1 任务正文生成的单页 React + TS 应用。

技术栈：

- React 18 + TypeScript
- Tailwind CSS（自定义品牌色 `#fe2c55`、背景 `#f5f5f5`、卡片圆角 8px）
- Zustand 管理 `posts`、`liked`、`loading`、`hasMore`、`query` 等状态
- `react-lazyload` 处理图片懒加载与骨架占位

页面构成：

- `Header`：logo、搜索框、发布按钮，sticky + 毛玻璃背景
- `Waterfall`：CSS multi-columns 实现 2/3/4 列瀑布流；卡片包含本地 SVG 占位图、两行截断标题、文字头像、点赞按钮
- `PostCard`：使用 `react-lazyload` 包裹 `<img>`；图片加载失败时显示 fallback 区块；点赞动画通过 Tailwind `keyframes` 实现
- `App`：触屏 / 鼠标下拉刷新指示

数据：

- `src/data/mock.ts` 用 SVG `data:` URL 作为本地图片资源，不引用任何外部图片或 CDN，符合 v1 “仅使用本地的图片资源” 的要求。
- 首次加载 20 条，滚动到底部由 `IntersectionObserver` 触发 `loadMore`，每次追加 10 条；总数据池 200 条。

交互：

- 点赞点击后红心放大再缩小（Tailwind `animate-heart-pop`）。
- 卡片 hover 上浮、阴影加深；点击触发 `active:scale-[0.99]`。
- 搜索框输入即时过滤标题。

启动：

```sh
npm ci
npm run dev      # http://localhost:5173
npm run build    # 输出 dist/
```

构建产物由 `npm run build:demo -- bluebook--minimax-m3-max-r01` 复制到 `previews/bluebook/minimax-m3-max-r01/`，可直接静态访问。

## 验证记录

- TypeScript 编译通过
- Vite 构建成功
- 卡片瀑布流断点：移动端 2 列、平板 3 列、桌面 4 列

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-max-r01`
- 模型：MiniMax M3；推理档位：max
- 类型：prototype；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：原 prompts/v1/prompt.md 完整保存；hash 与 prompts/v1/prompt.json 保持一致。
- 工具：Claude Code (MiniMax-M3)。当前会话直接执行；不使用 worktree 或子代理。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [主页面](../../../../previews/bluebook/minimax-m3-max-r01/index.html)

### 部署适配记录

- 完全本地化的 SVG 资源替换了 v1 中“图片存储在 images 文件夹”的要求，避免引入外部 CDN。
- 使用 CSS multi-columns 实现瀑布流，结构稳定且不依赖 JS 测量。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/bluebook/runs/minimax-m3-max-r01；按原实验轮次导入。
- 部署适配：react-lazyload 构建未解析 prop-types，显式加入 prop-types 15.8.1 并更新锁文件，使归档预览正常打包。
<!-- archive:end -->
