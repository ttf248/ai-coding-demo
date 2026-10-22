# Pixel Flow

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行方式

- 单文件入口 `index.html`，浏览器直接打开或经本地静态服务器访问；摄像头功能需 `https`/`localhost` 或本机授权，`file://` 下可自动降级鼠标模式。
- 网络：`required`（Three.js r160 与 MediaPipe Hands 走 CDN，模型文件运行时按版本路径加载）。

## 实现要点

- 图片（上传或代码生成示例图）按采样步长拆成粒子，散射态为流动漂移。
- MediaPipe Hands 识别手势：张开手掌（力场吸引还原，场随掌心移动）、握拳（暂停）、食指+中指（完全还原）；识别过程叠加手部骨架层。
- 摄像头被拒绝或 Hands 加载失败时提示并切换鼠标模式（按住移动驱动力场），右侧按钮可模拟三种手势；含还原度进度条与粒子数/半径控制。

## 验收记录

- 工具：Playwright（Chromium，`--use-angle=swiftshader --use-fake-device-for-media-stream --use-fake-ui-for-media-stream`，`check-pixelflow` 临时脚本未入库）。
- 通过项：启动 10,800 粒子、MediaPipe Hands 库加载、鼠标按住进入 `open` 且还原度 0.25→0.45 上升、松开进入 `fist` 暂停、`done` 还原到 ≈1、重置回 `scatter`、手势分类器 open/fist/peace 三种合成关键点全部正确、UI 元素齐备、假摄像头开启后 `cameraOn=true`、390px 无横向溢出、无控制台错误。

## 人工适配与变更

见 run.json `changes`：CDN 与摄像头不可用时的完整降级路径（提示词要求"不引用外部资源"与其自身 Three.js/MediaPipe CDN 要求冲突，按 CDN 实现登记 `required`）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--mimo-v2-6-flash-free-max-r01`
- 模型：MiMo-V2.6-Flash Free；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整记录：与主题提示词原文一致，hash 为 BOM/换行规范化后的 SHA-256。 提示词版本 v1。
- 工具：OpenCode + Playwright 静态验收。实际执行模型 MiMo-V2.6-Flash Free，档位 max，在当前会话内直接执行（未委派子代理）。产物在本地用 Playwright 验收脚本回归，脚本存于系统临时目录、未入库。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenCode · 免费模型 订阅；单案例货币金额未记录。用户说明本次使用 OpenCode 免费模型，无付费费用；未提供可折算的货币金额，amount 保持 null。
- [预览首页](../../../../demos/pixel-flow/runs/mimo-v2-6-flash-free-max-r01/index.html)

### 部署适配记录

- MediaPipe 模型与 Three.js 走 CDN，摄像头被拒绝或 Hands 加载失败时自动切换鼠标模式，保留完整降级提示。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/mimo-v26-flash-free）/demos/pixel-flow/runs/mimo-v2-6-flash-free-max-r01；保留源测试轮号 r01，原始输入指纹与 main 的 vv1 提示词一致。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
