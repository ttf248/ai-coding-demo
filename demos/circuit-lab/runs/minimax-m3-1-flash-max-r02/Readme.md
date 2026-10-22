# 简化电路实验台 · 直流求解版

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- 求解核心是改进节点法（MNA）：节点电压 + 理想电压源支路电流为未知量，电阻/灯泡按电导印记，开关闭合按 0V 电压源处理，用带部分主元选取的高斯-约当消元求解并检测奇异性。
- 异常场景显式处理：电源短路、两个电压不同的理想电源并联（冲突）、相同电压并联（无唯一解）、无电源、悬空节点，均给出中文提示而不是 NaN 或伪造电流。
- 元件可拖动、删除、编辑电压与阻值，端子之间拖拽连线；移动元件保留连接，删除元件自动清除相关连线。
- 灯泡亮度按耗散功率线性映射，界面注明为固定电阻的简化模型。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；单文件无外部依赖，file:// 与 HTTP 均可运行。
- 验证记录：
  - 12V 电源 + 100Ω + 200Ω 串联时总电流为 0.04A，两支路电流均为 0.04A。
  - 同样两个电阻并联时支路电流分别为 0.12A 与 0.06A，总电流 0.18A。
  - 断开开关后相关支路电流为 0；移动元件后连接与电流保持不变；删除元件后相关连线被清除。
  - 制造短路时给出明确提示；从端子拖拽可成功建立导线；390px 视口无横向溢出。
- 已知限制：
  - 仅建模理想直流电阻网络，不含交流、电容、电感与半导体；元件不支持旋转与折线走线。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：完整任务正文，与 demos/circuit-lab/prompts/v1/prompt.md 一致。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；单文件无外部依赖，file:// 与 HTTP 均可运行。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [电路实验台](../../../../demos/circuit-lab/runs/minimax-m3-1-flash-max-r02/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/circuit-lab/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
