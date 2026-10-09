# 图片粒子化与手势还原 · Web 应用

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

运行：直接打开本目录 `index.html`，或通过 HTTP 访问（摄像头需要授权与安全上下文，localhost 或 HTTPS 均可）。

验证：无头 Chromium（假摄像头）自动化 5 项检查：示例粒子加载；上传本地图片后重新生成粒子；开启摄像头并加载 MediaPipe 手部模型；统计信息随状态刷新；无页面错误。

复盘：真实手势识别未在真人手上验证，手势阈值为经验值；嵌入页面（iframe）不授予摄像头权限，因此登记为独立打开。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--claude-haiku-5-5-max-r01`
- 模型：Claude Haiku 5.5；推理档位：max
- 类型：app；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：prompt.md 为任务正文原文，与 prompts 版本字节一致；会话系统上下文与工具设定未随记录留存，记为 partial。
- 工具：Copilot SDK（VS Code 当前会话）。模型 claude-haiku-5-5、档位 max 由用户指定；会话内无法核验运行时实际配置（本地用量表无记录）。直接在当前会话完成，未委派子代理，未另建克隆；结果未提交、未推送。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [粒子还原](../../../../demos/pixel-flow/runs/claude-haiku-5-5-max-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
