# 简化电路实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `index.html`，可 file:// 直接打开，无 CDN。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- 电路求解使用修正节点分析：并联 12V、100Ω、200Ω 支路电流 0.12A/0.06A；闭合开关建模为 0V 电压源，因此其电流可显示。
- 电源两端经导线/闭合开关直接连通时判定“电源短路”；其余奇异矩阵（如并联不同电压电池）判定“无唯一解”，均不输出 NaN。
- 灯泡固定 50Ω，亮度 = min(1, P/1W)，页面中注明为简化模型。

**已知局限与未验证项**

- 同一元件两端不能直接连导线（给出提示）。
- 连线为直线，未做正交布线；仅做桌面自动化验证，触摸为基于 Pointer Events 的实现。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright（桌面 Chromium）调用页面内求解器：串联 12V/100Ω/200Ω 电流 0.04A；并联支路 0.12A/0.06A，总电流 0.18A；断开开关后相关电流为 0；电源直接短路与冲突电源分别给出提示。 鼠标拖动端子连线与“先点后点”两种连线方式均可创建导线；390px 视口无水平溢出；无控制台错误。 未在真实触摸设备上验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Anthropic 批次合计 $0.60 USD（11 个案例；原始消耗 3 percent，换算比例 20 USD / 100 percent；批次 claude-sonnet-5-5-medium-r01；未记录单案例费用）
- [主页面](../../../../demos/circuit-lab/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

- 从 F:\dev\ai-coding-demo-test 的 experiment/claude-sonnet-5-5-medium-r01（a7e690a3c5696ecd6a1c4532dd170308e2169401）迁入当前 main；保留实验产物、原始输入和源分支已记录的验证结果。
- 2026-10-12: 在当前 main 的本地 HTTP 预览中，以 Chromium 1440×1000 补拍实际运行桌面图 preview-2026-10-12.png；实验源码和原始输入未修改。
<!-- archive:end -->
