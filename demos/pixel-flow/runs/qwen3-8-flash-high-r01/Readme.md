# 图片粒子化手势还原应用

## 原始提示词

见 [完整原始输入](prompt.md)（主题任务正文 v1 逐字快照）。本轮批量触发语：“所有的案例 demo 全部都做一遍，模型名称 qwen3.8-flash 档位 high, 用当前会话就好了”。当前会话按 topics:active 清单直接执行。

## 批次记录

Aliyun 批次共 11 个案例，合计 3.6 CNY，耗时 1h 18m 26s；费用和耗时均为批次总计，不拆分为单案例。

## 运行与复盘

- 运行方式：本目录 index.html 双击可开但摄像头手势需 https/localhost（浏览器安全上下文限制），推荐经站点静态服务器或 Pages 打开并允许摄像头。依赖 three.js r128 与 MediaPipe Hands CDN，不可标记离线；摄像头另需用户授权。
- 实现要点：上传图像 → Canvas getImageData 按可调采样率抽像素 → 自定义着色器 THREE.Points（顶点色 + 圆点衰减）记录目标位置/颜色，初始随机球状散布并受正弦流场漂浮；MediaPipe Hands 单手游迹：掌根 landmark9 映射力场中心（镜像修正），四指尖到腕平均距离/掌宽判定张开（吸附）/握拳（暂停），力场内粒子以可调速率向目标缓动，还原进度=到位比例实时显示；散开/强制还原按钮、半径与速度滑杆、视频 PiP 与手势状态大字反馈。无摄像头/拒绝授权/模型加载失败时自动降级“鼠标与触摸力场”模式并提示，页面不空白。
- 验证（headless Chromium file://）：粒子系统初始化 2400 颗（演示图）、正确进入兜底模式提示（非安全上下文拒摄像头）、无致命错误。MediaPipe 真实手势回路需 https + 摄像头人工复测（本会话无法执行，不谎报）。
- 与任务差异：手势阈值按几何比值归一化自适应手距；Tween 库未引入，缓动在动画循环内实现，效果等价。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--qwen3-8-flash-high-r01`
- 模型：Qwen 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：当前会话直接执行主题任务正文 v1，完整原始输入为该正文的逐字快照，未附加其他材料；批量触发语记录于本 run 的 Readme。
- 工具：Claude Code CLI（当前会话）。模型名称与档位按用户给定登记（qwen3.8-flash / high）；Windows 11 + Node 22，当前会话生成并自检，未委派子代理；实现过程中的自我修正记录于 changes 与 Readme。 迁移到 main 时，按用户确认将测试分支误记的档位从 default 更正为 high。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 3.6 CNY（11 个案例；批次 qwen3-8-flash-high-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/qwen3-8-flash-high-r01/index.html)

### 部署适配记录

- 增加兜底：非 https/localhost 或权限拒绝时切换鼠标/触摸力场模式并给出明确提示（MediaPipe 手势路径需 https 环境实测）。
- 内置演示图，便于无上传环境验证完整粒子→还原流程。
- 迁移时根据用户确认将误记的 default 档位纠正为 high，并同步更正实验 ID 与路径。
<!-- archive:end -->
