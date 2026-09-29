# 静水 · 冥想 iOS App 完整原型（任务正文 v1）

「静水」是一款冥想 App 的完整高保真原型，10 个界面全部集中在
`meditation_app_prototype.html` 一个文件中展示，可直接双击打开。

## 产品定位

面向睡眠不足、注意力被切碎的城市上班族。产品只做三件事：

1. 让人**每天都愿意坐下来五分钟**（连续天数、成就体系、7 天新手期）；
2. 让人**随时能进入放松状态**（首页快捷入口、焦虑急救 5 分钟、定时器）；
3. 让人**看得见坚持的变化**（时长趋势、练习后感受、偏好分布）。

## 界面清单

| # | 界面 | 说明 |
|---|---|---|
| 01 | 首次启动 · 目标 | 四个目标选项（睡得更好 / 减轻焦虑 / 专注当下 / 身体放松），决定首页推荐顺序 |
| 02 | 首页 · 今日 | 今日推荐大卡、连续 7 天环、三大快捷入口（定时器 / 呼吸 / 白噪音）、为你推荐 |
| 03 | 发现 · 内容库 | 搜索、主题筛选、专题 Banner、七日系列、单次练习列表、按老师 |
| 04 | 冥想播放器 | 呼吸光晕背景、进度、播放控制、底部工具栏 |
| 05 | 呼吸练习 | 4-7-8 呼吸法、轮次进度、要点说明 |
| 06 | 睡眠模式 | 助眠音选择、音量、淡出计时、距明早时长 |
| 07 | 洞察 | 周/月/年切换、总时长柱状图、练习后感受对比、偏好分布 |
| 08 | 成就 | 连续天数 Hero、已解锁徽章、进行中进度、未解锁预览 |
| 09 | 我的 | Plus 会员卡、累计数据、收藏 / 下载 / 成就 / 邀请、通用设置 |
| 10 | 练习结束 · 记录 | 五档感受选择 + 一个词的补充记录 |

## 设计规范

- 基准尺寸 375 × 812，顶部 44px 状态区，底部 78px TabBar（含 20px 安全区）。
- 深色底 `#0B0A1A`，主色 `#8B5CF6` → 辅助色 `#6D8DFB` 渐变，正文 `#E9E7F5`，辅助文字 `#B9C4D6`。
- 卡片统一玻璃拟态：`rgba(255,255,255,.07)` 底 + `1px rgba(255,255,255,.12)` 描边 + `blur(18px)`。
- 呼吸 / 播放动画用径向渐变光晕 + 同心圆环表达，不引入 Lottie 等额外运行时。
- 横向内容统一 `no-bar` 类隐藏滚动条但保留惯性滑动。

## 打开方式

- 直接双击 `meditation_app_prototype.html`（需要联网加载 Tailwind / FontAwesome / Unsplash）。
- `index.html` 是本目录的统一入口，会自动跳转到原型文件。

## 已知边界

- 纯静态原型，界面不可点击，图表为手写 SVG / div，未接入图表库。
- 未包含音频资源，播放器与助眠音为视觉示意。
- 界面内的统计数字均为示例数据。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：用户指令、覆盖范围确认与任务正文 v1 原文均已完整留存，无图片、附件或历史上下文。
- 工具：Claude Code（当前会话）。模型 MiniMax M3.1 Flash Preview，推理档位 max，单会话直接执行，未委派子代理。原型为静态稿，未接后端；Tailwind 与 FontAwesome 走 CDN，图片走 Unsplash，因此预览需要联网。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [原型入口（跳转页）](../../../../demos/meditation/runs/minimax-m3-1-flash-preview-max-r01/index.html)
- [完整原型（10 个界面）](../../../../demos/meditation/runs/minimax-m3-1-flash-preview-max-r01/meditation_app_prototype.html)

### 部署适配记录

- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/meditation/runs/minimax-m3-1-flash-preview-max-r01；保留该测试轮号。
<!-- archive:end -->
