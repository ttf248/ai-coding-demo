# 手势粒子还原 · 首轮

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1 原文快照）。

## 运行与复盘

- 运行方式：DeepSeek-V4.1-Flash-0731（档位 max）在 Claude Code 当前会话直接生成；未使用子代理、未提供后续追问。
- 产物入口：[index.html](index.html)（单文件；three.js 与 MediaPipe 经 CDN 加载；摄像头为可选输入）。
- 验证记录（Playwright，HTTP 与 file:// 双路径；Chromium 虚拟摄像头）：
  - 首屏装载示例图案粒子 14856 个（three.js r160 CDN）
  - 上传本地图片后重建粒子 16950 个，目标包围盒构成图片形状
  - 摄像头开启并输出视频帧（videoWidth=640）；MediaPipe Hands 就绪
  - 手势分类：合成关键点验证“张开手掌/握拳”识别逻辑正确
  - 指针力场拖动使还原度 0% → 74.2%；一键完全还原达到 100%；重新散开回 0%
  - 390px 拖动力场可用、无水平溢出；file:// 正常生成粒子
- 备注：无摄像头或手势库不可用时，提供指针/触摸力场作为回退（界面明示），手势路径本身保持真实实现。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--deepseek-v4-1-flash-0731-max-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：任务正文 v1 原文。单次输入，未附后续追问或其他上下文。
- 工具：Claude Code 2.1.295。用户指定模型 DeepSeek-V4.1-Flash-0731、档位 max；当前会话直接生成，未使用子代理；Windows 11 / Node v22.16.0。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.78 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-max-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/deepseek-v4-1-flash-0731-max-r01/index.html)

### 部署适配记录

- three.js 与 MediaPipe 经 CDN 加载，需联网；摄像头为可选输入。
- 无摄像头环境提供指针/触摸力场回退（界面明示）。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/pixel-flow/runs/deepseek-v4-1-flash-max-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 打开实际入口并补拍桌面截图；390px 检查无页面横向溢出，Playwright 控制台无页面错误。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
<!-- archive:end -->
