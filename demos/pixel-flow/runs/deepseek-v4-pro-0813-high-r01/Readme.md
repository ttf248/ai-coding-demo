# Pixel Flow

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/pixel-flow/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`，需联网加载 Three.js（importmap）、MediaPipe Tasks Vision 与手部关键点模型；摄像头需 HTTPS 或 localhost。无摄像头时自动回退为鼠标拖拽还原。
- 实现：Canvas 提取上传图片像素，转换为带顶点颜色的 Three.js 粒子（每个粒子存储原始位置与颜色），初始随机飘散；MediaPipe Hands 实时追踪手掌，张开手掌形成吸引区域将粒子还原为原图、握拳暂停，动画平滑；提供上传、启用摄像头、重新打散控件。
- 说明：完整原始输入包含中英双语提示词正文，本实验以中文部分为准执行，未删改任务正文。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。摄像头需 HTTPS 或 localhost，无摄像头时自动回退为鼠标。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/pixel-flow/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
