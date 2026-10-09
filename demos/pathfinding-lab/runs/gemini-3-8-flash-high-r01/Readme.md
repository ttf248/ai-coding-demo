# 寻路算法实验室

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。零外部依赖，支持 `file://` 直接运行与静态 HTTP 托管。

核心实现：
1. **算法体系与四向移动**：
   - BFS：基于队列按步数扩展，求解最少步数路径。
   - Dijkstra：基于最小堆优先队列，按实际累计代价扩展（普通格代价 1，沼泽格代价 5）。
   - A*：结合真实代价 $g$ 与曼哈顿启发距离 $h = |x_1-x_2| + |y_1-y_2|$，定向收敛加速搜索。
2. **状态隔离与动画控制**：
   - 支持实时动画演示、暂停、单步推进与无级速度调节。
   - 搜索中编辑地图即时阻断并重置状态，防止状态混乱。
3. **验收测试达成**：
   - 开放网格路径直达无误。
   - 封闭终点触发显著不可达警告。
   - 加权走廊下 Dijkstra 与 A* 均精准避开沼泽求得相同最小代价，而 BFS 直穿泥沼保持步数最少。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [寻路算法实验室](../../../../demos/pathfinding-lab/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/gemini-3.8-flash`，提交 `7fea10d`。迁入时原始输入与实现未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
