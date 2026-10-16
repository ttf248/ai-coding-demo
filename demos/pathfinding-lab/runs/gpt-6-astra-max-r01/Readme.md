# 寻路算法实验室 · Astra Max

可编辑网格的 BFS、Dijkstra 与 A* 实验室，真实展示搜索过程、最短步数和地形代价。

任务版本：v1。模型与档位按用户提供记录为 **gpt-6-astra / max**。开始日期 2026-10-16，2026-10-17（Asia/Shanghai）继续完成验证与归档；本轮在同一会话直接执行，未委派子代理。

[输入快照](prompt.md) · [首次产物与修复](evidence/Readme.md) · [后续输入](evidence/follow-up.md) · [整轮实验报告](../../../../docs/experiments/gpt-6-astra-max-20261016/Readme.md)

输入完整性为 partial：保留了批量请求、仓库指令和所选任务正文，未完整导出系统/开发者上下文及工具历史；不作为隔离或同输入公平评测。

## 运行

直接双击 [index.html](index.html) 即可离线运行；也可在仓库根目录执行 `npm run preview` 后从主题页进入。

## 实现

- 四方向网格；普通格代价 1、高代价格 5、起点代价不计入，A* 使用曼哈顿启发式。可绘制墙、地形，擦除和移动起终点。
- 运行、暂停、单步、速度、清除搜索和确定性地图预设；搜索期间编辑会停止并清空旧状态。

## 验证

- 空地图路径 23 步、代价 23；加权地图 BFS 为 23 步、代价 83，Dijkstra 与 A* 均得到最小代价 25。
- 封闭终点显示不可达；暂停后访问数不变，单步增加一个访问节点；编辑清空搜索，移动端触摸可用。

具体脚本、运行报告与截图见整轮实验报告。自动验证环境为 Windows、Node.js 22.16.0、Playwright 1.58.2 和无头 Chromium，3D 检查使用 SwiftShader。

## 边界与复盘

- 算法限制为四方向正代价网格；不同算法的视觉运行速度受界面步进设置影响，不作为公平性能测试。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--gpt-6-astra-max-r01`
- 模型：GPT-6 Astra；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：保存用户批量请求、用户仓库指令与所选任务正文原文。当前会话逐个执行，系统/开发者上下文与其他主题的工具过程未完整导出，不作为隔离或同输入公平评测。 用户后续“继续”另存 evidence/follow-up.md，未改写首次输入快照或任务正文。
- 工具：Codex。Windows / PowerShell / Node.js 22.16.0；按用户明确指定记录 gpt-6-astra / max；当前会话直接执行，未委派子代理。最新版本优先；已归档主题跳过。基线目录已有其他实验残留，未读取实现，移至 .cache/preexisting-run-artifacts-20261016 保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 13 %（ChatGPT Plus 周额度）（11 个案例；批次 gpt-6-astra-max-2026-10-16；未记录单案例费用）
- [主页面](../../../../demos/pathfinding-lab/runs/gpt-6-astra-max-r01/index.html)

### 部署适配记录

- 本轮按所选任务正文创建新实验，当前会话直接执行；首次实现保留为 evidence/first-pass.zip，后续修复均由本会话代理完成，无人工代码修改。
- 首次产物通过本轮针对性验收，未对核心实现追加修复。
- 从 experiment/gpt-6-astra-max-20261016 分支迁移到 main；保留原始实现、输入、首次产物、修复记录和验证报告。
- 迁移归档时于 2026-10-17 在 1440px 桌面视口补拍真实运行截图，并按案例截图评分规则 v2 逐图复核；截图、维度与依据保存在本实验记录。
- 本轮 11 个案例的订阅额度消耗与耗时由用户按批次提供，关联 billing batch gpt-6-astra-max-2026-10-16，不拆分为单案例。
<!-- archive:end -->
