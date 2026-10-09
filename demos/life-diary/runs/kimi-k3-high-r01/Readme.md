# 生活情绪日记

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：单文件原型页，file:// 与 HTTP 均可打开；**依赖网络**（Tailwind CDN、FontAwesome CDN 与 Unsplash 图片），离线打开会失去样式与配图。
- 入口：[canghe_app_prototype.html](canghe_app_prototype.html)（任务正文指定的文件名）
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 产品规划（PM 视角）：以「记录 → 理解 → 陪伴 → 改善」为主线，规划四大场景——写日记（语音/照片/位置 + AI 情绪分析）、AI 生活助手（结合日记与日程的对话）、情绪周报（走势/关键词/AI 复盘）、习惯与生活（AI 推荐习惯、天气提醒）。共 8 个界面。
- 验证记录：全部页面基于 iPhone 标准 375px 宽度；使用 Tailwind 工具类而非 style 样式；图片为 Unsplash；图标为 FontAwesome 开源图标库。
- 复盘：一次生成完成，未做追加修复。原型为静态展示稿，界面间无跳转逻辑，数据为示例内容。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整输入即主题任务正文 v1，无附加上下文。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [仓禾 App 原型](../../../../demos/life-diary/runs/kimi-k3-high-r01/canghe_app_prototype.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
