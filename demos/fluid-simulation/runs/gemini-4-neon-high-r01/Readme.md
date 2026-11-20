# 彩色流体实验台 (Gemini 4 Neon)

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

纯离线单文件 `index.html`，自动检测 WebGL2 RGBA16F 与 WebGL1 HalfFloat 帧缓冲支持，不支持时展示清晰错误卡片而不白屏。支持桌面鼠标与移动端多点触摸拖动注入流体及 PNG 截图下载。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gemini-4-neon-high-r01`
- 模型：Gemini 4 Neon；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：基于 model-test-base 基线对应主题最高版本任务正文，在单会话批量实验请求下按原文直接执行。 本文件保留该案例任务正文，源目录未留存批量请求原文或完整会话上下文。
- 工具：agy v1.5.13。在 model-test-base 独立测试目录中由 Gemini 4 Neon (high) 直接实现，未查阅 main 分支或外部历史实现。 工具版本由用户提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-neon-high-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/gemini-4-neon-high-r01/index.html)

### 部署适配记录

- 从独立测试目录 ai-coding-demo-test 的 model-test-base 工作树导入；基线 452ac588，产物来自该基线上的未提交测试文件。保留原始输入与测试说明。
- 维护者为登记的网页入口接入公共访问统计。
- 源测试目录无截图。维护者在 main 采集桌面和手机证据并逐帧按 v3 复核，登记真实桌面封面。
<!-- archive:end -->
