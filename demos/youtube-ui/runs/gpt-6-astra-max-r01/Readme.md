# YouTube UI 模块 · Astra Max

五个独立 HTML 模块、十屏视频应用原型，含推荐搜索、播放、发现订阅、个人中心和创作。

任务版本：v1。模型与档位按用户提供记录为 **gpt-6-astra / max**。开始日期 2026-10-16，2026-10-17（Asia/Shanghai）继续完成验证与归档；本轮在同一会话直接执行，未委派子代理。

[输入快照](prompt.md) · [首次产物与修复](evidence/Readme.md) · [后续输入](evidence/follow-up.md) · [整轮实验报告](../../../../docs/experiments/gpt-6-astra-max-20261016/Readme.md)

输入完整性为 partial：保留了批量请求、仓库指令和所选任务正文，未完整导出系统/开发者上下文及工具历史；不作为隔离或同输入公平评测。

## 运行

联网打开 [首页](index.html)、[播放与评论](watch.html)、[发现与订阅](explore.html)、[个人中心](profile.html) 或 [创作中心](studio.html)，也可以从静态服务器访问。每个模块的手机框独立展示，内部滚动条隐藏。

## 实现

- 首页/搜索、播放/评论、发现/订阅、历史/收藏、创作概览/上传共五个 HTML、十个手机屏；Tailwind CDN、Unsplash 照片和固定版本 Lucide Static CDN 图标。
- 搜索、订阅、点赞、评论、收藏、观看历史、模块导航与上传元数据草稿实际可操作。播放页使用明确标记的 MDN CC0 示例视频。

## 验证

- 验证搜索与空结果、订阅、评论、收藏在个人页可见、上传草稿保存；所有模块完成 HTTP 与 file:// 冒烟检查。390px 无页面水平溢出。

具体脚本、运行报告与截图见整轮实验报告。自动验证环境为 Windows、Node.js 22.16.0、Playwright 1.58.2 和无头 Chromium，3D 检查使用 SwiftShader。

## 边界与复盘

- 没有视频上传后端，上传仅保存文件名等本地草稿元数据；示例账号、内容和分析数据不是线上业务数据。
- 原提示词要求的 Artifacts 插件在本会话不可用，实际使用本地 Chromium 可视化与截图。按用户“全部做一遍”的批量指令连续完成全部模块，没有逐模块等待确认。
- 依赖 Tailwind、Lucide、Unsplash 和视频外链，因此需要联网。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gpt-6-astra-max-r01`
- 模型：GPT-6 Astra；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：保存用户批量请求、用户仓库指令与所选任务正文原文。当前会话逐个执行，系统/开发者上下文与其他主题的工具过程未完整导出，不作为隔离或同输入公平评测。 用户后续“继续”另存 evidence/follow-up.md，未改写首次输入快照或任务正文。
- 工具：Codex。Windows / PowerShell / Node.js 22.16.0；按用户明确指定记录 gpt-6-astra / max；当前会话直接执行，未委派子代理。最新版本优先；已归档主题跳过。基线目录已有其他实验残留，未读取实现，移至 .cache/preexisting-run-artifacts-20261016 保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 13 %（ChatGPT Plus 周额度）（11 个案例；批次 gpt-6-astra-max-2026-10-16；未记录单案例费用）
- [主页面](../../../../demos/youtube-ui/runs/gpt-6-astra-max-r01/index.html)
- [视频播放](../../../../demos/youtube-ui/runs/gpt-6-astra-max-r01/watch.html)
- [发现与订阅](../../../../demos/youtube-ui/runs/gpt-6-astra-max-r01/explore.html)
- [个人中心](../../../../demos/youtube-ui/runs/gpt-6-astra-max-r01/profile.html)
- [创作中心](../../../../demos/youtube-ui/runs/gpt-6-astra-max-r01/studio.html)

### 部署适配记录

- 本轮按所选任务正文创建新实验，当前会话直接执行；首次实现保留为 evidence/first-pass.zip，后续修复均由本会话代理完成，无人工代码修改。
- 首次产物通过本轮针对性验收，未对核心实现追加修复。
- 从 experiment/gpt-6-astra-max-20261016 分支迁移到 main；保留原始实现、输入、首次产物、修复记录和验证报告。
- 迁移归档时于 2026-10-17 在 1440px 桌面视口补拍真实运行截图，并按案例截图评分规则 v2 逐图复核；截图、维度与依据保存在本实验记录。
- 本轮 11 个案例的订阅额度消耗与耗时由用户按批次提供，关联 billing batch gpt-6-astra-max-2026-10-16，不拆分为单案例。
- 2026-10-17 应用户要求按案例截图评分规则 v2 重新逐图评分；保留既有截图和输入，旧分、新分及逐项观察归档于 catalog/score-reviews/2026-10-17-gpt-6-astra-max-v2.json。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
