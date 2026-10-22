# 简化电路实验台

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/circuit-lab/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`，浏览器直接打开或静态托管均可运行，无外部依赖。
- 实现：Canvas 网格画布上放置电池、电阻、开关、灯泡，点击端子间连线（可点击网格转角）；同一连通导线归并为电路节点（并查集），用改进节点法（MNA）+ 高斯消元求解直流电路，显示各元件电压、电流与方向。
- 模型约定：电池为理想电压源、电阻与灯泡按固定电阻建模、开关为理想导线/断路、导线为理想导线。
- 验证：12V 与 100Ω、200Ω 串联电流 0.04A；并联支路电流 0.12A、0.06A、总电流 0.18A；断开开关后相关支路电流为零；移动元件保留连接；删除元件清除相关连线；电源短路与无唯一解给出明确提示；触摸端子可完成连线。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/circuit-lab/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/circuit-lab/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
