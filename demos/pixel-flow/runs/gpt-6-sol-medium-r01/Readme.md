# 图片粒子与手势还原

## 原始提示词

见 [完整原始输入](prompt.md)。本轮使用 v1 任务正文。

## 运行与复盘

以 HTTPS 或 localhost 静态服务器打开 `index.html`，上传图片后启动摄像头。张开手掌吸引粒子，握拳暂停；也可开启鼠标/触摸模式并按住拖动。Three.js 与 MediaPipe 从 CDN 加载。`file://` 可以查看界面，但摄像头权限和跨源模块可能受浏览器限制。

模型名称和档位由用户指定为 gpt-6-sol / medium；工具是当前 Codex 会话。运行环境未提供可独立核验的模型标识。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-6-sol-medium-r01`
- 模型：GPT 6 Sol；推理档位：medium
- 类型：app；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：本轮按存档任务正文原文执行。 本轮由用户统一指定全部主题、模型名 gpt-6-sol、medium 档位及当前会话执行。
- 工具：Codex 当前会话。用户指定模型名称 gpt-6-sol、档位 medium；运行环境未提供可独立核验的模型标识。未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [预览](../../../../demos/pixel-flow/runs/gpt-6-sol-medium-r01/index.html)

### 部署适配记录

- 首次生成，无人工修改历史产物。
- 摄像头需 HTTPS 或 localhost，Three.js 与 MediaPipe 从 CDN 加载。
<!-- archive:end -->
