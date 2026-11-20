# 手绘奇幻岛屿地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)，对应共用任务正文 [v1](../../prompts/v1/prompt.md)。

## 实现与功能说明

- 确定性种子：采用 FNV-1a 哈希与 Mulberry32 PRNG 生成地形噪声，同一种子与海平面/粗糙度参数严格产出一致地图。
- 水文河网：采用 Priority-Flood 洼地填平计算汇流方向，确保河流沿地势下降汇入海洋或内陆湖泊，不翻越山峰。
- 交互编辑：支持平移、滚轮/按钮缩放、升高/降低地形画笔在缩放后世界坐标下实时重绘海岸线与河流，支持开关城镇标签与导出 PNG。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--gemini-4-hydrogen-xhigh-r01`
- 模型：Gemini 4 Hydrogen；推理档位：xhigh
- 执行模式：按原任务执行；备注：源提交按测试基线的共用任务正文在当前会话直接执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：按 fantasy-map-generator 任务正文 v1 原文在当前会话直接执行。 源提交的快照保留批次会话指令与本主题任务正文。
- 工具：agy v1.5.13。纯原生单 HTML 实现，无外部依赖，支持 file:// 与静态托管。 工具版本由用户提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-hydrogen-xhigh-agy-pro-2026-11-20；未记录单案例费用）
- [地图生成器](../../../../demos/fantasy-map-generator/runs/gemini-4-hydrogen-xhigh-r01/index.html)

### 部署适配记录

- 导入来源为独立测试目录 ai-coding-demo-test 的 experiment/gemini-4-hydrogen-xhigh 提交 d446209f3631a2109360d9e25d604654e75f79d4，保留其原始输入快照。
- 归档时为本仓库维护的 HTML 入口接入公共访问统计。
- 源提交没有真实截图。归档时采集桌面、手机及适用交互状态，逐帧按 v3 复核并登记真实桌面封面。
<!-- archive:end -->
