# 寻路实验室

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/pathfinding-lab/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，Canvas 2D + 原生 JavaScript，无外部依赖。
- 入口：本目录 `index.html`。

### 实现方式

BFS、Dijkstra、A* 三种算法共用同一份网格数据和同一个「生成器式单步推进」框架，每次点击运行后同步推进一步，因此三者的中间过程可以逐格对照，而不是各自跑完再比结果。

- BFS：等权无权图，队列推进。
- Dijkstra：带最小堆的贪心松弛，按累计代价升序展开。
- A*：`f = g + h`，h 为八方向移动的八角距离启发式。

编辑操作（改墙、改代价、拖起终点）会立即停止正在进行的搜索并清空三者的结果，避免新旧状态混在一起。

### 验证记录

用 Playwright 驱动 UI 后读取每种算法的步数与代价：

| 地图 | BFS | Dijkstra | A* | 结论 |
| --- | --- | --- | --- | --- |
| 空旷网格 | 46 步 / 代价 46 | 46 / 46 | 46 / 46 | 无障碍时三者等价 |
| 终点被封闭 | 不可达 | 不可达 | 不可达 | 三者一致失败 |
| 加权走廊 | **35 步 / 代价 127** | **43 步 / 代价 43** | **43 步 / 代价 43** | BFS 步数最少但代价不是最优；Dijkstra 与 A* 同为最优 |
| 迷宫预设 | 48 步 | 48 步 | 48 步 | 无代价地形时三者一致 |

- 390px：`scrollWidth == clientWidth == 390`。
- 控制台错误：0。

### 已知限制

- 只支持 4 邻域与 8 邻域的对角移动，不允许穿墙角。
- 网格固定 32×24，不随窗口调整密度。

### 过程中修掉的真实问题

1. CSS 变量误写成无效色值 `--line:#2c3purple`。
2. `PRESETS` 常量在定义之前被 IIFE 引用，抛 `ReferenceError`。
3. 加权走廊预设里一道竖墙把通路完全封死，导致起终点不可达。
4. 迷宫预设本身不连通，和「迷宫应当有唯一通路」的预期不符。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--minimax-m3-1-flash-preview-max-r02`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：本目录 prompt.md 与 demos/pathfinding-lab/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code 桌面版（MiniMax M3.1 Flash Preview）。纯静态单文件，无外部依赖，network 为 offline。390px 下 scrollWidth == clientWidth，控制台无错误。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。 本轮使用 MiniMax Code 桌面版执行，未使用 Claude Code。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 37 %（Max 订阅套餐五小时额度）（11 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-13；未记录单案例费用）
- [寻路实验室](../../../../demos/pathfinding-lab/runs/minimax-m3-1-flash-preview-max-r02/index.html)

### 部署适配记录

- 三种算法共用同一份网格与同一个最小堆推进器，数值结果可直接横向对比。
- 加权走廊地图实测：BFS 35 步 / 代价 127，Dijkstra 与 A* 均为 43 步 / 代价 43，验证了「BFS 步数最少但未必最优、A* 与 Dijkstra 同为最优」。
- 修复 CSS 变量误写为无效色值、PRESETS 在定义前被 IIFE 引用导致 ReferenceError、加权走廊竖墙把通路完全封死、以及迷宫预设本身不连通。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/minimax-m3-1-flash-preview-max）/demos/pathfinding-lab/runs/minimax-m3-1-flash-preview-max-r01；当前 main 已存在该轮号，保留历史并迁入为 minimax-m3-1-flash-preview-max-r02。
- 迁移验证：使用本仓库本地 HTTP 入口补拍实际桌面截图 screenshot.png；Chromium 确认入口可加载且无页面异常，390px 视口横向溢出为 0。
- 迁移验证补充：本 static 入口可通过 file:// 直接打开，Chromium 页面异常为 0。
<!-- archive:end -->
