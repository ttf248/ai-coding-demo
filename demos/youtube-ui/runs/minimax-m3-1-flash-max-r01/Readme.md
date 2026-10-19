# YouTube UI 模块化原型（MiniMax M3.1 Flash / max）

## 原始提示词

见 [完整原始输入](prompt.md)。该输入与主题提示词 v1 正文一致。

## 实现说明

按提示词“每个小功能输出一个 HTML”的要求，把复杂产品拆成 5 个功能模块，每个模块一个独立 HTML，页面以 mockup 边框横向排列、各自独立：

| 文件 | 模块 | 页面（3 个 mockup） |
|---|---|---|
| `index.html` | 01 首页 | 推荐流、搜索结果、订阅与频道 |
| `playback.html` | 02 播放 | 视频播放页、播放队列、沉浸 theater 模式 |
| `discover.html` | 03 发现 | 发现页、直播广场、话题短片 |
| `profile.html` | 04 个人中心 | 创作者主页、历史记录、通知与设置 |
| `studio.html` | 05 创作中心 | 数据概览、内容管理、上传与编辑 |

### 技术与视觉

- Tailwind CSS 通过 CDN 引入，图标全部使用 Lucide Static CDN（`https://unpkg.com/lucide-static@latest/icons/XXX.svg`），图片使用 Unsplash。
- 深色主题 + 玻璃拟态（半透明 + backdrop-filter），固定 340 × 700 的手机外框，内部内容区隐藏滚动条，页面之间互不影响。
- 顶部提供模块间跳转，站点预览中 5 个入口也分别登记。

### 交互

- 首页：分类标签切换、搜索框实时过滤结果、订阅按钮在「订阅 / 已订阅」间切换。
- 播放：播放 / 暂停按钮切换图标与进度、点赞数变化、队列条目选中态。
- 发现：分类标签切换、直播列表、话题短片页。
- 个人中心：视频 / 短片 / 直播 / 简介标签切换、历史记录筛选。
- 创作中心：概览柱状图、内容状态筛选（全部 / 已发布 / 草稿 / 直播回放）、标题字数实时统计、可见性单选。

## 运行与验证

Playwright + Chromium 自动化校验（模型生成的实现，均通过）：

- 5 个页面均加载 Tailwind CDN，且每页包含 3 个 mockup 页面。
- 全部 Unsplash 图片与 Lucide CDN 图标加载成功（`naturalWidth > 0`，无失败项）。
- 交互：搜索「露营」后结果由 4 条收敛为 3 条；分类标签高亮切换；点赞数 3.2 万 → 3.3 万；播放按钮图标在 play / pause 间切换；创作中心状态筛选后仅剩 1 条草稿；标题字数随输入实时更新。
- 5 个页面在桌面与 390px 视口下均无水平溢出；控制台无错误。
- 已知限制：原型为静态视觉稿，未接入真实数据与页面跳转；Tailwind 与图标均走 CDN，离线环境无法完整显示。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--minimax-m3-1-flash-max-r01`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整原始输入快照，与主题提示词 v1 正文一致（含英文版说明）。
- 工具：Claude Code CLI（当前会话，模型 MiniMax-M3.1-Flash，档位 max）。单会话直接实现，未使用子代理；本地用 Playwright/Chromium 以 390px 与桌面视口做自动化校验。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-2026-10-19；未记录单案例费用）
- [01 首页（推荐流 / 搜索结果 / 订阅）](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r01/index.html)
- [02 播放（播放页 / 队列 / 沉浸模式）](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r01/playback.html)
- [03 发现（发现页 / 直播 / 话题短片）](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r01/discover.html)
- [04 个人中心（主页 / 历史 / 通知设置）](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r01/profile.html)
- [05 创作中心（概览 / 内容 / 上传）](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r01/studio.html)

### 部署适配记录

- 提示词要求“每个小功能输出一个 html 并在用户输入继续后继续下一个功能”，本次运行一次性交付全部 5 个功能模块，每个模块一个独立 HTML 并在预览中分别登记入口。
- 原型按提示词使用 Tailwind CDN、Lucide Static CDN 图标与 Unsplash 图片，因此预览标记为 network: required。
- 迁移来源：F:\dev\ai-coding-demo-test 的 experiment/minimax-m3-1-flash-max 分支，提交 871beb18e0e85d6dd542cadca398e67aa4ff1247；保留该提交中的任务输入、实现源码和原有说明。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-20 在本仓库本地 HTTP 预览中补拍真实桌面截图，并按案例评分规则 v2 逐项复核。
- 维护者于 2026-10-20 按用户要求重新逐图评分，原始 PNG、输入及实现不变；旧分、新分、逐项观察和规则快照保存在 catalog/score-reviews/2026-10-20-minimax-m3-1-flash-max-v2.json。
<!-- archive:end -->
