# Pixel Flow · GPT 5.6 Luna Max

## 重做说明

历史记录只有任务正文、没有可运行预览。本轮按 v1 原文重新实现为一个单 HTML 实验：打开后先看到程序生成的 `LUNA` 目标图，可上传本地图片进行重新采样。

## 操作

- 拖入或选择图片，等待粒子目标更新。
- `Restore` 让粒子回到目标图，`Scatter` 重新打散；鼠标/触控移动会形成局部力场。
- 可选启用摄像头。张开手掌激活还原，握拳暂停吸引；没有授权、模型 CDN 或 WebGL 时，鼠标操作仍可用。

实现使用 Three.js `Points`、Canvas 像素采样和 MediaPipe Hands 的渐进式加载，没有伪造“摄像头已连接”的状态。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-5-6-luna-max-r01`
- 模型：GPT 5.6 Luna；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整保留中英文双语任务正文；未补造原历史运行上下文。
- 工具：Codex。新增实际可运行的单 HTML 实验；摄像头功能需要浏览器授权与 HTTPS/localhost。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [粒子实验](../../../../demos/pixel-flow/runs/gpt-5-6-luna-max-r01/index.html)

### 部署适配记录

- 将历史提示词从无预览记录落实为可直接打开的 Three.js 粒子实验。
- 加入本地图片采样、随机散开/还原、指针力场、速度和粒子密度控制。
- MediaPipe Hands 作为渐进增强；加载失败或无摄像头时保留鼠标/触控操作。
<!-- archive:end -->
