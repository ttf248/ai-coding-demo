# Meditation LongCat 2.5 Preview Free

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **模型**：LongCat 2.5 Preview Free
- **档位**：Default
- **运行日期**：2026-10-13
- **运行方式**：OpenCode；源记录将方式记为“当前会话”，其余会话信息未留存
- **任务类型**：single-html
- **输入完整性**：partial；原始提示词快照保留，系统提示和完整对话上下文未留存
- **状态**：ready
- **费用**：OpenCode 免费模型；用户说明耗费为免费，金额未折算（null）

### 迁移与验收

- 来源：测试分支 F:\dev\ai-coding-demo-test（model-test-base）；保留原始提示词与模型生成页面。
- 验收：HTTP 入口返回 200，file:// 入口可打开；保存了 1440×960 桌面运行截图。

- **390px 检查**：390px 检查发现页面宽度超出 57px；多个 375px 手机画面仍按桌面横向排列，保留源产物并记录。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--longcat-25-preview-free-default-r01`
- 模型：LongCat 2.5 Preview Free；推理档位：default
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：原始输入快照与源分支记录的 SHA-256 一并保留，关联提示词版本 v1。源分支未留存系统提示、完整模型对话及其他会话上下文，因此标为 partial。
- 工具：OpenCode。用户确认通过 OpenCode 使用 LongCat 2.5 Preview Free（default）；源记录将运行方式记为“当前会话”，未留存客户端版本、完整对话或系统提示。迁移后使用 Microsoft Edge 通过本地 HTTP 与 file:// 实际检查入口；桌面截图为 1440×960。390px 检查发现页面宽度超出 57px；多个 375px 手机画面仍按桌面横向排列，保留源产物并记录。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenCode · 免费模型 订阅；单案例货币金额未记录。用户说明本次通过 OpenCode 免费模型测试，耗费为免费；未提供可折算的货币金额，金额与单位保持 null。
- [主页面](../../../../demos/meditation/runs/longcat-25-preview-free-default-r01/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base）/demos/meditation/runs/longcat-25-preview-free-default-r01；保留原始输入、模型产物和轮号，未改写模型生成代码。
- 迁移验收：HTTP 返回 200，file:// 入口可打开；实测桌面页面截图 screenshot.png（1440×960，2026-10-14）。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
