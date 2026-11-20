# 寻路算法实验室

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：纯静态单文件网页，直接打开 `index.html` 即可运行（支持 `file://` 与 HTTP），零外部依赖。
- **核心架构**：
  1. **步进式寻路状态机**：实现 BFS（无权最短步数）、Dijkstra（加权最小累积代价）与 A*（加权最小代价 + 四方向曼哈顿距离启发式）的状态机生成器，支持实时连续动画、随时暂停、逐帧单步推进及速度无级调节。
  2. **严格的代价与边界规则**：起点代价不计入，进入普通格代价为 1，进入高代价泥沼/山地格代价为 5；在加权地形下直观对比 BFS（走步数最少但穿越高代价区）与 Dijkstra/A*（绕行低代价区获取最小总代价）；当终点被障碍完全包围时准确终止并弹出“目标不可达”状态提示。
  3. **防状态污染与触控适配**：在搜索运行或暂停中途修改地图（绘制墙壁、涂抹高代价区、拖拽起终点）会自动终止并清除旧搜索轨迹；起终点受保护不可被障碍覆盖；完美适配 390px 移动端触摸绘制与预设切换。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：按 demos/pathfinding-lab/prompts/v1/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/pathfinding-lab/runs/gemini-4-argon-medium-r01/index.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
