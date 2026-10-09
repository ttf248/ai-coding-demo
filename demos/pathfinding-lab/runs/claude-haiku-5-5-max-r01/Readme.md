# 寻路算法实验室 · 单文件网页

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

运行：直接打开本目录 `index.html`。

验证：无头 Chromium 自动化 14 项检查：加权山谷预设中 Dijkstra 与 A* 最小代价同为 34；BFS 以 20 步到达并沿直线穿过高代价区（代价 48，仅作参考）；封闭终点显示不可达；暂停冻结搜索、单步前进一次；搜索中编辑地图会停止并清除旧搜索；起终点不能放在障碍上；390 px 无横向溢出。

复盘：拖动端点与绘制未做触摸自动化测试；代价规则按任务正文实现（起点不计、普通格 1、高代价格 5）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--claude-haiku-5-5-max-r01`
- 模型：Claude Haiku 5.5；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：prompt.md 为任务正文原文，与 prompts 版本字节一致；会话系统上下文与工具设定未随记录留存，记为 partial。
- 工具：Copilot SDK（VS Code 当前会话）。模型 claude-haiku-5-5、档位 max 由用户指定；会话内无法核验运行时实际配置（本地用量表无记录）。直接在当前会话完成，未委派子代理，未另建克隆；结果未提交、未推送。 来源：F:/dev/ai-coding-demo-test 的 model-test-base 工作树（HEAD 452ac588702d3bde24f048fcf47cc5ffa7abb602），迁移时源记录未提交；输入快照与模型产物按源文件保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.65 USD（11 个案例；原始消耗 463.99 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-claude-haiku-5-5-max-2026-10-09；未记录单案例费用）
- [实验室](../../../../demos/pathfinding-lab/runs/claude-haiku-5-5-max-r01/index.html)

### 部署适配记录

- 来源：F:/dev/ai-coding-demo-test 的 model-test-base 工作树（HEAD 452ac588702d3bde24f048fcf47cc5ffa7abb602），迁移时源记录未提交；输入快照与模型产物按源文件保留。
- 迁入后通过本地 HTTP 页面补拍实际桌面截图 screenshot.png；源输入与模型产物未改写。
<!-- archive:end -->
