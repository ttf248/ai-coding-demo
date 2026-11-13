# 寻路算法实验室

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 `index.html`（file:// 或 HTTP 静态托管均可），无后端、无 CDN、无构建步骤。
- 入口：`index.html`（单文件，HTML/CSS/JS 全部内联）。
- 实现要点：
  - 32×20 网格，四方向移动；BFS（队列，按步数）、Dijkstra / A*（二叉堆，按地形代价，A* 曼哈顿启发，同 f 按 h 再按索引 tie-break 保证确定性）。
  - 代价模型：普通格进入代价 1，高代价格 5，起点不计；BFS 忽略地形代价只最少步数，路径代价仍按实际地形统计。
  - 算法写成生成器，每展开一个节点 yield：运行按速度滑块逐帧推进，暂停真实冻结主循环，单步精确展开 1 个节点。
  - 可视化：已访问（蓝）、前沿（黄）、最终路径（绿）、障碍、高代价斜纹、起终点圆标；统计步数 / 总代价 / 访问数 / 前沿数 / 状态。
  - 编辑保护：障碍不能覆盖起终点，起终点不能放在障碍上；搜索期间任何编辑立即停止并清除旧搜索。
  - 预设可重复：空网格、迷宫、加权谷地、不可达（整列墙）。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器，file:// 打开，脚本断言）：
  - 空网格 A*：步数 27 = 曼哈顿距离，代价 27。✔
  - 加权谷地：Dijkstra 代价 39 = A* 代价 39；BFS 步数 31 ≤ Dijkstra 步数 39。✔
  - 不可达预设：状态 unreachable，路径为 null，状态栏明确提示。✔
  - 单步恰好展开 1 个节点；暂停由主循环状态门控。✔
  - 障碍工具点击起点被拒绝；起点工具点击障碍格被拒绝。✔
  - 搜索中绘制障碍 → 搜索立即清除。✔
- 复盘：堆比较器以 (f, h, index) 排序保证 A* 与 Dijkstra 在加权图上得到相同最小代价且结果可复现；BFS 用 visited 入队即标记避免重复。生成器 + 主循环门控使暂停 / 单步不依赖定时器，状态干净。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：批量指令原文与任务正文 v1 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用与 Token 未提供，不分摊；其他执行条件为源声明。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [寻路实验室](../../../../demos/pathfinding-lab/runs/qwen4-max-preview-xhigh-r01/index.html)

### 部署适配记录

- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入与复盘，不合并测试基线。
- 2026-11-13：追加 defer 公共统计引用，补采真实截图，按 v3 由 Codex 逐图视觉复核；源声明不等于独立功能验收。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
