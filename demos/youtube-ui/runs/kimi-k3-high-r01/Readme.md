# YouTube UI 模块

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：单文件原型页，file:// 与 HTTP 均可打开；**依赖网络**（Tailwind CDN、unpkg Lucide Static 图标、Unsplash 图片），离线打开会失去样式、图标与配图。
- 入口：[index.html](index.html)
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 需求理解说明：原始输入是角色/流程式提示词（要求扮演资深全栈+设计工程师，对用户提出的 APP 需求输出原型），输入本身未包含具体需求文本；按主题题意将「YouTube 风格视频社区 App」作为需求，自行完成功能规划：推荐信息流、沉浸式播放、短视频流、搜索发现、频道主页、订阅动态、媒体库/个人中心，共 7 页。原流程中的「逐个功能输出并等待确认、Artifacts 预览」步骤在当前环境无对应物，合并为单页横向陈列交付。
- 验证记录：每个页面独立置于 375px mockup 边框内横向排列、互不影响；样式全部使用 Tailwind 工具类；图标为 Lucide Static CDN（img 引用）；页面内滚动条隐藏；玻璃拟态 + 深色主题。
- 复盘：一次生成完成，未做追加修复。Unsplash 视频封面为静态配图，未模拟真实视频播放。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整输入即主题任务正文 v1。原文为角色/流程式提示词，未随附具体 APP 需求文本；按主题题意将「视频社区 App（YouTube 风格）」作为需求执行，此处如实标注。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [视频 App UI 参考图](../../../../demos/youtube-ui/runs/kimi-k3-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
