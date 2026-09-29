# 璃映 YouTube · MiniMax M3

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

按主题 v1 任务生成单 HTML 玻璃拟态 YouTube UI 原型，5 个独立交互的手机框，桌面横向并排 / 移动端单屏滑动。

模块：

- **首页 Feed**：顶部导航 + 搜索 + 7 类筛选芯片（为你 / 音乐 / 游戏 / 新闻 / 直播 / 旅行 / 美食）+ Hero 卡片 + 视频列表 + 4-Tab 底栏。
- **Now Playing**：视频大缩略图、播放 / 暂停切换、静音、进度条可点击跳转、频道订阅切换、点赞 / 点踩 / 收藏 / 分享各自独立 toggle、可展开描述、3 条 mock 评论、评论输入框。
- **Discover**：搜索 + 5 个趋势芯片（激活态颜色主题）、Hero 卡片 + Top 列表（带进度条）、2×2 心情类目网格。
- **Profile / Library**：玻璃 profile 卡片 + 3 项统计 + 4 Tab（历史 / 列表 / 待看 / 喜欢），每个 Tab 独立内容。
- **Creator Studio**：上传按钮（带成功态）+ 4 Tab（概览 / 内容 / 分析 / 评论），分别渲染统计卡 + 视频表 + 28 天分析柱图（24 SVG bar）+ 评论列表。

设计语言：

- `.glass` / `.glass-soft` / `.glassy-chip`：`backdrop-filter: blur(18px) saturate(140%)` + 半透明边框。
- 深色底 + 红 / 紫 / 青色彩光晕 + 网格背景 + 渐变网格。
- iPhone chrome 380×760 + 52 px 圆角 + 灵动岛 + 状态栏（9:41 + WiFi + 电池）。
- YouTube 品牌色：`#ff2f5e → #ff003c → #c8002a`。
- 39 张 Unsplash 图 + 80+ Lucide 图标（`unpkg.com/lucide-static@latest/icons/XXX.svg`）。
- 全局隐藏滚动条（`::-webkit-scrollbar { display:none }`，body `overflow:hidden`）。
- 布局：5 部手机在水平 snap-scroll 容器，桌面并排，移动端单屏滑动。

直接打开 `index.html` 即可（联网加载 Tailwind / Lucide / Unsplash）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--minimax-m3-unknown-r01`
- 模型：MiniMax M3；推理档位：unknown
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：保留主题 v1 任务正文。
- 工具：未记录。通过 minimax-m3 模型执行；具体平台上下文未记录。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/youtube-ui/runs/minimax-m3-unknown-r01/index.html)

### 部署适配记录

- 按主题 v1 任务生成单 HTML 玻璃拟态 YouTube UI 原型，5 个独立交互的手机框。
- 首页 / 播放 / 发现 / 我的 / 创作中心五模块，Tailwind CDN + Lucide Static CDN + Unsplash。
- 玻璃拟态 + 深色底色 + 红色 YouTube 品牌色；隐藏滚动条；iPhone chrome 与灵动岛。
- 桌面横向排列，手机端单框滑动。
<!-- archive:end -->
