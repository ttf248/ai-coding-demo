# 小蓝书 v2 · MiniMax M3

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

按主题 v2 任务生成完整「小蓝书」瀑布流前端，使用 Vite + React 18 + TypeScript + Tailwind + Zustand + react-lazyload + lucide-react。v2 与 v1 的核心区别是**不要求外部图片资源**，所有卡片图片通过内联 SVG + CSS mask + 渐变背景生成；`public/images/` 目录不存在。

主要功能：

- 顶部 logo、搜索、发布按钮；sticky 类目栏（10 个类目）+ sticky 搜索栏。
- 瀑布流：移动 2 / 平板 3 / 桌面 4 列；首屏 20 条，触底无限加载。
- 28 条 mock 数据覆盖 10 个类目；24 套内联 SVG 变体作为卡片图片；不同高度（240-440 px）。
- 卡片：内联 SVG 遮罩 + 渐变、2 行截断标题、文字头像、点赞红心动画、hover/active 反馈。
- 搜索、分类筛选、点赞、下拉刷新、骨架加载、详情弹层、淡入页面。
- mock 数据失败回退：图标占位；LocalStorage 可记忆收藏。

构建：

```sh
cd demos/bluebook/runs/minimax-m3-unknown-r02
npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline
npm run build -- --base=./
```

预览由 `npm run build:demo` 自动复制到 `previews/bluebook/minimax-m3-unknown-r02/` 并写入 `build-info.json`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-unknown-r02`
- 模型：MiniMax M3；推理档位：unknown
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：保留主题 v2 任务正文；v2 不依赖 images/，全部 mock。
- 工具：未记录。通过 minimax-m3 模型执行；具体平台上下文未记录。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [主页面](../../../../previews/bluebook/minimax-m3-unknown-r02/index.html)

### 部署适配记录

- 按主题 v2 任务生成完整 Vite+React+TS 应用，仅用 mock 数据 + 内联 SVG。
- 28 条 mock 数据覆盖 10 个类目；24 套内联 SVG 变体作为卡片图片（CSS mask + 渐变）。
- 搜索、分类、点赞 bounce、下拉刷新、骨架加载、详情弹层全部实现。
- vite.config.ts 设置 base: './'，适配 Pages 子路径。
<!-- archive:end -->
