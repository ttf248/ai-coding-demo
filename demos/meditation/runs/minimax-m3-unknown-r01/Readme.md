# 静境 · MiniMax M3

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

按主题 v1 任务生成单 HTML iOS 冥想 App 原型。深紫 / 青 / 柔粉玻璃拟态；屏幕画廊（桌面横向 7 框并排）+ 可交互的 iPhone 框。

主要屏幕（iPhone 内可交互）：

- **首页**：连续天数、今日推荐、心情选择、推荐冥想列表。
- **发现**：搜索 + 类目芯片 + 列表。
- **库**：收藏 / 下载 / 最近 Tab 切换网格。
- **进度**：周/月统计 + 习惯打卡。
- **个人 / 设置**：统计、提醒、白噪音开关、目标设置。
- **沉浸式播放器**：圆环计时 + 呼吸球 + 播放 / 暂停 / 跳过。
- **完成**：总结 + 训练后心情选择。
- **呼吸训练**：4-4-4 / 4-7-8 / 深慢 三套节奏。

实现要点：

- LocalStorage 持久化收藏、训练次数、心情、提醒与白噪音设置。
- Tailwind CDN + Unsplash；4 套呼吸球 CSS keyframes（`breathe44` / `breathe478` / `breatheBox` / `breatheDeep`）。
- 屏幕画廊在桌面横向并排，移动端单屏滚动。

直接打开 `index.html` 即可使用（网络必需以加载 CDN）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--minimax-m3-unknown-r01`
- 模型：MiniMax M3；推理档位：unknown
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：保留主题 v1 任务正文。
- 工具：未记录。通过 minimax-m3 模型执行；具体平台上下文未记录。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/meditation/runs/minimax-m3-unknown-r01/index.html)

### 部署适配记录

- 按主题 v1 任务生成单 HTML iOS 冥想 App 原型，深紫/青/柔粉玻璃拟态。
- 7 个主屏幕 + 弹层：首页/发现/库/沉浸式播放/完成/呼吸训练/我的 + 设置。
- 呼吸球动画支持 4-4-4 / 4-7-8 / 深慢三种节奏。
- LocalStorage 持久化收藏、训练次数、心情、提醒与白噪音设置。
<!-- archive:end -->
