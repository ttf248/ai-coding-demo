# YouTube 风格移动端 UI（DeepSeek-V4.1-Flash-0731 · high · r01）

单文件 UI/UX 参考图，直接打开 [index.html](index.html) 即可查看。**需要联网**：Tailwind CSS 走 CDN、Unsplash 提供图片素材、图标全部用 Lucide Static CDN 的 SVG。无构建步骤。

## 原始提示词

见 [完整原始输入](prompt.md)；任务正文与 [v1 任务正文](../../prompts/v1/prompt.md) 逐字一致。

## 关于「需求」

任务正文是一段**给设计师角色的元提示词**：由需求方提出一个 APP 需求，模型先以产品经理视角构思功能与信息架构，再用 HTML + Tailwind 输出 UI/UX 参考图。本次批量执行中需求方给出的需求主题即本主题本身——**面向移动端的视频内容平台**，因此按该需求完成设计。

正文还规定了「每个功能输出一个 HTML，输出后询问是否继续」的多轮节奏。批量执行无法进行交互确认，故按正文另一条明确要求（「将一个功能的所有页面写入到一个 html 中，横向排列」）把整套页面收敛为**一个 HTML、六个独立 mockup**。这一点记入 `changes`。

## 设计与实现要点

- 需求拆解（产品经理视角）：用户来视频 App 只做四件事——**看推荐、找内容、连续消费、管理自己看过的**。对应信息架构为底部四个一级入口（首页 / 短视频 / 订阅 / 媒体库-我的），播放页与频道页为二级页面。
- 遵守的正文约束：
  - **玻璃拟态**：顶部分类胶囊、底部操作条、播放器浮层、评论输入框统一使用 `backdrop-blur` + 半透明白边。
  - **只用 Tailwind**：界面排版全部由工具类完成，文件内的样式表仅保留 mockup 外壳（圆角边框、刘海、状态栏定位）所必需的部分。
  - **Lucide Static CDN 图标**：全部形如 `https://unpkg.com/lucide-static@latest/icons/xxx.svg`，未手写任何 SVG 路径。
  - **界面中不出现滚动条**：每个 mockup 的内容区 `overflow: hidden`，按固定高度裁切，滚动条不会出现。
  - **一个功能的所有页面写入一个 HTML**：六个 mockup 横向排列，各自独立、互不影响。
- 六个页面：01 推荐流（分类胶囊 / 直播标记 / 续播进度条）、02 播放页（播放器 + 操作条 + 频道卡片 + 评论）、03 搜索（筛选条 + 结果列表 + 相关搜索）、04 频道页（头图浮层 + 订阅操作 + 内容分栏）、05 短视频（全屏沉浸 + 右侧操作列 + 原声信息）、06 媒体库 / 我的（稍后观看 + 播放列表）。

## 验收自测

无头 Chromium 加载 `file://` 入口（1360px 视口，并在 390px 下复测）：

| 检查项 | 实测 |
|---|---|
| 页面无脚本错误 | `pageerror` 与 console error 均为空 |
| 六个页面同文件、横向排列、各自独立 | 6 个 360×780 mockup，位于同一 HTML 的 flex 容器内 |
| 玻璃拟态生效 | 胶囊、底部条、浮层均有模糊与半透明边框 |
| 图标来自 Lucide Static CDN | 全部为 `unpkg.com/lucide-static/.../*.svg` 的 `<img>`，无内联 SVG 路径 |
| 界面内无滚动条 | mockup 内容区裁切，滚动条不出现 |
| Unsplash 素材 | 正常加载（放大核对缩略图、时长角标、文字未重叠）；离线时脚本回退为渐变占位 |
| 390px 无水平溢出 | 溢出 0px |

## 运行与复盘

- 运行方式：联网状态下用浏览器直接打开本目录 `index.html`；或使用根目录 `npm run preview` 后的静态托管地址。
- 复盘：一次成型。为确认搜索结果列表的文字排版是否重叠，做了 2× 局部放大截图核对，确认标题两行截断与元信息行间距正常。唯一需要说明的处理是把正文的多轮「是否继续」节奏收敛为单文件交付，记入 `changes`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--deepseek-v4-1-flash-0731-high-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：本次批量执行的完整指令 + 主题任务正文；正文文字内容与 demos/youtube-ui/prompts/v1/prompt.md 一致。源快照末尾未保留 v1 末行的 Markdown 行尾空格；完整输入由本快照和原始输入哈希留存。
- 工具：Claude Code。模型名称由用户指定为 DeepSeek-V4.1-Flash-0731；会话内模型标识为 deepseek-flash[1m]。单会话直接执行，未委派子代理。Windows 11 + Node 22.16.0。Unsplash 图片与 CDN 库在验收时均正常加载。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.71 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-0731-high-r01/index.html)

### 部署适配记录

- 任务正文规定「每个功能输出一个 HTML，输出后提示用户是否继续」的多轮节奏；批量执行无法交互确认，按正文另一条明确要求（把一个功能的所有页面写入同一个 HTML、横向排列）收敛为单个 HTML 交付。
- 任务正文未直接给出 APP 需求主题，按本主题（youtube-ui）设定为面向移动端的视频内容平台。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 工作区）/demos/youtube-ui/runs/deepseek-v4-1-flash-high-r01；保留原测试轮次 r01 与完整输入快照。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
- 输入快照核对：主题任务正文文字与 v1 一致；源快照末行未保留 v1 文件末尾的两个 Markdown 行尾空格。完整输入快照与其指纹保持原样。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
