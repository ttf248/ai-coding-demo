# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：纯静态单文件网页，直接打开 `index.html` 即可运行（支持 `file://` 与 HTTP），完全离线无外部依赖。
- **核心架构**：
  1. **WebGL 2D Navier-Stokes 求解器**：基于 GPU 帧缓冲乒乓渲染（Ping-Pong FBO）完整实现速度平流（Advection）、染料平流、外力与颜色注入（Splat）、散度计算（Divergence）、涡度约束（Vorticity Confinement）、雅可比压力泊松迭代（Jacobi Pressure Iteration）和无散速度场投影（Gradient Subtraction）。
  2. **兼容性与 GPU 资源管理**：自动检测 WebGL2 / WebGL1 及半浮点/浮点纹理扩展（`EXT_color_buffer_float` / `EXT_color_buffer_half_float`），不支持浮点渲染时自动回退至兼容编码或提供明确中文降级/报错提示；切换模拟分辨率或窗口大小时显式调用 `gl.deleteTexture` 与 `gl.deleteFramebuffer` 释放旧 GPU 资源。
  3. **交互与移动端适配**：支持多点触摸与鼠标拖动注入动量与色彩，支持自定义颜色或彩虹模式、注入力度、消散率、压力迭代次数、模拟网格分辨率调节，以及暂停/继续、清空、参数重置与 PNG 截图导出。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：按 demos/fluid-simulation/prompts/v1/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/gemini-4-argon-medium-r01/index.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
