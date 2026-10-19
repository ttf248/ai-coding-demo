# 寻路实验室 · 首轮

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1 原文快照）。

## 运行与复盘

- 运行方式：DeepSeek-V4.1-Flash-0731（档位 max）在 Claude Code 当前会话直接生成；未使用子代理、未提供后续追问。
- 产物入口：[index.html](index.html)（纯静态单文件，离线可用）。
- 验证记录（Playwright，HTTP 与 file:// 双路径，24 项断言全部通过）：
  - 无障碍网格：BFS/Dijkstra/A* 均 19 步、代价 19，路径 20 节点
  - 加权地图：BFS 直穿高代价带（19 步/代价 55）；Dijkstra 绕行最小代价 27；A* 与 Dijkstra 一致
  - 封闭终点明确显示不可达；暂停后不推进、单步精确推进 1 个节点、恢复后完成
  - 搜索期间编辑地图立即停止并清空旧搜索
  - 墙笔画不覆盖起点；终点拖到障碍上被拒绝；拖动终点后 A* 结果正确（24 步/代价 24）
  - 390px 触摸可编辑；file:// 运行结果正确、无控制台错误
- 过程记录：验证阶段修复算法切换/重置时旧搜索生成器未失效的状态混用问题（否则暂停/播放混用产生错误路径）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--deepseek-v4-1-flash-0731-max-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：任务正文 v1 原文。单次输入，未附后续追问或其他上下文。
- 工具：Claude Code 2.1.295。用户指定模型 DeepSeek-V4.1-Flash-0731、档位 max；当前会话直接生成，未使用子代理；Windows 11 / Node v22.16.0。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.78 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-max-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/pathfinding-lab/runs/deepseek-v4-1-flash-0731-max-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/pathfinding-lab/runs/deepseek-v4-1-flash-max-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 打开实际入口并补拍桌面截图；390px 检查无页面横向溢出，Playwright 控制台无页面错误。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
<!-- archive:end -->
