# 简化电路实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行方式

- 单文件入口 `index.html`，浏览器直接打开或经本地静态服务器访问。
- 网络：`offline`，无任何外部资源。

## 实现要点

- 基尔霍夫节点电压法（MNA）构建并求解线性方程组，得到各支路电压电流。
- 支持串并联组合搭建、仪表读数面板，冲突电源/非法连接给出异常提示。

## 验收记录

- 工具：Playwright（Chromium，临时脚本未入库）。
- 通过项：串并联电路读数与理论值一致、冲突电源提示、异常电路提示、交互编辑、390px 无横向溢出、无控制台错误。

## 人工适配与变更

无。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--mimo-v2-6-flash-free-max-r01`
- 模型：MiMo-V2.6-Flash Free；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：完整记录：与主题提示词原文一致，hash 为 BOM/换行规范化后的 SHA-256。 提示词版本 v1。
- 工具：OpenCode + Playwright 静态验收。实际执行模型 MiMo-V2.6-Flash Free，档位 max，在当前会话内直接执行（未委派子代理）。产物在本地用 Playwright 验收脚本回归，脚本存于系统临时目录、未入库。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenCode · 免费模型 订阅；单案例货币金额未记录。用户说明本次使用 OpenCode 免费模型，无付费费用；未提供可折算的货币金额，amount 保持 null。
- [预览首页](../../../../demos/circuit-lab/runs/mimo-v2-6-flash-free-max-r01/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（experiment/mimo-v26-flash-free）/demos/circuit-lab/runs/mimo-v2-6-flash-free-max-r01；保留源测试轮号 r01，原始输入指纹与 main 的 vv1 提示词一致。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
