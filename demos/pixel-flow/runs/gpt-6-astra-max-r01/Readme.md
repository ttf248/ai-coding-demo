# Pixel Flow · Astra Max

本地图片转彩色粒子，通过指针或 MediaPipe 手势吸引、暂停与还原原图。

任务版本：v1。模型与档位按用户提供记录为 **gpt-6-astra / max**。开始日期 2026-10-16，2026-10-17（Asia/Shanghai）继续完成验证与归档；本轮在同一会话直接执行，未委派子代理。

[输入快照](prompt.md) · [首次产物与修复](evidence/Readme.md) · [后续输入](evidence/follow-up.md) · [整轮实验报告](../../../../docs/experiments/gpt-6-astra-max-20261016/Readme.md)

输入完整性为 partial：保留了批量请求、仓库指令和所选任务正文，未完整导出系统/开发者上下文及工具历史；不作为隔离或同输入公平评测。

## 运行

从仓库根目录执行 `npm run preview`，打开 `http://localhost:4173/demos/pixel-flow/runs/gpt-6-astra-max-r01/index.html`。允许摄像头后使用手势；也可以仅上传图片并用鼠标/触屏操作。线上摄像头需要 HTTPS；CDN、WASM 和手部模型需要联网。

## 实现

- Canvas 采样本地图片，Three.js Points 保存原位置与颜色；初始随机飘散，提供局部吸引场、完整还原、散开、暂停、采样率及速度设置。
- 点击开启摄像头后加载 MediaPipe Hand Landmarker，实时 detectForVideo 与镜像关键点叠加；张掌吸引、握拳停止、捏合还原，支持关闭视频轨道与模型。

## 验证

- 验证图片上传、采样率、还原进度、散开与暂停；还原截图可见原始图案。390px 无页面水平溢出。
- Chromium 合成摄像头验证 MediaPipe 模型、WASM 下载及 detectForVideo 推理，测试权限拒绝消息和关闭摄像头。

具体脚本、运行报告与截图见整轮实验报告。自动验证环境为 Windows、Node.js 22.16.0、Playwright 1.58.2 和无头 Chromium，3D 检查使用 SwiftShader。

## 边界与复盘

- 没有使用真实人手或实体摄像头；合成流通过只能证明加载与推理链路可运行，不能证明真实手势识别率。
- 手势规则是关键点距离启发式，受视角、遮挡及光照影响；无后端，图片与视频在浏览器中处理。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-6-astra-max-r01`
- 模型：GPT-6 Astra；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：保存用户批量请求、用户仓库指令与所选任务正文原文。当前会话逐个执行，系统/开发者上下文与其他主题的工具过程未完整导出，不作为隔离或同输入公平评测。 用户后续“继续”另存 evidence/follow-up.md，未改写首次输入快照或任务正文。
- 工具：Codex。Windows / PowerShell / Node.js 22.16.0；按用户明确指定记录 gpt-6-astra / max；当前会话直接执行，未委派子代理。最新版本优先；已归档主题跳过。基线目录已有其他实验残留，未读取实现，移至 .cache/preexisting-run-artifacts-20261016 保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 13 %（ChatGPT Plus 周额度）（11 个案例；批次 gpt-6-astra-max-2026-10-16；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/gpt-6-astra-max-r01/index.html)

### 部署适配记录

- 本轮按所选任务正文创建新实验，当前会话直接执行；首次实现保留为 evidence/first-pass.zip，后续修复均由本会话代理完成，无人工代码修改。
- 修正粒子总数使用浮点数组长度而非顶点数量的问题：total = list.length / 3；复核 4960 点默认图案及图片还原。
- 从 experiment/gpt-6-astra-max-20261016 分支迁移到 main；保留原始实现、输入、首次产物、修复记录和验证报告。
- 迁移归档时于 2026-10-17 在 1440px 桌面视口补拍真实运行截图，并按案例截图评分规则 v2 逐图复核；截图、维度与依据保存在本实验记录。
- 本轮 11 个案例的订阅额度消耗与耗时由用户按批次提供，关联 billing batch gpt-6-astra-max-2026-10-16，不拆分为单案例。
- 2026-10-17 应用户要求按案例截图评分规则 v2 重新逐图评分；保留既有截图和输入，旧分、新分及逐项观察归档于 catalog/score-reviews/2026-10-17-gpt-6-astra-max-v2.json。
<!-- archive:end -->
