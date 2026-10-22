# 寻路算法实验室

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `index.html`，可 file:// 直接打开，无 CDN。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- BFS 按步数；Dijkstra/A* 按进入代价（普通 1、高代价 5，起点不计入）；A* 使用曼哈顿距离。三种算法共用逐节点步进的搜索对象，因此“运行/暂停/单步”都是真实控制搜索。
- 搜索期间编辑地图或拖动起终点会立即停止并清除旧搜索；起终点不能被障碍/地形覆盖，也不能重合。
- 提供空地图、墙与缺口、加权地形、终点被封闭、固定伪随机地图 5 个可重复预设。

**已知局限与未验证项**

- BFS 的总代价按其路径实际经过的地形计算，不代表最小代价。
- 地图尺寸固定为 24×16。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright 调用求解：空地图三种算法均得到 19 步；加权预设中 Dijkstra 与 A* 同为代价 25，BFS 步数 19 但代价 43；封闭终点预设判定不可达；暂停与单步可控；编辑地图会清除旧搜索；起终点不能拖到障碍上。 390px 无水平溢出；无控制台错误；未在真实触摸设备上验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Anthropic 批次合计 $0.60 USD（11 个案例；原始消耗 3 percent，换算比例 20 USD / 100 percent；批次 claude-sonnet-5-5-medium-r01；未记录单案例费用）
- [主页面](../../../../demos/pathfinding-lab/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

- 从 F:\dev\ai-coding-demo-test 的 experiment/claude-sonnet-5-5-medium-r01（a7e690a3c5696ecd6a1c4532dd170308e2169401）迁入当前 main；保留实验产物、原始输入和源分支已记录的验证结果。
- 2026-10-12: 在当前 main 的本地 HTTP 预览中，以 Chromium 1440×1000 补拍实际运行桌面图 preview-2026-10-12.png；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
