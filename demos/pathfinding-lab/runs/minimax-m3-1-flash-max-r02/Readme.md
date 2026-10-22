# 寻路算法实验室 · 三算法对比

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- BFS 使用 FIFO 队列按步数推进；Dijkstra 与 A* 使用地形代价推进，A* 的启发函数为曼哈顿距离乘最小格代价 1。
- 普通格进入代价 1、高代价地形进入代价 5，起点代价不计入；界面上同时显示路径步数与路径总代价，并注明 BFS 在加权地图上不一定是最小总代价。
- 支持绘制/擦除障碍、设置高代价地形、拖动起点终点；编辑地图会立即停止并清除当前搜索，避免混用状态。
- 搜索过程用 Canvas 绘制已访问、前沿与最终路径，支持运行、暂停、单步、速度调节、清除搜索与预设地图。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；单文件无外部依赖。
- 验证记录：
  - 空地图上 BFS 得到曼哈顿距离的步数（27 → 25 步，取决于预设起终点）。
  - 封闭终点预设中终点被墙体完全包围，搜索结束并显示不可达。
  - 加权地图上 Dijkstra 与 A* 得到相同的最小总代价（39）。
  - 单步只推进一个节点，暂停后状态停在 paused；编辑地图后已访问数归零且状态回到 idle。
- 已知限制：
  - 四方向移动，不含对角线；A* 使用曼哈顿距离，未提供八方向模式。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：完整任务正文，与 demos/pathfinding-lab/prompts/v1/prompt.md 一致。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；单文件无外部依赖。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [寻路实验室](../../../../demos/pathfinding-lab/runs/minimax-m3-1-flash-max-r02/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/pathfinding-lab/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
