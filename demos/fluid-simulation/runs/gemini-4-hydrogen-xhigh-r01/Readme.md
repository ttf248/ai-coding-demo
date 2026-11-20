# WebGL 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)，对应共用任务正文 [v1](../../prompts/v1/prompt.md)。

## 实现与功能说明

- 求解通道：在 GPU 浮点/半浮点双缓冲 FBO 上依次执行 `curl`、`vorticity`、`divergence`、`pressure`（Jacobi 迭代次数可调）、`gradientSubtract`（速度投影）及 `advection`（支持无硬件线性插值时的着色器双线性回退）。
- 交互与资源管理：限制 DPR 上限为 2，切换模拟分辨率或窗口大小变动时先销毁旧纹理与 FBO 再重建；支持颜色选择、自动彩虹、力度、消散、暂停/继续、清空、重置与 PNG 截图下载。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gemini-4-hydrogen-xhigh-r01`
- 模型：Gemini 4 Hydrogen；推理档位：xhigh
- 执行模式：按原任务执行；备注：源提交按测试基线的共用任务正文在当前会话直接执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：按 fluid-simulation 任务正文 v1 原文在当前会话直接执行。 源提交的快照保留批次会话指令与本主题任务正文。
- 工具：agy v1.5.13。纯原生单 HTML 实现，无外部依赖，内置 WebGL2/WebGL1 浮点纹理 FBO 检测与明确错误提示。 工具版本由用户提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-hydrogen-xhigh-agy-pro-2026-11-20；未记录单案例费用）
- [流体实验台](../../../../demos/fluid-simulation/runs/gemini-4-hydrogen-xhigh-r01/index.html)

### 部署适配记录

- 导入来源为独立测试目录 ai-coding-demo-test 的 experiment/gemini-4-hydrogen-xhigh 提交 d446209f3631a2109360d9e25d604654e75f79d4，保留其原始输入快照。
- 归档时为本仓库维护的 HTML 入口接入公共访问统计。
- 源提交没有真实截图。归档时采集桌面、手机及适用交互状态，逐帧按 v3 复核并登记真实桌面封面。
<!-- archive:end -->
