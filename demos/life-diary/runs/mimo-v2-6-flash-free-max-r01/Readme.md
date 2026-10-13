# 生活情绪日记

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行方式

- 单文件入口 `index.html`，浏览器直接打开或经本地静态服务器访问。
- 网络：`required`（Tailwind CDN、Font Awesome CDN、Unsplash 图片）。

## 实现要点

- 移动端日记原型：情绪记录、卡片式回顾、生活图片片段，信息层级与轻交互按提示词实现。

## 验收记录

- 工具：Playwright（Chromium，临时脚本未入库）。
- 通过项：原型验收脚本全过——390px 无横向溢出、交互状态切换、页面渲染无控制台错误。

## 人工适配与变更

见 run.json `changes`：提示词指定文件名 `canghe_app_prototype.html`，按仓库"单文件入口统一 `index.html`"规则登记为 `index.html`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--mimo-v2-6-flash-free-max-r01`
- 模型：MiMo-V2.6-Flash Free；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整记录：与主题提示词原文一致，hash 为 BOM/换行规范化后的 SHA-256。 提示词版本 v1。
- 工具：OpenCode + Playwright 静态验收。实际执行模型 MiMo-V2.6-Flash Free，档位 max，在当前会话内直接执行（未委派子代理）。产物在本地用 Playwright 验收脚本回归，脚本存于系统临时目录、未入库。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenCode · 免费模型 订阅；单案例货币金额未记录。用户说明本次使用 OpenCode 免费模型，无付费费用；未提供可折算的货币金额，amount 保持 null。
- [预览首页](../../../../demos/life-diary/runs/mimo-v2-6-flash-free-max-r01/index.html)

### 部署适配记录

- 提示词指定文件名 canghe_app_prototype.html，按仓库“单文件入口统一 index.html”规则登记为 index.html。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/mimo-v26-flash-free）/demos/life-diary/runs/mimo-v2-6-flash-free-max-r01；保留源测试轮号 r01，原始输入指纹与 main 的 vv1 提示词一致。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
<!-- archive:end -->
