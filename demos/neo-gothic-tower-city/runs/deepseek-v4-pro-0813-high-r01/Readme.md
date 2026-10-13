# 新哥特式塔楼城市

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/neo-gothic-tower-city/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`，需联网加载 Three.js（importmap 指向 unpkg CDN），运行时通过 HTTP 或本地静态服务器打开。
- 实现：程序化生成新哥特式塔楼城市——中央大教堂（玫瑰窗）、尖塔、飞扶壁、发光窗、街灯、环绕海面（逐顶点波浪动画）、火焰余烬粒子与星空；摄像机支持拖动环视、滚轮缩放与自动缓慢环绕。
- 说明：几何体、材质均为代码生成，未引用外部模型与贴图；提示词中"真实比例"按艺术化比例还原，未遇到库或环境缺漏（无需"待确认"标记）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/neo-gothic-tower-city/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/neo-gothic-tower-city/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
<!-- archive:end -->
