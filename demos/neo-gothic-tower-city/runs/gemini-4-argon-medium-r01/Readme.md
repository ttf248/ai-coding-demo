# 新哥特式塔楼城市

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：纯静态单文件 3D 网页，直接打开 `index.html` 即可运行（支持 `file://` 与 HTTP），原生 WebGL 编写，不依赖任何外部 CDN 或模型资源，完全离线可用。
- **核心架构**：
  1. **原生 WebGL 3D 引擎与程序化新哥特建筑群**：基于自研 WebGL 着色器管线构建多层尖拱高塔、飞扶壁（Flying Buttresses）、尖顶塔冠（Spires）、玫瑰花窗发光材质与跨海石桥，按真实尺度比例布局于暗夜海湾礁石之上。
  2. **动态海浪与火焰灰烬粒子系统**：顶点/片元着色器实时计算Gerstner风格起伏海浪、塔楼倒影与月光高光；配合数千个火炬火焰与漂浮余烬（Embers）粒子系统，营造庄严神秘的暗黑新哥特氛围。
  3. **双模式漫游系统**：支持电影感自动轨道巡航（Cinematic Autopilot）与键盘 `WASD` + 鼠标自由飞行漫游（Free Roam），并提供时间氛围切换（血月幽夜 / 深海迷雾 / 破晓微光）及粒子浓度控制。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：按 demos/neo-gothic-tower-city/prompts/v1/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/neo-gothic-tower-city/runs/gemini-4-argon-medium-r01/index.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 原始 WebGL 片元着色器的 floatfluting 声明无法编译。维护者补入一个空格（float fluting），使预览可渲染。保留修复前的桌面及手机截图、错误日志和补拍来源链。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
