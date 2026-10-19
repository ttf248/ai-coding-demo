# 生活情绪日记

## 原始输入

- 完整原始输入：[prompt.md](prompt.md)
- 任务正文版本：[v1](../../prompts/v1/prompt.md)。

## 实现说明

- 单页七屏 iPhone 375×812 原型：今日、情绪打卡、写日记、AI 陪伴、情绪回顾、生活节奏、我的。
- 使用 Tailwind CSS CDN、FontAwesome、Unsplash；页面通过 CDN 获取样式、图标和照片，需联网。
- 入口 [index.html](index.html)；任务要求的 `canghe_app_prototype.html` 作为跳转入口保留。
- 交互：心情选择、情绪强度、标签多选、保存提示、AI 对话追加、习惯勾选、底部导航/角色切换等轻交互。
- 产品结构覆盖情绪记录、AI 陪伴、复盘统计、生活节奏和隐私/账户。

## 验证记录

- Playwright：7 个手机屏幕全部渲染；Tailwind 样式生效；390px 视口页面宽度为 390，无水平溢出。
- 正常网络下 FontAwesome 字体加载成功（`document.fonts.check` 为 true），Unsplash 图片正常显示。
- 手机屏幕内容在固定 812 高度内独立滚动，滚动条隐藏。

## 复盘

- 按仓库规则把单文件入口统一为 index.html，同时保留原任务要求的文件名作为跳转入口。
- 视觉上采用奶油色纸张、鼠尾草绿与珊瑚色；AI 陪伴的头像/对话语气以“被听见而非被评判”为原则。
- 原型不连接真实后端或 AI 服务；AI 回复为本地演示文本，数据不持久化。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--deepseek-v4-1-flash-1017-max-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：包含用户会话指令与任务正文原文；任务正文未改写。 任务正文版本 v1。
- 工具：Claude Code / DeepSeek-V4.1-Flash-1017。当前 Claude Code 会话直接执行，未委派子代理；Windows 11 + Node 22.16.0；模型与档位由用户指定。使用本地 HTTP 静态服务器与 Playwright/Chromium（WebGL 软件光栅器）做加载、交互与 390px 溢出检查；软件光栅器帧率不代表硬件 GPU 表现。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 4.46 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-max-2026-10-19；未记录单案例费用）
- [主页面](../../../../demos/life-diary/runs/deepseek-v4-1-flash-1017-max-r01/index.html)

### 部署适配记录

- 按仓库入口规则将主入口统一为 index.html；任务中要求的 canghe_app_prototype.html 作为跳转入口保留。
- 加入情绪选择、标签、强度、保存提示、AI 对话追加与习惯勾选等轻交互。
- 自查修复：移动端 grid 子项按最大内容宽度撑到 407px，给 section 设置 width:100%/min-width:0 后 390px 无水平溢出。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017 分支未提交工作区导入本轮 max 档结果；基线提交 452ac58，文件来源指纹见 docs/imports/2026-10-19-deepseek-1017-max.json；未覆盖历史实验。
- 迁移维护者为全部 HTML 入口添加带 defer 的公共 assets/analytics.js 引用；小蓝书配置适配 previews 路径并重新构建。
- 源记录没有截图；迁移时补拍真实桌面页面并按当前 v2 规则逐图复核。费用 ¥4.46、92,462,698 Tokens 与耗时 59m 52s 为用户提供的整批 11 个案例合计，不拆分到单案例。
- 迁移补拍：Chromium 1440×960、deviceScaleFactor=1；默认实际页面。截图页面 index.html，远程统计请求被拦截；软件 WebGL 不作为硬件性能证据。
<!-- archive:end -->
