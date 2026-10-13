# 新哥特式塔楼城市

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行方式

- 单文件入口 `index.html`，浏览器直接打开或经本地静态服务器访问。
- 网络：`required`（Three.js r160 走 unpkg CDN，提示词本身要求 r160 CDN）。

## 实现要点

- 程序化新哥特式塔楼群（尖拱、飞扶壁、花窗节奏），雾与天光营造纵深。
- 拖拽环视、滚轮缩放、空闲自动巡游；`syncOrbitFromCamera` 让巡游与手动拖拽无缝接管，避免视角跳变。

## 验收记录

- 工具：Playwright（Chromium，`--use-angle=swiftshader`，`check-three` 临时脚本未入库）。
- 通过项：WebGL 启动、拖拽环视、滚轮缩放、FPS 计数、巡游↔手动接管、390px 无横向溢出、无控制台错误。

## 人工适配与变更

见 run.json `changes`：补充巡游与手动视角的无缝接管逻辑。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--mimo-v2-6-flash-free-max-r01`
- 模型：MiMo-V2.6-Flash Free；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整记录：与主题提示词原文一致，hash 为 BOM/换行规范化后的 SHA-256。 提示词版本 v1。
- 工具：OpenCode + Playwright 静态验收。实际执行模型 MiMo-V2.6-Flash Free，档位 max，在当前会话内直接执行（未委派子代理）。产物在本地用 Playwright 验收脚本回归，脚本存于系统临时目录、未入库。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenCode · 免费模型 订阅；单案例货币金额未记录。用户说明本次使用 OpenCode 免费模型，无付费费用；未提供可折算的货币金额，amount 保持 null。
- [预览首页](../../../../demos/neo-gothic-tower-city/runs/mimo-v2-6-flash-free-max-r01/index.html)

### 部署适配记录

- 巡游与手动拖拽之间补充 syncOrbitFromCamera 无缝接管，避免视角跳变。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/mimo-v26-flash-free）/demos/neo-gothic-tower-city/runs/mimo-v2-6-flash-free-max-r01；保留源测试轮号 r01，原始输入指纹与 main 的 vv1 提示词一致。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
<!-- archive:end -->
