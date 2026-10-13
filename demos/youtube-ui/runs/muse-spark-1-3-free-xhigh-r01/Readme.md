# YouTube UI 模块原型

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 模型：Muse Spark 1.3 Free；档位：xhigh；日期：2026-10-13；方式：当前会话直接执行，提示词版本见 run.json。
- 单HTML四mockup横排独立边框，Tailwind+Unsplash联网，玻璃拟态，隐藏滚动条，覆盖首页/播放/Shorts/订阅链路。
- 入口：index.html（bluebook 为构建产物预览），浏览器直接打开与 HTTP 静态托管均验证思路，390px 无页面水平溢出。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--muse-spark-1-3-free-xhigh-r01`
- 模型：Muse Spark 1.3 Free；推理档位：xhigh
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整原始输入与任务正文一致，原文执行，未缺上下文。
- 工具：opencode (Muse Spark 1.3 Free, xhigh, current session)。当前会话直接执行全部参与主题，最大版本提示词，未查看历史实现；bluebook外均为单文件离线/联网静态。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenCode · 每日免费额度 订阅；单案例货币金额未记录。本次使用 OpenCode 每日免费额度；平台未提供额度折算或具体扣减明细，金额保持未知。
- [主页面](../../../../demos/youtube-ui/runs/muse-spark-1-3-free-xhigh-r01/index.html)

### 部署适配记录

- 迁移适配：为 .phone 增加相对定位，收住 Shorts 文案和操作图标，修复 390px 页面横向溢出。
<!-- archive:end -->
