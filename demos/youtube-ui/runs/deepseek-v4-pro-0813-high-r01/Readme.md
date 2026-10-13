# YouTube UI 模块

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/youtube-ui/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`，需联网加载 Tailwind CDN、Lucide Static CDN 图标与 Unsplash 图片。
- 实现：将复杂 YouTube 产品拆为首页、播放页、发现/Shorts、个人中心（媒体库）、创作中心 5 个功能模块，每个模块在一个浏览器 mockup 边框内横向排列，模块间相互独立。
- 规范：玻璃拟态与现代化质感、Tailwind（非内联 style）、Unsplash 图片、Lucide Static CDN 图标（`https://unpkg.com/lucide-static@latest/icons/XXX.svg`），界面无滚动条。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [完整参考图](../../../../demos/youtube-ui/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/youtube-ui/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
- 迁移验收备注：390px 视口下页面 scrollWidth 为 840px，存在横向溢出；保留原始模型产物，未作响应式改写。
<!-- archive:end -->
