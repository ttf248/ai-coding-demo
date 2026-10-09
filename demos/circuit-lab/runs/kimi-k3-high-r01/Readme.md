# 简化电路实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：纯静态单文件，file:// 直接打开或 HTTP 静态托管均可，无网络依赖。
- 入口：[index.html](index.html)
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 验证记录：
  - 串联预设 12V + 100Ω + 200Ω，求解电流 0.04A ✓
  - 并联预设支路电流 0.12A / 0.06A，电源总电流 0.18A ✓
  - 开关断开时相关支路电流为零 ✓
  - 电池两端被导线直连时报“电源短路” ✓
  - 12V 与 9V 理想电源并联时报“无唯一解”，不输出 NaN ✓
  - 移动元件保留连线，删除元件清除相关连线 ✓
- 复盘：一次生成完成，未做追加修复。求解器为改进节点分析（MNA），闭合开关按 0V 电压源建模以求取支路电流；未接入电池回路的元件显示“未接入回路”，不参与求解。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：完整输入即主题任务正文 v1，无附加上下文。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $5.05 USD（11 个案例；原始消耗 883 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-kimi-k3-high-2026-10-09；未记录单案例费用）
- [电路实验台](../../../../demos/circuit-lab/runs/kimi-k3-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
