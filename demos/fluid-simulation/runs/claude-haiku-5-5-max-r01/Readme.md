# 彩色流体实验台 · WebGL 单文件网页

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

运行：直接打开本目录 `index.html`（需要支持 WebGL2 与 EXT_color_buffer_float 的浏览器）。

验证：无头 Chromium（SwiftShader）自动化 12 项检查：WebGL2 与浮点渲染可用；拖动注入后画面变化；暂停后画面静止、继续后演化；清空后恢复初始画面；截图以 PNG 下载；模拟分辨率切换会重建网格；390 px 无横向溢出。

复盘：参数对画面的影响通过截图人工观察，未做定量断言；不支持 WebGL2 或缺少浮点渲染时页面给出明确提示。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--claude-haiku-5-5-max-r01`
- 模型：Claude Haiku 5.5；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：prompt.md 为任务正文原文，与 prompts 版本字节一致；会话系统上下文与工具设定未随记录留存，记为 partial。
- 工具：Copilot SDK（VS Code 当前会话）。模型 claude-haiku-5-5、档位 max 由用户指定；会话内无法核验运行时实际配置（本地用量表无记录）。直接在当前会话完成，未委派子代理，未另建克隆；结果未提交、未推送。 来源：F:/dev/ai-coding-demo-test 的 model-test-base 工作树（HEAD 452ac588702d3bde24f048fcf47cc5ffa7abb602），迁移时源记录未提交；输入快照与模型产物按源文件保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.65 USD（11 个案例；原始消耗 463.99 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-claude-haiku-5-5-max-2026-10-09；未记录单案例费用）
- [流体实验台](../../../../demos/fluid-simulation/runs/claude-haiku-5-5-max-r01/index.html)

### 部署适配记录

- 来源：F:/dev/ai-coding-demo-test 的 model-test-base 工作树（HEAD 452ac588702d3bde24f048fcf47cc5ffa7abb602），迁移时源记录未提交；输入快照与模型产物按源文件保留。
- 迁入后通过本地 HTTP 页面补拍实际桌面截图 screenshot.png；源输入与模型产物未改写。
<!-- archive:end -->
