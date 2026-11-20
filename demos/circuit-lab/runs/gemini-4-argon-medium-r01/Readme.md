# 简化电路实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：纯静态单文件应用，直接在浏览器打开 `index.html`（支持 `file://` 和 HTTP 静态服务），零外部依赖，完全离线可用。
- **核心架构**：
  1. **节点分析法（Modified Nodal Analysis, MNA）**：使用并查集（Union-Find）将理想导线的连通端子合并为电路节点；为每个含理想电压源的连通分量选取参考接地节点，组装电导矩阵与独立电压源方程，采用带列主元的高斯消元法（Gaussian Elimination with Partial Pivoting）精确求解各节点电位与电压源支路电流。
  2. **异常电路检测**：在消元与图遍历阶段自动检测理想电压源直接短路、并联冲突电压源、奇异矩阵及开路悬浮节点，实时给出明确中文告警提示，杜绝 `NaN` 或伪造电流。
  3. **交互与移动端适配**：支持鼠标与 Touch 事件拖拽元件、点击/触摸端子连线、实时调节电压与电阻、开关切换、串联/并联/混合预设一键加载及重置，390px 移动端视口自适应无水平溢出。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：按 demos/circuit-lab/prompts/v1/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/circuit-lab/runs/gemini-4-argon-medium-r01/index.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
