# 光屿 · 视频平台模块原型

## 原始输入

[完整输入快照](prompt.md) · [共享任务正文 v1](../../prompts/v1/prompt.md)

## 运行与操作

打开 `index.html` 体验发现与搜索。`watch.html` 和 `library.html` 分别展示播放与讨论、媒体库。Tailwind 与 Lucide CDN 及 Unsplash 图片需要联网，短片存放在 `clips/`。

搜索或筛选短片，在播放页播放、保存、关注作者和发布示例评论。媒体库可打开稍后播放、观看历史和关注作者。已选状态保存在本地浏览器。

## 实现与复盘

每个功能单独一个 HTML，并在其中横向排布独立的手机界面。窄屏切换为单列。四段本地短片由 Unsplash 样图裁切和缩放生成。

任务正文未给出具体的视频产品功能。本轮按主题做成原创的光屿界面，用仓库静态预览展示发现、播放与媒体库三个模块。[Unsplash 素材许可](https://unsplash.com/license)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gpt-6-2-sol-max-r01`
- 模型：GPT-6.2-Sol；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：留存仓库用户指令、批量请求原文与本主题的原始任务正文。共享会话还包含其他主题以及平台和工具上下文。
- 工具：Codex。用户指定 GPT-6.2-Sol / max，在同一会话中执行 11 个参与主题。Windows、Node.js 22.16.0。实现在本地基线测试目录中生成。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $3.40 USD（11 个案例；批次 gpt-6-2-sol-max-codex-plus-2026-11-18；未记录单案例费用）
- [发现与搜索](../../../../demos/youtube-ui/runs/gpt-6-2-sol-max-r01/index.html)
- [播放与讨论](../../../../demos/youtube-ui/runs/gpt-6-2-sol-max-r01/watch.html)
- [媒体库](../../../../demos/youtube-ui/runs/gpt-6-2-sol-max-r01/library.html)

### 部署适配记录

- 根据主题定义片单、播放、搜索和关注功能，采用原创光屿界面。
- 按批量请求连续完成三个模块，并使用仓库静态预览展示。
- 本地预览为 MP4 提供媒体类型和字节范围响应。
- 迁入自 experiment/gpt-6-2-sol-max 的 ef8d75d7，保留原始输入、素材和实现。
- 维护者为登记的 HTML 入口补充公共访问统计引用。
- 源分支无截图，维护者在 main 采集真实桌面及手机画面，由 Codex 逐帧按 v3 复核。
- 同步测试分支的 MP4 本地预览支持，适配 main 静态服务器的媒体类型与字节范围响应。
<!-- archive:end -->
