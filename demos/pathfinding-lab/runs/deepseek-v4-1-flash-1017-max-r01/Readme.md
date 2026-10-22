# 寻路算法实验室

## 原始输入

- 完整原始输入：[prompt.md](prompt.md)
- 任务正文版本：[v1](../../prompts/v1/prompt.md)。

## 实现说明

- 单文件离线页面，入口 [index.html](index.html)；Canvas 2D 网格，24×14。
- 算法：BFS（队列、按步数）、Dijkstra（最小堆、按代价）、A*（最小堆、曼哈顿启发）。
- 规则：四方向移动；起点代价不计；普通格进入 +1，高代价格 +5；BFS 的路径代价按实际经过地形累计，Dijkstra/A* 共用最小代价目标。
- 交互：绘制障碍/高代价/擦除、拖动起点终点、运行/暂停/单步/速度、清除搜索、重置地图、空地/加权/迷宫/封闭终点预设。
- 逐步搜索由真实算法状态推进；编辑地图会立刻停止动画并清空旧搜索，避免新旧状态混用。

## 验证记录

- Playwright 自动化结果：
  - 空地：BFS/Dijkstra/A* 均 19 步、代价 19；A* 访问 20 个节点，BFS 253，Dijkstra 246。
  - 加权：BFS 19 步/代价 43；Dijkstra 与 A* 均为 29 步/代价 29（绕开泥地）。
  - 迷宫：三种算法均 62 步/代价 62。
  - 封闭终点：三种算法均返回 unreachable。
  - 单步执行两次后已访问节点从 1 增至 2，暂停/单步为真实状态控制。
- 390px 无页面水平溢出，触摸/指针编辑路径可用。

## 复盘

- 加权预设最初有额外墙体，导致绕路必须穿过泥地，BFS 和 Dijkstra 的成本无法区分；移除墙体后形成“直行短但贵、绕行长但便宜”的清晰对照。
- A* 的启发函数使用单位代价曼哈顿距离，对 1/5 地形代价仍可采纳，因此与 Dijkstra 同代价。
- 搜索速度滑块与单步按钮共享同一个 step 函数，没有用假动画替代算法。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--deepseek-v4-1-flash-1017-max-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：包含用户会话指令与任务正文原文；任务正文未改写。 任务正文版本 v1。
- 工具：Claude Code / DeepSeek-V4.1-Flash-1017。当前 Claude Code 会话直接执行，未委派子代理；Windows 11 + Node 22.16.0；模型与档位由用户指定。使用本地 HTTP 静态服务器与 Playwright/Chromium（WebGL 软件光栅器）做加载、交互与 390px 溢出检查；软件光栅器帧率不代表硬件 GPU 表现。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 4.46 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-max-2026-10-19；未记录单案例费用）
- [主页面](../../../../demos/pathfinding-lab/runs/deepseek-v4-1-flash-1017-max-r01/index.html)

### 部署适配记录

- 自查修复：加权预设移除阻挡绕路的墙体，使 BFS 与 Dijkstra/A* 的代价差异可观察；墙工具改为持续绘制而非切换。
- 编辑地图会立即停止动画并清空旧搜索；BFS 的代价按实际经过地形累计，Dijkstra/A* 共用优先级队列。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017 分支未提交工作区导入本轮 max 档结果；基线提交 452ac58，文件来源指纹见 docs/imports/2026-10-19-deepseek-1017-max.json；未覆盖历史实验。
- 迁移维护者为全部 HTML 入口添加带 defer 的公共 assets/analytics.js 引用；小蓝书配置适配 previews 路径并重新构建。
- 源记录没有截图；迁移时补拍真实桌面页面并按当前 v2 规则逐图复核。费用 ¥4.46、92,462,698 Tokens 与耗时 59m 52s 为用户提供的整批 11 个案例合计，不拆分到单案例。
- 迁移补拍：Chromium 1440×960、deviceScaleFactor=1；默认加权地图经实际求解器运行至结束：{"status":"done","steps":29,"cost":29,"visited":104,"path":[170,171,172,173,174,175,176,200,224,248,272,296,297,298,299,300,301,302,303,279,255,231,207,183,184,185,186,187,188,189]}。截图页面 index.html，远程统计请求被拦截；软件 WebGL 不作为硬件性能证据。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
