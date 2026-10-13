# 生活情绪日记

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/life-diary/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`（按提示词要求命名），需联网加载 Tailwind CDN、FontAwesome 与 Unsplash 图片。
- 实现：以产品经理 + 设计师视角规划「沧河」AI 情绪日记与生活助手 App，输出 7 屏完整 UI/UX：启动、引导、首页（情绪打卡 + AI 洞察 + 生活片段）、情绪记录、日记时间线、情绪回顾统计、AI 助手对话。
- 规格：iPhone 375px 宽度基准，移动端交互习惯；Tailwind 完成样式（非内联 style），图片使用 Unsplash，图标使用 FontAwesome。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [完整原型](../../../../demos/life-diary/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/life-diary/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 目录规范适配：将原始入口 canghe_app_prototype.html 标准化为 index.html，页面内容未改写。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
- 目录规范适配：将原始入口 canghe_app_prototype.html 标准化为 index.html，页面内容未改写。
<!-- archive:end -->
