# YouTube UI 模块

## 原始输入

- 完整原始输入：[prompt.md](prompt.md)
- 任务正文版本：[v1](../../prompts/v1/prompt.md)。

## 实现说明

- 多页静态原型：总览 [index.html](index.html)，以及 [home.html](home.html)、[watch.html](watch.html)、[discover.html](discover.html)、[profile.html](profile.html)、[studio.html](studio.html)。
- 按任务“一个功能一个 HTML、每个功能横向排列多个界面”的要求拆为 5 个模块页，每页 3 个 iPhone 390×844 屏幕，共 15 屏。
- 设计系统：深色画布、玻璃拟态、YouTube 红、统一图标与字号；共享 [styles.css](styles.css) 与 [app.js](app.js)。
- 图标使用 Lucide Static CDN 的 `<img>` 方式；照片来自 Unsplash；样式使用 Tailwind CSS CDN；需联网。
- 交互：订阅/已订阅、点赞计数、筛选 chip、底部导航、章节跳转、上传进度/发布、睡眠/播放器按钮等均有反馈。
- 每个手机屏幕内部独立滚动并隐藏滚动条；横向内容使用内部滚动。

## 验证记录

- Playwright：总览与 5 个模块页全部加载；每个模块页有 3 个手机框/3 个屏幕。
- 390px 视口无页面水平溢出，手机框缩放为容器宽度。
- 订阅、点赞、筛选、底部导航与 toast 由共享 `app.js` 处理；图片、Lucide 图标和 Tailwind 在正常网络下加载。
- 模块卡片和顶部导航可互相跳转。

## 复盘

- 任务原稿要求“每个功能输出一个 HTML，然后询问是否继续”；本实验一次性完成全部 5 个模块，但保留每个模块一个 HTML 的结构，避免把所有模块塞进单页。
- 图标用 CSS 滤镜转为白色，适配深色 UI；图片是 Unsplash 外链，离线时会出现占位。
- 原型不连接真实视频、账户或上传服务。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--deepseek-v4-1-flash-1017-max-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：包含用户会话指令与任务正文原文；任务正文未改写。 任务正文版本 v1。
- 工具：Claude Code / DeepSeek-V4.1-Flash-1017。当前 Claude Code 会话直接执行，未委派子代理；Windows 11 + Node 22.16.0；模型与档位由用户指定。使用本地 HTTP 静态服务器与 Playwright/Chromium（WebGL 软件光栅器）做加载、交互与 390px 溢出检查；软件光栅器帧率不代表硬件 GPU 表现。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 4.46 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-max-2026-10-19；未记录单案例费用）
- [模块总览](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-1017-max-r01/index.html)
- [首页模块](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-1017-max-r01/home.html)
- [播放模块](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-1017-max-r01/watch.html)
- [发现模块](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-1017-max-r01/discover.html)
- [个人中心模块](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-1017-max-r01/profile.html)
- [创作中心模块](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-1017-max-r01/studio.html)

### 部署适配记录

- 按任务中“一个功能一个 HTML”的要求拆为 5 个模块页与 1 个总览页；每页内横向排列该模块的 3 个界面。
- 自查修复：状态栏图标改为白色滤镜；上传页缩略图横向滚动；订阅/点赞/筛选/底部导航均加入点击反馈。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017 分支未提交工作区导入本轮 max 档结果；基线提交 452ac58，文件来源指纹见 docs/imports/2026-10-19-deepseek-1017-max.json；未覆盖历史实验。
- 迁移维护者为全部 HTML 入口添加带 defer 的公共 assets/analytics.js 引用；小蓝书配置适配 previews 路径并重新构建。
- 源记录没有截图；迁移时补拍真实桌面页面并按当前 v2 规则逐图复核。费用 ¥4.46、92,462,698 Tokens 与耗时 59m 52s 为用户提供的整批 11 个案例合计，不拆分到单案例。
- 迁移补拍：Chromium 1440×960、deviceScaleFactor=1；默认实际页面。截图页面 home.html，远程统计请求被拦截；软件 WebGL 不作为硬件性能证据。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
