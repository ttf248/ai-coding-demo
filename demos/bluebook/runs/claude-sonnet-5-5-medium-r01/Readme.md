# 小蓝书瀑布流

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：构建型：源码在本目录，已通过 `npm run build:demo -- bluebook--claude-sonnet-5-5-medium-r01` 生成 `previews/bluebook/claude-sonnet-5-5-medium-r01/`。本地开发：`npm ci && npm run dev`。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- React 18 + TypeScript + Tailwind 3 + Zustand + react-lazyload；mock 图片由 SVG 在代码中生成（不依赖外部网络），约每 11 条使用不存在的地址以演示失败兜底。
- 2/3/4 列由窗口宽度（<768 / ≥768 / ≥1100）决定；列分配按列高度估算；触底使用 IntersectionObserver 加载更多，下拉刷新同时支持触摸与鼠标。
- 实现中需显式依赖 `prop-types`：react-lazyload 将其作为 peer 依赖，缺失会导致构建产物运行时报错，已在 package.json 中补充。

**已知局限与未验证项**

- 发布按钮仅为演示占位；详情页为简化实现。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：tsc 类型检查与 vite build 通过；Playwright 在 390px/820px/1280px 下分别为 2/3/4 列，首屏 20 张卡片，连续滚动到底部加载更多（20→32→44），点赞计数 +1，图片失败显示默认图，搜索过滤。 下拉刷新通过 CDP 触摸事件模拟验证（刷新后恢复 20 条、点赞状态重置）；主动构造的约每 11 条 1 张不存在图片地址会触发 404，属于演示图片失败兜底；未在真实 iPhone 上验证。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Anthropic 批次合计 $0.60 USD（11 个案例；原始消耗 3 percent，换算比例 20 USD / 100 percent；批次 claude-sonnet-5-5-medium-r01；未记录单案例费用）
- [主页面](../../../../previews/bluebook/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

- 从 F:\dev\ai-coding-demo-test 的 experiment/claude-sonnet-5-5-medium-r01（a7e690a3c5696ecd6a1c4532dd170308e2169401）迁入当前 main；保留实验产物、原始输入和源分支已记录的验证结果。
- 2026-10-12: 在当前 main 的本地 HTTP 预览中，以 Chromium 1440×1000 补拍实际运行桌面图 preview-2026-10-12.png；先滚动首批 24 张文章卡片触发延迟加载，再返回顶部截图；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
