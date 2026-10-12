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
- [主页面](../../../../demos/pathfinding-lab/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
