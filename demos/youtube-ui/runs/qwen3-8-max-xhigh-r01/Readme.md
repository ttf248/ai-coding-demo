# YouTube UI 五大模块原型（Qwen3.8 Max · xhigh）

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文版本 [v1](../../prompts/v1/prompt.md)。任务正文是 meta 提示词：要求把复杂产品按功能拆分、每个功能输出一个 HTML（内含该功能多页面的并排 mockup），并在使用【Artifacts】插件预览、每页完成后询问是否继续。本轮一次性完成全部五个功能页；Claude Code 无 Artifacts 插件，以多页面 HTML + 本地静态服务器验证替代插件预览（记录于 run.json 的 environment.notes）。

## 批次记录

Aliyun 批次合计 91.81 CNY，覆盖 11 个案例，耗时 2h 50m 7s；费用及耗时均为批次总计，不拆分为单案例。

## 运行方式

- 五个入口（多页面显式登记）：[首页](home.html) · [播放](watch.html) · [发现](explore.html) · [个人中心](profile.html) · [创作中心](studio.html)；页间有顶部导航互联。
- 依赖 Tailwind CSS CDN、Lucide Static CDN（unpkg 图标 svg）、Unsplash 图片，需联网；`file://` 直接打开亦可（需外网）。
- 每个功能页内并排展示 3 个 mockup：移动端机壳（375 宽、圆角边框、隐藏滚动条）与桌面浏览器窗口框。

## 各功能页面清单

- 首页（home.html）：移动端信息流（顶栏 / chips / 视频卡 / 底部导航）、桌面端（侧边栏 + 搜索 + 网格）、移动端搜索结果与联想。
- 播放（watch.html）：移动端播放页（控制层 / 操作条 / 订阅行 / 描述卡 / 评论 / Up Next）、桌面端双列、横屏全屏播放器。
- 发现（explore.html）：移动端热榜（排名与升降）、桌面分类枢纽（音乐 / 游戏 / 新闻 / 电影 + 频道推荐）、Shorts 竖屏发现行。
- 个人中心（profile.html）：频道主页（横幅 / 订阅 / Tabs / 视频网格）、媒体库（历史进度 / 播放列表堆叠）、设置与 Premium。
- 创作中心（studio.html）：桌面仪表盘（KPI 卡 / 趋势 svg / Top 表格）、移动端内容管理（公开 / 检查中 / 草稿状态）、上传流程四步（进度环与检查清单）。

## 验证记录

2026-10-14 Playwright（Chromium headless）冒烟测试：

- 五个页面均加载成功：Tailwind 生效、Lucide 图标（13–29 个/页）与 Unsplash 图片（3–12 个/页）全部 naturalWidth > 0、无 JS 报错。
- 每页 ≥3 个并排 mockup；顶部导航五页互联点击可达。
- 390px 页面无水平溢出（mockup 行在容器内横向滚动，页面本身不溢出）。

## 复盘

- 设计语言统一：#0f0f0f 深色基底、white/5–10 玻璃拟态卡片与 backdrop-blur 顶栏、YouTube 红仅作品牌与进度点缀；图标全部走 Lucide Static CDN 的 svg 文件（深色底用 invert 反白），不手写 svg 路径，符合任务正文约束。
- 「界面中不要有滚动条」通过屏幕内 `overflow hidden / no-scrollbar` 实现；页面级的 mockup 横排使用容器内横向滚动，保证 390px 页面本身不溢出。
- 桌面 mockup 用浏览器窗口框（信号点 + 地址 pill）与移动端机壳区分观看情境；缩略图统一 16:9、时长角标、两行标题截断，保持 YouTube 视觉语法。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--qwen3-8-max-xhigh-r01`
- 模型：Qwen 3.8 Max；推理档位：xhigh
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：prompt.md 保留用户会话指令与任务正文原文；任务正文为 meta 提示词（要求按功能逐页输出并询问是否继续），本轮一次性完成全部五个功能；Claude Code 系统提示与仓库 AGENTS.md 项目说明同时生效，系统提示未留存于快照。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型与档位由用户指定为 qwen3.8-max / xhigh，与会话自报一致。任务正文要求的【Artifacts】插件在 Claude Code 中不存在，以提交多页面 HTML + 本地静态服务器/浏览器截图方式替代可视化预览，未伪造插件调用。Windows 11 + Node 22；Playwright（Chromium headless）冒烟验证五页加载、图标/图片、导航互联与 390px 布局。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 91.81 CNY（11 个案例；批次 qwen3-8-max-xhigh-2026-10-14；未记录单案例费用）
- [首页功能](../../../../demos/youtube-ui/runs/qwen3-8-max-xhigh-r01/home.html)
- [播放功能](../../../../demos/youtube-ui/runs/qwen3-8-max-xhigh-r01/watch.html)
- [发现功能](../../../../demos/youtube-ui/runs/qwen3-8-max-xhigh-r01/explore.html)
- [个人中心](../../../../demos/youtube-ui/runs/qwen3-8-max-xhigh-r01/profile.html)
- [创作中心](../../../../demos/youtube-ui/runs/qwen3-8-max-xhigh-r01/studio.html)

### 部署适配记录

- 多页面实验：五个功能页（home/watch/explore/profile/studio.html）全部显式登记为 preview.pages，默认入口 home.html。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
