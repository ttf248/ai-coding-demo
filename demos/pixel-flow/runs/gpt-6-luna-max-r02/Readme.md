# Pixel Flow · 图片粒子化与手势还原

选择本地图片后，Canvas 对像素采样并生成带颜色的 Three.js 粒子；可用按钮还原/散开，也可授权摄像头，用张开手掌还原、握拳散开。默认使用程序生成的渐变山景作为初始画面。

通过 `localhost` 或 HTTPS 打开 `index.html` 后摄像头权限才可用。Three.js、MediaPipe Hands 模型与 Camera Utils 使用 CDN，需联网。图片像素与视频帧仅在本地浏览器处理中。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-6-luna-max-r02`
- 模型：GPT-6 Luna；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：提示词 v1 中英文原文完整快照；未附加历史对话上下文。
- 工具：Codex 当前会话。按用户指定记录为 gpt-6-luna / max；本轮未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [图片粒子手势实验](../../../../demos/pixel-flow/runs/gpt-6-luna-max-r02/index.html)

### 部署适配记录

- 从独立模型测试分支导入本轮实现，作为新的实验记录，保留本轮原始输入和产物。
- 归档来源：model-test-base 分支 demos/pixel-flow/runs/gpt-6-luna-max-r01；此前归档已有旧 r01，因此本轮保存为 gpt-6-luna-max-r02。
<!-- archive:end -->
