# 图片粒子化与手势还原 Web 应用（Qwen3.8 Max · xhigh）

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文版本 [v1](../../prompts/v1/prompt.md)（中英双版本提示词）。

## 批次记录

Aliyun 批次合计 91.81 CNY，覆盖 11 个案例，耗时 2h 50m 7s；费用及耗时均为批次总计，不拆分为单案例。

## 运行方式

- 入口为本目录 `index.html`；需联网加载 Three.js r160（unpkg importmap）与 MediaPipe Hands（jsdelivr，含模型文件）。
- 默认载入内置示例图（代码生成，无外部图片依赖）；也可上传本地图片；采样密度三档、还原力度滑块、重新飘散、鼠标力场开关。
- 手势：摄像头画面 + MediaPipe Hands 关键点 → 张开手掌（指尖/掌根距离比）激活还原力场，握拳暂停；手掌位置为力场中心，力场内粒子 3.2 倍加速；摄像头预览窗叠加手部骨架。
- 降级：`getUserMedia` 失败、MediaPipe 加载失败或 iframe 无摄像头授权时自动切换鼠标 / 触摸力场（按住画布 = 激活还原），状态栏明确说明原因。

## 验证记录

2026-10-14 Playwright（Chromium headless）冒烟测试：

- 内置示例图粒子化 6 千+ 采样点；按住画布激活还原力场后收敛度从 ~0 升到 >0.5（弹簧-阻尼物理真实收敛，非固定动画）；松开关闭、重新飘散归零。
- 上传自定义 PNG 后粒子数变化；采样密度调粗粒子数减少（按当前图片重建）。
- 无摄像头环境自动降级并给出原因文案；以 `--use-fake-device-for-media-stream` 假摄像头启动时成功进入相机模式、预览窗显示、手势状态文案更新、无 JS 报错（MediaPipe 模型自 jsdelivr 加载成功）。
- 390px 无水平溢出；触摸按住同样激活还原力场；桌面 / 移动端均无 JS 报错。

## 复盘

- 还原力场为每粒子弹簧-阻尼积分：激活时向原图位置施加速度项并强阻尼，未激活时保留卷曲漂移流场，因此「飘散」与「还原」是同一物理系统的两种状态，切换无跳变。
- 手势判定用五指尖到腕部距离均值 / 掌长 的比值（>1.55 判为张开），比单关键点距离更稳；力场半径内粒子加速实现「手掠过即复原」的交互直觉。
- MediaPipe 与摄像头都可能不可用（headless、iframe 权限、用户拒绝），降级模式不是补丁而是主路径之一：状态栏始终说明当前模式与原因，符合任务「加载指示器 / 状态消息」要求。
- 粒子用单个 THREE.Points + 顶点色 + 加色混合，4 万粒子上限下单 draw call；像素提取限制采样宽 ≤480 控制粒子规模。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--qwen3-8-max-xhigh-r01`
- 模型：Qwen 3.8 Max；推理档位：xhigh
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：prompt.md 保留用户会话指令与任务正文原文（中英双版本提示词）；Claude Code 系统提示与仓库 AGENTS.md 项目说明同时生效，系统提示未留存于快照。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型与档位由用户指定为 qwen3.8-max / xhigh，与会话自报一致。Three.js 走 unpkg importmap、MediaPipe Hands 走 jsdelivr（含模型文件）。headless 无摄像头环境验证降级链路；--use-fake-device-for-media-stream 假摄像头验证 MediaPipe 初始化与手势状态链路。对比页 iframe 不授予摄像头权限，故降级模式为必需设计。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 91.81 CNY（11 个案例；批次 qwen3-8-max-xhigh-2026-10-14；未记录单案例费用）
- [Pixel Flow 粒子还原](../../../../demos/pixel-flow/runs/qwen3-8-max-xhigh-r01/index.html)

### 部署适配记录

- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
