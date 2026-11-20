# 网格寻路算法实验室

## 原始提示词

见 [完整原始输入](prompt.md)，对应共用任务正文 [v1](../../prompts/v1/prompt.md)。

## 实现与功能说明

- 算法与代价规则：四方向移动；起点不计代价，普通格进入代价 1，高代价格进入代价 5。BFS 按最少步数搜索，Dijkstra 与 A*（曼哈顿距离）严格按最小地形总代价求解。
- 状态与交互保护：支持运行、暂停、单步、速度调节、清除搜索、重置地图与四种预设；搜索期间任意编辑地图会自动停止并清除旧搜索态；起终点不可被障碍覆盖；封闭终点明确显示不可达提示。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--gemini-4-hydrogen-xhigh-r01`
- 模型：Gemini 4 Hydrogen；推理档位：xhigh
- 执行模式：按原任务执行；备注：源提交按测试基线的共用任务正文在当前会话直接执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：按 pathfinding-lab 任务正文 v1 原文在当前会话直接执行。 源提交的快照保留批次会话指令与本主题任务正文。
- 工具：agy v1.5.13。纯原生单 HTML 实现，无外部依赖，支持桌面鼠标与移动端触摸编辑。 工具版本由用户提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-hydrogen-xhigh-agy-pro-2026-11-20；未记录单案例费用）
- [寻路实验室](../../../../demos/pathfinding-lab/runs/gemini-4-hydrogen-xhigh-r01/index.html)

### 部署适配记录

- 导入来源为独立测试目录 ai-coding-demo-test 的 experiment/gemini-4-hydrogen-xhigh 提交 d446209f3631a2109360d9e25d604654e75f79d4，保留其原始输入快照。
- 归档时为本仓库维护的 HTML 入口接入公共访问统计。
- 源提交没有真实截图。归档时采集桌面、手机及适用交互状态，逐帧按 v3 复核并登记真实桌面封面。
<!-- archive:end -->
