# Pixel Flow · 图片粒子化与手势还原

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：单文件 HTML 应用，直接打开 `index.html` 即可运行（使用 Three.js 与 MediaPipe Hands CDN，支持真实摄像头手势识别；在无摄像头或离线环境下自动启用鼠标/触摸虚拟手势模拟力场，确保任何环境均可完整体验）。
- **核心架构**：
  1. **图像采样与 Three.js 粒子流引擎**：支持上传任意本地图片或一键切换内置高对比度艺术预设图，通过 Canvas 2D 提取像素颜色与坐标，转换为带自定义 `ShaderMaterial` 的 `THREE.Points` 3D 粒子系统，初始呈现基于漩涡噪声的动态飘散粒子流。
  2. **MediaPipe Hands 实时手势追踪与虚拟手势双擎**：集成 `@mediapipe/hands` 实时提取 21 个手部 3D 关键点并绘制骨骼叠加层，根据手指伸展度识别**张开手掌（局部力场吸引还原）**、**OK/捏合手势（全局加速完整还原）**与**握拳（排斥打散/暂停还原）**；同时提供无缝的鼠标/触摸虚拟手势模式。
  3. **平滑物理力场与参数控制**：支持实时调节像素采样步长、粒子大小、力场吸引半径与还原阻尼速度，实时展示粒子还原进度百分比。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：按 demos/pixel-flow/prompts/v1/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/gemini-4-argon-medium-r01/index.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
