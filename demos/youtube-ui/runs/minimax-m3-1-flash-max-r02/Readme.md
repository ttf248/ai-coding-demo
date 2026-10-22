# 视频社区 UI/UX 参考图

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- 按功能拆分为 4 个 HTML：首页与推荐（推荐首页 / Shorts / 分类聚合）、搜索与筛选（搜索首页 / 结果 / 筛选抽屉）、观看与互动（观看页 / 评论区 / 播放列表）、订阅与消息（订阅 / 频道主页 / 消息中心）。
- 每个页面用独立的 375×780 mockup 边框并列渲染，页面之间互不影响；所有列表容器隐藏滚动条。
- 图标统一用 Lucide Static CDN（https://unpkg.com/lucide-static@latest/icons/XXX.svg），未手写 SVG 路径；图片使用 Unsplash 直链；样式全部使用 Tailwind 工具类。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；Tailwind / Lucide Static / Unsplash 走 CDN，需要联网。
- 验证记录：
  - 4 个 HTML 均能打开，每个包含 3 个独立 mockup 框。
  - Lucide 图标通过 CDN 正常加载（深色底统一反色），无 404 报错；Tailwind 类生效。
  - 页面无滚动条（.no-scroll 隐藏滚动条），390px 视口下无横向溢出。
- 已知限制：
  - 原始任务要求“输出完成后提示用户是否继续”，本轮按“全部案例一次性完成”的指示直接产出全部 4 个功能，未做逐功能确认。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整任务正文，与 demos/youtube-ui/prompts/v1/prompt.md 一致；按“每个功能一个 HTML”的方式输出 4 个文件。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；Tailwind / Lucide Static / Unsplash 走 CDN，需要联网。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [首页与推荐](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r02/home-feed.html)
- [搜索与筛选](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r02/search.html)
- [观看与互动](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r02/watch.html)
- [订阅与消息](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r02/channels.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/youtube-ui/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
