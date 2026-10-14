# YouTube 首页模块原型图

## 原始提示词

见 [完整原始输入](prompt.md)（主题任务正文 v1 逐字快照）。本轮批量触发语：“所有的案例 demo 全部都做一遍，模型名称 qwen3.8-flash 档位 high, 用当前会话就好了”。当前会话按 topics:active 清单直接执行。

## 批次记录

Aliyun 批次共 11 个案例，合计 3.6 CNY，耗时 1h 18m 26s；费用和耗时均为批次总计，不拆分为单案例。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 index.html，需联网（Tailwind CDN、Lucide Static CDN、Unsplash）。依赖 CDN，不可标记离线。
- 实现要点：任务正文是“用户提【APP 需求】→ 逐功能输出 HTML → 询问是否继续”的交互流程。单发批量执行时按主题既定需求（YouTube 移动端，首页/播放/发现/个人中心/创作中心五模块）先完成**第一个功能模块「首页」**：推荐信息流（分类 Chips + 视频卡）、长按 Chip 筛选弹层（多选/恢复）、Shorts 沉浸竖屏流（右侧操作列、玻璃导航）、订阅更新聚合（频道 stories 行 + 更新卡 + 已看进度条）4 屏，横向排列于各自独立手机 mockup 边框内，互不影响；玻璃拟态顶栏/底栏、#FF0033 强调、图标全部 `<img>` 引用 `https://unpkg.com/lucide-static@latest/icons/*.svg`、缩略图 Unsplash（onerror 渐变降级）、界面内无滚动条。
- 流程留痕：按原提示词此处应“提示用户是否继续”，其余四个模块（播放/发现/个人中心/创作中心）待用户确认后续跑；本记录即该确认点。
- 验证（headless Chromium）：Tailwind 生效、4 个手机框渲染、无脚本错误（容忍图片网络 404）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--qwen3-8-flash-high-r01`
- 模型：Qwen 3.8 Flash；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：当前会话直接执行主题任务正文 v1，完整原始输入为该正文的逐字快照，未附加其他材料；批量触发语记录于本 run 的 Readme。
- 工具：Claude Code CLI（当前会话）。模型名称与档位按用户给定登记（qwen3.8-flash / high）；Windows 11 + Node 22，当前会话生成并自检，未委派子代理；实现过程中的自我修正记录于 changes 与 Readme。 迁移到 main 时，按用户确认将测试分支误记的档位从 default 更正为 high。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 3.6 CNY（11 个案例；批次 qwen3-8-flash-high-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/youtube-ui/runs/qwen3-8-flash-high-r01/index.html)

### 部署适配记录

- 原提示词为多轮交互流程（每功能输出一个 html 后询问是否继续）。单发执行时按主题首个功能「首页」输出一屏多框的独立 html，并在 Readme 记录待用户确认后再继续其余模块。
- 迁移时根据用户确认将误记的 default 档位纠正为 high，并同步更正实验 ID 与路径。
<!-- archive:end -->
