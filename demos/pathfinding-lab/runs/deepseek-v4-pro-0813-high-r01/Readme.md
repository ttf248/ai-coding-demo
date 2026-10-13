# 寻路算法实验室

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/pathfinding-lab/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`，浏览器直接打开或静态托管均可运行，无外部依赖。
- 实现：网格寻路可视化，支持 BFS / Dijkstra / A*（四方向移动，A* 使用曼哈顿距离）、障碍与高代价地形绘制、起终点拖动、运行 / 暂停 / 单步 / 速度调节、清除搜索与重置、可复现预设地图。
- 代价模型：BFS 按步数（每步 1），Dijkstra 与 A* 按地形代价（普通 1、高代价 5），起点代价不计入。
- 验证：无障碍最短路径正确；封闭终点明确显示不可达；加权地图上 Dijkstra 与 A* 得到相同最小代价；BFS 展示步数最少路径；搜索期间编辑会停止并清除旧搜索；起终点不可被障碍覆盖；移动端可触摸编辑。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/pathfinding-lab/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/pathfinding-lab/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
<!-- archive:end -->
