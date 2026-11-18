# 息间 · 冥想 iOS 原型

## 原始输入

[完整输入快照](prompt.md) · [共享任务正文 v1](../../prompts/v1/prompt.md)

## 运行与操作

在浏览器中打开 `index.html`。Tailwind CSS、Unsplash 图片及 Lucide 图标需要联网。

发现页可切换课程，在详情页选时长或收藏。通过练习页开始、暂停和重置，在睡前页选择时长直接进入练习。练习完整结束后计入记录。

## 实现与复盘

五个移动界面在同一页。计时和呼吸阶段由实际经过时间驱动，环境音由浏览器 Web Audio 合成，点击开始后播放。

练习记录与收藏存于本地浏览器。环境音为程序生成的背景音。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--gpt-6-2-sol-max-r01`
- 模型：GPT-6.2-Sol；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：留存仓库用户指令、批量请求原文与本主题的原始任务正文。共享会话还包含其他主题以及平台和工具上下文。
- 工具：Codex。用户指定 GPT-6.2-Sol / max，在同一会话中执行 11 个参与主题。Windows、Node.js 22.16.0。实现在本地基线测试目录中生成。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $3.40 USD（11 个案例；批次 gpt-6-2-sol-max-codex-plus-2026-11-18；未记录单案例费用）
- [主页面](../../../../demos/meditation/runs/gpt-6-2-sol-max-r01/index.html)

### 部署适配记录

- 使用 Web Audio 合成环境音，并实现可交互的计时与本地练习记录。
- 迁入自 experiment/gpt-6-2-sol-max 的 ef8d75d7，保留原始输入、素材和实现。
- 维护者为登记的 HTML 入口补充公共访问统计引用。
- 源分支无截图，维护者在 main 采集真实桌面及手机画面，由 Codex 逐帧按 v3 复核。
<!-- archive:end -->
