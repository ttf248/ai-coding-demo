# Pixel Flow · GPT 6 Luna Max

## 本轮实现

单页图片粒子化与手势还原工具。支持本地图片上传、采样密度调整、粒子散开和还原；可请求摄像头并通过开掌还原、握拳暂停，也提供手动控制。

## 运行与验证

浏览器直接打开 `index.html`。Three.js 和 MediaPipe 使用 CDN，需要联网；摄像头需授权，设备或 CDN 不可用时显示状态提示。目标模型通过 Codex CLI 的 `gpt-6-luna`、`max` 档位执行；内联 JavaScript、DOM ID 引用、重复 ID 和空白检查通过。

原始任务：[prompt.md](prompt.md)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-6-luna-max-r01`
- 模型：GPT 6 Luna；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整保留主题 v1 中英文任务提示词；摄像头需用户在运行时授权。
- 工具：Codex CLI。通过 --model gpt-6-luna 与 model_reasoning_effort=max 执行；CLI 完成并返回代码，具体平台上下文未随实验导出。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/pixel-flow/runs/gpt-6-luna-max-r01/index.html)

### 部署适配记录

- 基于主题 v1 新建图片粒子化与手势还原单文件应用，保留原提示词归档。
- 加入本地图片上传与采样、粒子散开/还原、MediaPipe 开掌与握拳识别及手动控制。
- 摄像头权限和外部库不可用时显示状态说明；Three.js/MediaPipe CDN 需要联网。
<!-- archive:end -->
