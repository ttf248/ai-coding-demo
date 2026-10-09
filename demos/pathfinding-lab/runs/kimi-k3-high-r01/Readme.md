# 寻路算法实验室

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：纯静态单文件，file:// 直接打开或 HTTP 静态托管均可，无网络依赖。
- 入口：[index.html](index.html)
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 验证记录（Node 复算同一代价模型）：
  - 空白网格 (2,2)→(33,17)：46 步、总代价 46 ✓
  - “高代价河谷”预设：Dijkstra 与 A* 最小代价一致（均为 36），BFS 按步数为 18 步 ✓
  - “封闭终点”预设：搜索前沿耗尽后显示不可达 ✓
  - 暂停/单步真实控制搜索；搜索中编辑地图会停止并清除旧搜索；起终点不可被障碍覆盖 ✓
- 复盘：一次生成完成，未做追加修复。Dijkstra/A* 使用二叉堆加惰性删除，BFS 使用先进先出队列；起点代价不计入，高代价地形进入代价为 5。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：完整输入即主题任务正文 v1，无附加上下文。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $5.89 USD（11 个案例；原始消耗 883 GitHub Copilot credits，换算比例 10 USD / 1500 GitHub Copilot credits；批次 github-copilot-kimi-k3-high-2026-10-09；未记录单案例费用）
- [寻路算法实验室](../../../../demos/pathfinding-lab/runs/kimi-k3-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
