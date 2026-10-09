# 简化电路实验台 · 单文件网页

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

运行：直接打开本目录 `index.html`，或通过任意静态服务器访问。

验证：使用无头 Chromium 自动化 17 项检查，结果全部通过：串联 12 V、100 Ω 与 200 Ω 时电流 0.040 A；并联时支路 0.120 A 与 0.060 A、总电流 0.180 A；断开开关后相关电流为零；短路显示明确提示且不显示电流数值；删除元件清除相关导线；非法电压给出提示；390 px 宽度无横向溢出。

复盘：触摸连线以 Pointer Events 实现，自动化测试未模拟真实触摸拖动；灯泡亮度只随耗散功率变化，属于简化模型。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--claude-haiku-5-5-max-r01`
- 模型：Claude Haiku 5.5；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：prompt.md 为任务正文原文，与 prompts 版本字节一致；会话系统上下文与工具设定未随记录留存，记为 partial。
- 工具：Copilot SDK（VS Code 当前会话）。模型 claude-haiku-5-5、档位 max 由用户指定；会话内无法核验运行时实际配置（本地用量表无记录）。直接在当前会话完成，未委派子代理，未另建克隆；结果未提交、未推送。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [实验台](../../../../demos/circuit-lab/runs/claude-haiku-5-5-max-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
