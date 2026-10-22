# 彩色流体实验台

## 原始输入

- 完整原始输入：[prompt.md](prompt.md)
- 任务正文版本：[v1](../../prompts/v1/prompt.md)。

## 实现说明

- 单文件离线页面，入口 [index.html](index.html)；WebGL2 + GLSL，无外部资源。
- 求解器：速度/染料双缓冲；每帧执行速度平流、涡量约束、散度、压力 Jacobi 迭代与速度投影，再对染料做半拉格朗日平流。
- 渲染目标：RGBA16F；启动检查 WebGL2、`EXT_color_buffer_float`/`EXT_color_buffer_half_float` 与 FBO 完整性，不支持时显示明确错误。
- 交互：拖动同时注入颜色与速度；颜色选择、注入力度、染料消散、压力迭代、模拟分辨率、暂停/继续、清空、重置参数、PNG 截图、演示染料。
- 分辨率切换会删除并重建纹理/FBO；画布设备像素比上限 1.75；染料纹理最多 768。
- 首次进入有短时间的自动演示注入，首次指针交互后停止；避免初始画布过于空。

## 验证记录

- Playwright 在无头 Chromium + SwiftShader 下：`supported: true`，128² 模拟/256² 染料，约 30–33 FPS；无控制台错误。
- 拖动后画布出现连续染料轨迹，速度场产生弯曲和卷动；截图可看到颜色混合。
- 暂停、清空、参数控件均连接到模拟状态；不支持 WebGL2 时会显示 fallback 文案。
- 390px 无页面水平溢出。

## 复盘

- 默认染料消散调为 0.18，并增强注入量，使拖动轨迹更持久；初始自动演示只在用户首次交互前运行。
- 压力/分辨率上限控制移动端负载；无头软件光栅器的帧率不代表硬件 GPU 表现。
- 截图依赖 `preserveDrawingBuffer: true`；在低端设备上会牺牲少量性能。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--deepseek-v4-1-flash-1017-max-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：包含用户会话指令与任务正文原文；任务正文未改写。 任务正文版本 v1。
- 工具：Claude Code / DeepSeek-V4.1-Flash-1017。当前 Claude Code 会话直接执行，未委派子代理；Windows 11 + Node 22.16.0；模型与档位由用户指定。使用本地 HTTP 静态服务器与 Playwright/Chromium（WebGL 软件光栅器）做加载、交互与 390px 溢出检查；软件光栅器帧率不代表硬件 GPU 表现。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 4.46 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-max-2026-10-19；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/deepseek-v4-1-flash-1017-max-r01/index.html)

### 部署适配记录

- 渲染目标统一使用 RGBA16F，启动时检查 WebGL2、浮点颜色缓冲和 FBO 完整性；不支持时显示明确错误而非空白。
- 分辨率切换会释放旧纹理与 FBO 并重建；指针拖动同时注入速度与染料；截图使用 preserveDrawingBuffer。
- 自查修复：默认染料消散 0.18、提高注入强度与染料半径；首次指针交互前提供 10 秒自动演示注入，之后停止。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017 分支未提交工作区导入本轮 max 档结果；基线提交 452ac58，文件来源指纹见 docs/imports/2026-10-19-deepseek-1017-max.json；未覆盖历史实验。
- 迁移维护者为全部 HTML 入口添加带 defer 的公共 assets/analytics.js 引用；小蓝书配置适配 previews 路径并重新构建。
- 源记录没有截图；迁移时补拍真实桌面页面并按当前 v2 规则逐图复核。费用 ¥4.46、92,462,698 Tokens 与耗时 59m 52s 为用户提供的整批 11 个案例合计，不拆分到单案例。
- 迁移补拍：Chromium 1440×960、deviceScaleFactor=1；点击演示注入多色染料，演化一秒后暂停，保留结果态。截图页面 index.html，远程统计请求被拦截；软件 WebGL 不作为硬件性能证据。
- 迁移补拍复核：清空后通过颜色控件分别选红、绿、蓝并实际拖动注入染料与动量，随后暂停；保留初次演示截图。Chromium 1440×960，拦截远程统计；按新截图重新评价。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
