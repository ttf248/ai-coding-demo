# YouTube UI 模块

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：静态 HTML 原型展示页，直接打开 `index.html` 即可查看全部模块的横向 Mockup 画布（采用 Tailwind CSS CDN、Lucide Static CDN 图标与 Unsplash 高清封面，需联网加载）。
- **核心设计**：
  1. **玻璃拟态（Glassmorphism）暗黑流媒体视觉**：采用深空黑曜石基底搭配 YouTube 绯红高光与多层毛玻璃浮层（`backdrop-blur-xl`），所有手机 Mockup 内部严格遵循无滚动条（`overflow-hidden`）一屏高密度精致排版。
  2. **5 大核心功能模块共 10 台横向排列独立 Mockup**：涵盖「模块一：个性化发现首页与灵动频道导航」、「模块二：4K HDR 沉浸播放页与 AI 章节摘要抽屉」、「模块三：Shorts 竖屏沉浸流与实时互动弹幕」、「模块四：创作者 Studio 实时数据看板与 AI 剪辑发布台」以及「模块五：个人媒体库与家庭会员空间」，支持模块筛选与交互切换。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：按 demos/youtube-ui/prompts/v1/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/youtube-ui/runs/gemini-4-argon-medium-r01/index.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
