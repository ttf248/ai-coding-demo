# Pixel Flow

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

这是一个 Vanilla JS + Three.js 的粒子还原实验。用户上传图片后，Canvas 以采样率提取像素，粒子先随机散开；鼠标/触控可作为无摄像头 fallback，摄像头开启后尝试加载 MediaPipe Hands，并将张开手掌、握拳、捏合映射到吸引、暂停和加速状态。

入口为 `index.html`。Three.js 与 MediaPipe 使用 CDN，需要联网；摄像头只在用户主动点击后请求权限，未授权时不影响鼠标演示。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-5-6-luna-max-r01`
- 模型：GPT-5.6 Luna；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整输入记录为提示词 v1 原文；未附加系统提示、图片或多轮输入。
- 工具：Codex。按用户指定记录模型 gpt-5.6-luna 与 max 档位；Three.js 与 MediaPipe 使用 CDN，需要联网及摄像头权限。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [Pixel Flow](../../../../demos/pixel-flow/runs/gpt-5-6-luna-max-r01/index.html)

### 部署适配记录

- 首次实现，不覆盖基线提示词或既有实验。
- 提供无摄像头时可用的鼠标/触控 fallback，并将张开手掌、握拳和完成动作映射到状态面板。
- 粒子源使用上传图片的 Canvas 像素采样，不固化任何外部图片。
<!-- archive:end -->
