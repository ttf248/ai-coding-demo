# 简化电路实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。无需网络连接或外部依赖，支持直接双击 `file://` 或静态 HTTP 托管运行。

核心实现：
1. **元件建模与交互**：提供理想直流电池（电压可调）、线性电阻（阻值可调）、灯泡（固定电阻发光模型）与单刀开关。元件支持自由拖拽并实时跟随连线；点击端子支持移动端触摸或鼠标轻松连线。
2. **精确直流求解**：将理想导线与闭合开关连通的端子归并为电路节点，构建改进节点分析法（MNA）方程组，求解各支路真实电压与电流。
3. **短路与异常保护**：自动识别电池两端零电阻直连闭环，触发短路安全警告并不输出错误 NaN；支持并联冲突检测。
4. **验收指标核验**：
   - 12V 串联 100Ω + 200Ω：电流精确求解为 0.04A。
   - 12V 并联 100Ω // 200Ω：支路分别为 0.12A 与 0.06A，总电流 0.18A。
   - 断开开关时所在支路电流立即降为 0。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.37 USD（11 个案例；原始消耗 414 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-gemini-3-8-flash-high-2026-10-09；未记录单案例费用）
- [电路实验台](../../../../demos/circuit-lab/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/gemini-3.8-flash`，提交 `7fea10d`。迁入时原始输入与实现未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
