# 生活情绪日记 · Astra Max

七屏情绪日记原型，含心情记录、写日记、回顾、时间轴、洞察、生活任务和设置。

任务版本：v1。模型与档位按用户提供记录为 **gpt-6-astra / max**。开始日期 2026-10-16，2026-10-17（Asia/Shanghai）继续完成验证与归档；本轮在同一会话直接执行，未委派子代理。

[输入快照](prompt.md) · [首次产物与修复](evidence/Readme.md) · [后续输入](evidence/follow-up.md) · [整轮实验报告](../../../../docs/experiments/gpt-6-astra-max-20261016/Readme.md)

输入完整性为 partial：保留了批量请求、仓库指令和所选任务正文，未完整导出系统/开发者上下文及工具历史；不作为隔离或同输入公平评测。

## 运行

联网双击 [index.html](index.html) 或 [canghe_app_prototype.html](canghe_app_prototype.html)，也可从根目录静态服务器打开。两个入口内容相同。每个手机框内可以独立滚动；跨手机框的导航定位到对应页面。

## 实现

- 单 HTML 展示七个 375px iPhone 原型；Tailwind CDN 与 Unsplash 图片。保留任务要求的 canghe_app_prototype.html，并以 index.html 为统一入口。
- 心情选择、日记文字与图片、时间轴详情、生活任务、呼吸倒计时、JSON 导出和本地保存。情绪回顾明确标注为固定演示。

## 验证

- 验证心情选择、保存并打开日记、添加任务、JSON 导出，刷新后 localStorage 中的日记仍存在。390px 无页面水平溢出。

具体脚本、运行报告与截图见整轮实验报告。自动验证环境为 Windows、Node.js 22.16.0、Playwright 1.58.2 和无头 Chromium，3D 检查使用 SwiftShader。

## 边界与复盘

- AI 回顾为明确标记的固定文案，未接入模型服务。统计与样本内容用于原型演示。
- 数据仅保存在当前浏览器，没有跨设备同步。Tailwind 与图片需要外网，不标记为离线。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--gpt-6-astra-max-r01`
- 模型：GPT-6 Astra；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：保存用户批量请求、用户仓库指令与所选任务正文原文。当前会话逐个执行，系统/开发者上下文与其他主题的工具过程未完整导出，不作为隔离或同输入公平评测。 用户后续“继续”另存 evidence/follow-up.md，未改写首次输入快照或任务正文。
- 工具：Codex。Windows / PowerShell / Node.js 22.16.0；按用户明确指定记录 gpt-6-astra / max；当前会话直接执行，未委派子代理。最新版本优先；已归档主题跳过。基线目录已有其他实验残留，未读取实现，移至 .cache/preexisting-run-artifacts-20261016 保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 13 %（ChatGPT Plus 周额度）（11 个案例；批次 gpt-6-astra-max-2026-10-16；未记录单案例费用）
- [主页面](../../../../demos/life-diary/runs/gpt-6-astra-max-r01/index.html)
- [原任务文件名入口](../../../../demos/life-diary/runs/gpt-6-astra-max-r01/canghe_app_prototype.html)

### 部署适配记录

- 本轮按所选任务正文创建新实验，当前会话直接执行；首次实现保留为 evidence/first-pass.zip，后续修复均由本会话代理完成，无人工代码修改。
- 首次产物通过本轮针对性验收，未对核心实现追加修复。
- 从 experiment/gpt-6-astra-max-20261016 分支迁移到 main；保留原始实现、输入、首次产物、修复记录和验证报告。
- 迁移归档时于 2026-10-17 在 1440px 桌面视口补拍真实运行截图，并按案例截图评分规则 v2 逐图复核；截图、维度与依据保存在本实验记录。
- 本轮 11 个案例的订阅额度消耗与耗时由用户按批次提供，关联 billing batch gpt-6-astra-max-2026-10-16，不拆分为单案例。
- 2026-10-17 应用户要求按案例截图评分规则 v2 重新逐图评分；保留既有截图和输入，旧分、新分及逐项观察归档于 catalog/score-reviews/2026-10-17-gpt-6-astra-max-v2.json。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
