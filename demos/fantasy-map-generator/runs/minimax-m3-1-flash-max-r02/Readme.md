# 奇幻地图生成器 · 种子地形与编辑

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- 地形由种子化值噪声 fBm + 域扭曲 + 岛屿遮罩生成，同种子同参数必定得到同一张地图。
- 河流按最陡下降方向（D8）计算流向并累积流量，洼地先用 Priority-Flood 填平，保证水流要么进入海洋要么汇入内陆湖泊，不会穿越山峰。
- 升高/降低/平滑三种笔刷可直接修改高度场，编辑后重新计算海岸线、河流与湖泊。
- 支持平移、缩放、滚轮缩放与双指捏合，城镇标签可显示/隐藏，PNG 导出包含完整地形、河流与城镇。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；单文件无外部依赖。
- 验证记录：
  - 同种子重复生成的指纹一致（2902588748），更换种子后指纹不同。
  - 默认地图同时包含陆地、河流与湖泊；笔刷操作确实改变了高度场并联动更新河流与海岸。
  - 缩放后屏幕坐标到网格坐标换算一致，真实指针绘制落在预期格子。
  - 导出的 PNG data URL 长度约 190KB，包含当前地图内容；390px 视口无横向溢出。
- 已知限制：
  - 城镇名由固定词表组合，重复度较高；PNG 导出为当前地图而非当前视图截图。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：完整任务正文，与 demos/fantasy-map-generator/prompts/v1/prompt.md 一致。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；单文件无外部依赖。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [奇幻地图生成器](../../../../demos/fantasy-map-generator/runs/minimax-m3-1-flash-max-r02/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/fantasy-map-generator/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
