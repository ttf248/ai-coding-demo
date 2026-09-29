# 沧河 · AI 情绪日记与生活助手（任务正文 v1）

「沧河」是一款 AI 情绪日记与生活助手 App 的完整高保真原型，10 个界面全部集中在
`canghe_app_prototype.html` 一个文件中展示，可直接双击打开。

## 产品定位

面向 18–35 岁、习惯记录生活的城市用户。主线是「情绪速记 → AI 复盘 → 生活干预」：

1. 每天一次轻量情绪打卡（选心情 + 挑标签 + 写一句话，30 秒内完成）；
2. AI 在夜间读完当天的记录，生成情绪归因与明日建议；
3. 建议可以一键落成习惯打卡或待办，形成闭环。

## 界面清单

| # | 界面 | 说明 |
|---|---|---|
| 01 | 启动引导 | 价值主张 + 三个核心能力 + 隐私说明 |
| 02 | 首页 · 今日 | 五档情绪速记、AI 昨夜复盘、生活助手进度卡、今天的生活片段 |
| 03 | 记录情绪 | 心情选择、场景标签、正文输入（带 AI 补全）、配图、可见性设置 |
| 04 | 日记时间线 | 按日期分组的日记流、情绪筛选、压力高峰标记 |
| 05 | 日记详情 · AI 回复 | 正文、标签、互动栏、AI 归因回复与可执行建议 |
| 06 | 情绪趋势 | 周/月/年切换、情绪均分折线、情绪构成、AI 归因三因素 |
| 07 | AI 陪伴对话 | 连续对话气泡、沟通草稿生成、快捷提问 |
| 08 | 生活助手 | 今日完成度、习惯打卡、待办、本周坚持度热力图 |
| 09 | 记忆胶囊 | 一年前的今天、当时情绪、相似用户 |
| 10 | 我的 · 设置 | 成就徽章、隐私与数据（端侧加密）、通用设置 |

## 设计规范

- 基准尺寸 375 × 812（iPhone 标准尺寸），顶部 44px 状态区，底部 78px TabBar（含 20px 安全区）。
- 主色 `#6C5FD6`（river），辅助色 `#FF7A8A`（coral），中性底 `#F7F6FB` / `#F4F3F8`。
- 圆角层级：14 / 16 / 20 / 26 / 46px；卡片阴影 `0 10px 30px -14px rgba(27,26,42,.22)`。
- 全部使用 Tailwind 原子类，图标统一 FontAwesome 6.5，图片统一 Unsplash CDN。
- 移动端习惯：可点区域不小于 40px，横向滚动区使用 `no-scrollbar` 隐藏滚动条但保留惯性滑动。

## 打开方式

- 直接双击 `canghe_app_prototype.html`（需要联网加载 Tailwind / FontAwesome / Unsplash）。
- `index.html` 是本目录的统一入口，会自动跳转到原型文件。

## 已知边界

- 纯静态原型，界面不可点击，数据为写死的展示数据。
- 图表为手写 SVG，未接入图表库。
- 界面内的日期、分数、相关系数等均为示例数据。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：用户指令、覆盖范围确认与任务正文 v1 原文均已完整留存，无图片、附件或历史上下文。
- 工具：Claude Code（当前会话）。模型 MiniMax M3.1 Flash Preview，推理档位 max，单会话直接执行，未委派子代理。原型为静态稿，未接后端；Tailwind 与 FontAwesome 走 CDN，因此预览需要联网。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [原型入口（跳转页）](../../../../demos/life-diary/runs/minimax-m3-1-flash-preview-max-r01/index.html)
- [完整原型（10 个界面）](../../../../demos/life-diary/runs/minimax-m3-1-flash-preview-max-r01/canghe_app_prototype.html)

### 部署适配记录

- 目录入口：任务正文要求产物文件名为 canghe_app_prototype.html，按原文件名交付；另加一个 index.html 跳转页作为本目录统一入口，不复制原型内容。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/life-diary/runs/minimax-m3-1-flash-preview-max-r01；保留该测试轮号。
<!-- archive:end -->
