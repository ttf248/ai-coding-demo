# YouTube UI 模块 · 原型图

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

运行：分别打开本目录的 `home.html`、`playback.html`、`discover.html`、`profile.html`、`creator.html`（需联网）。

验证：无头 Chromium 检查：五个页面各两个手机框；图片全部加载；无页面错误；1280 px 与 390 px 均无横向溢出；页面使用的 26 个 Lucide 图标地址均返回 200。

复盘：任务正文要求用户先提出 APP 需求，本次没有留存具体需求，应用需求按主题描述（首页、播放、发现、个人中心、创作中心）自拟，因此输入记录为 partial；“是否继续”的多轮交互未留存。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--claude-haiku-5-5-max-r01`
- 模型：Claude Haiku 5.5；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：prompt.md 为任务正文原文，与 prompts 版本字节一致；会话系统上下文与工具设定未随记录留存，记为 partial。 APP 需求未留存，已按主题描述自拟。
- 工具：Copilot SDK（VS Code 当前会话）。模型 claude-haiku-5-5、档位 max 由用户指定；会话内无法核验运行时实际配置（本地用量表无记录）。直接在当前会话完成，未委派子代理，未另建克隆；结果未提交、未推送。 来源：F:/dev/ai-coding-demo-test 的 model-test-base 工作树（HEAD 452ac588702d3bde24f048fcf47cc5ffa7abb602），迁移时源记录未提交；输入快照与模型产物按源文件保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.65 USD（11 个案例；原始消耗 463.99 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-claude-haiku-5-5-max-2026-10-09；未记录单案例费用）
- [首页与搜索](../../../../demos/youtube-ui/runs/claude-haiku-5-5-max-r01/home.html)
- [播放与评论](../../../../demos/youtube-ui/runs/claude-haiku-5-5-max-r01/playback.html)
- [发现与直播](../../../../demos/youtube-ui/runs/claude-haiku-5-5-max-r01/discover.html)
- [个人中心](../../../../demos/youtube-ui/runs/claude-haiku-5-5-max-r01/profile.html)
- [创作中心](../../../../demos/youtube-ui/runs/claude-haiku-5-5-max-r01/creator.html)

### 部署适配记录

- 执行方式：原任务要求每个功能输出后询问是否继续；本次批量执行没有追加用户输入，五个功能文件一次性输出。
- 来源：F:/dev/ai-coding-demo-test 的 model-test-base 工作树（HEAD 452ac588702d3bde24f048fcf47cc5ffa7abb602），迁移时源记录未提交；输入快照与模型产物按源文件保留。
- 迁入后通过本地 HTTP 页面补拍实际桌面截图 screenshot.png；源输入与模型产物未改写。
<!-- archive:end -->
