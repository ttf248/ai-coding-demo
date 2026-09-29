# 小蓝书 v1 · MiniMax M3

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

按主题 v1 任务生成完整的「小蓝书」瀑布流前端，使用 Vite + React 18 + TypeScript + Tailwind + Zustand + react-lazyload + react-masonry-css + lucide-react。

主要功能：

- 顶部 logo「小蓝书」、搜索框（placeholder「搜索你感兴趣的内容」）与发布按钮。
- 瀑布流：移动 2 / 平板 3 / 桌面 4 列；首屏 20 条，触底无限加载。
- 卡片：图片懒加载、2 行截断标题、24 px 文字头像、点赞红心 + 数字；hover 上浮 + 阴影，激活缩放。
- 搜索过滤；点赞红心 grow-shrink 动画；移动端下拉刷新；图片加载失败显示占位。
- 详情弹层：大图 + 作者 + 评论列表 + 点赞 / 收藏 / 分享。
- `public/images/` 内置 35 张 SVG 占位图，无需外部图片资源。

构建：

```sh
cd demos/bluebook/runs/minimax-m3-unknown-r01
npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline
npm run build -- --base=./
# 产物: dist/index.html + dist/assets/*
```

预览由 `npm run build:demo` 自动复制到 `previews/bluebook/minimax-m3-unknown-r01/` 并写入 `build-info.json`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-unknown-r01`
- 模型：MiniMax M3；推理档位：unknown
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：保留主题 v1 任务正文；未记录的会话上下文保留为空。
- 工具：未记录。通过 minimax-m3 模型执行；具体平台上下文未记录。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [主页面](../../../../previews/bluebook/minimax-m3-unknown-r01/index.html)

### 部署适配记录

- 按主题 v1 任务生成完整 Vite+React+TS 应用，瀑布流移动 2 / 平板 3 / 桌面 4 列。
- 搜索、点赞 bounce 动画、下拉刷新、加载骨架与图片加载失败占位全部实现。
- public/images/ 内置 35 张 SVG 占位图，无需外部图片依赖。
- vite.config.ts 设置 base: './'，适配 Pages 子路径。
<!-- archive:end -->
