# 奇幻地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：纯静态单文件网页，直接打开 `index.html` 即可运行（支持 `file://` 与 HTTP），无任何外部 CDN 依赖。
- **核心架构**：
  1. **确定性伪随机与分形噪声**：基于 Mulberry32 种子随机数生成器与多层 2D Simplex/Value Fractal Noise（FBM），保证相同种子与海平面、粗糙度参数下生成的高度图、湿润度、河流与城镇分布 100% 一致。
  2. **水文与地形联动系统**：基于高度图梯度最速下降法（Steepest Descent）自动生成从高海拔山麓流向海洋或内陆湖泊的河流路径，绝不逆流或翻越山峰；使用画笔升高或降低地形时，实时重算高度场、海岸线轮廓与河流水系。
  3. **手绘羊皮纸视觉与视图交互**：支持鼠标/单指拖拽平移与滚轮/按钮缩放，视图变换矩阵逆向映射确保缩放和平移后画笔落点坐标精准无误；支持城镇名称开关与一键 PNG 导出。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：按 demos/fantasy-map-generator/prompts/v1/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/fantasy-map-generator/runs/gemini-4-argon-medium-r01/index.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
