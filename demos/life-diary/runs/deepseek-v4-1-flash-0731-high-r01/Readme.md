# AI 情绪日记与生活助手原型（DeepSeek-V4.1-Flash-0731 · high · r01）

单文件原型，直接打开 [index.html](index.html) 即可查看。**需要联网**：Tailwind CSS、Font Awesome 走 CDN，配图使用 Unsplash。无构建步骤。

## 原始提示词

见 [完整原始输入](prompt.md)；任务正文与 [v1 任务正文](../../prompts/v1/prompt.md) 逐字一致。

## 命名说明

任务正文要求文件名为 `canghe_app_prototype.html`。源分支按该名称生成；迁入 main 时按仓库「单文件入口统一 index.html」约定改为 `index.html`，页面内容保持不变。完整输入快照保留原始文件名要求，路径适配记录在 `run.json` 的 `changes` 中。

## 产品与设计说明

- **用户与场景**：会用日记复盘情绪、但难以坚持的都市用户。核心痛点是「不知道该写什么」与「写完看不出规律」。
- **功能规划**（产品经理视角）：
  1. 记录——一句话也能记，支持图片与语音；AI 在本机识别情绪与强度，不强制分类。
  2. 看懂——周 / 月情绪趋势、情绪构成、触发因素洞察（如「加班日情绪显著偏低」）。
  3. 陪伴——带上下文的 AI 树洞对话，可把洞察转成可执行建议。
  4. 生活——习惯打卡、待办、番茄钟，与情绪数据交叉分析。
  5. 信任——端侧识别、数据导出、专业支持入口。
- **信息架构**：底部四个一级入口（今日 / 时间线 / 树洞 / 我的），中间悬浮「写日记」主操作；报告与生活助手为二级页面。
- **设计规范**（设计师视角）：主色为低饱和草木绿 `#2f7153`，背景 `#f7f9fb`，卡片纯白 + 1px 描边 + 圆角 16~24；情绪用 emoji + 强度条双重表达；字号阶梯 10/11/12.5/13.5/20/40；所有可点区域≥44pt。以 iPhone 375pt 为基准，内容区按安全区留白。

## 界面清单

| 屏 | 名称 | 关键内容 |
|---|---|---|
| 01 | 欢迎页 | 价值主张、三条卖点、隐私承诺、开始记录 |
| 02 | 今日首页 | 心情卡片、本周情绪柱状图、今日待办、底部 Tab |
| 03 | 写日记 | 正文、图片、AI 情绪识别结果与标签、天气选择 |
| 04 | 情绪报告 | 周 / 月切换、情绪指数折线、情绪构成、AI 洞察 |
| 05 | AI 树洞 | 带上下文的对话、可执行建议卡片、快捷短语 |
| 06 | 时间线 | 日记流、情绪筛选、图片缩略 |
| 07 | 生活助手 | 番茄钟、今日习惯、本周待办、AI 建议 |
| 08 | 我的 | 数据概览、隐私与安全、导出、专业支持、开关项 |

## 验收自测

无头 Chromium 加载 `file://` 入口：

| 检查项 | 实测 |
|---|---|
| 页面无脚本错误 | `pageerror` 与 console error 均为空 |
| 全部界面在同一个 HTML 内 | 8 个 iPhone 375×812 mockup，同一文件横向排列 |
| Tailwind 生效 | 页面以 Tailwind 类构建（body 背景 `rgb(238,241,246)` 来自 Tailwind 配置） |
| Unsplash 配图 | 正常加载；脚本提供渐变兜底，图源不可用时不留空白 |
| 390px 无水平溢出 | 溢出 0px |
| 文件可直接打开 | `file://` 与 HTTP 均可用（CDN 需联网） |

浏览器未加载任何 `style` 样式表用于界面本身；文件内仅有设备外壳（圆角边框、状态栏位置、刘海）所必需的最小 CSS。

## 运行与复盘

- 运行方式：联网状态下用浏览器直接打开本目录 `index.html`；或使用根目录 `npm run preview` 后的静态托管地址。
- 复盘：源分支按任务正文使用 `canghe_app_prototype.html` 作为产物文件名，无功能性修正。迁入 main 时按仓库规则使用 `index.html` 作为统一入口，页面内容未改，命名适配已登记在 `run.json` 的 `changes`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--deepseek-v4-1-flash-0731-high-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：本次批量执行的完整指令 + 主题任务正文；正文与 demos/life-diary/prompts/v1/prompt.md 逐字一致。历史来源为 demos/life-diary/runs/unknown-unknown-r01/prompt.md，原始上下文未留存。
- 工具：Claude Code。模型名称由用户指定为 DeepSeek-V4.1-Flash-0731；会话内模型标识为 deepseek-flash[1m]。单会话直接执行，未委派子代理。Windows 11 + Node 22.16.0。Unsplash 图片与 CDN 库在验收时均正常加载。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.71 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-high-2026-10-13；未记录单案例费用）
- [仓禾 App 原型](../../../../demos/life-diary/runs/deepseek-v4-1-flash-0731-high-r01/index.html)

### 部署适配记录

- 迁移适配：任务正文要求的文件名是 canghe_app_prototype.html；按仓库统一入口规则在 main 中保存为 index.html，页面内容保持不变，完整输入快照仍保留原要求。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 工作区）/demos/life-diary/runs/deepseek-v4-1-flash-high-r01；保留原测试轮次 r01 与完整输入快照。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
<!-- archive:end -->
