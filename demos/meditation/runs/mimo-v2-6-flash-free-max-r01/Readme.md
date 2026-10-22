# 冥想 iOS App

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行方式

- 单文件入口 `index.html`，手机或浏览器打开（移动端原型）。
- 网络：`required`（Tailwind CDN、Unsplash 图片）。

## 实现要点

- 启动/内容/播放/设置多状态切换，呼吸动画与情绪状态卡片，横向内容列表。

## 验收记录

- 工具：Playwright（Chromium，`check-prototype` 临时脚本未入库）。
- 通过项：无横向溢出、57 个图标全部渲染、4 张图片加载、桌面下横向列表、状态切换正常、无控制台错误。

## 人工适配与变更

无。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--mimo-v2-6-flash-free-max-r01`
- 模型：MiMo-V2.6-Flash Free；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：完整记录：与主题提示词原文一致，hash 为 BOM/换行规范化后的 SHA-256。 提示词版本 v1。
- 工具：OpenCode + Playwright 静态验收。实际执行模型 MiMo-V2.6-Flash Free，档位 max，在当前会话内直接执行（未委派子代理）。产物在本地用 Playwright 验收脚本回归，脚本存于系统临时目录、未入库。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenCode · 免费模型 订阅；单案例货币金额未记录。用户说明本次使用 OpenCode 免费模型，无付费费用；未提供可折算的货币金额，amount 保持 null。
- [预览首页](../../../../demos/meditation/runs/mimo-v2-6-flash-free-max-r01/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（experiment/mimo-v26-flash-free）/demos/meditation/runs/mimo-v2-6-flash-free-max-r01；保留源测试轮号 r01，原始输入指纹与 main 的 vv1 提示词一致。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
