# YouTube UI 模块

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。通过静态 HTTP 托管或浏览器直接打开。

核心实现：
1. **模块化功能拆分**：按 YouTube 核心移动端场景设计四大并排独立原型模块：
   - 首页流：分类胶囊、视频大卡片、作者频道、点赞更多操作。
   - 沉浸详情页：16:9 播放器、时间轴进度、点赞/踩/分享/剪辑/缓存按钮矩阵、订阅条与评论区卡片。
   - Shorts 短视频流：全屏竖屏视频、右侧浮动交互操作（点赞、踩、评论、分享、原声唱片旋转动效）、作者信息。
   - 创作者工作室：总播放量与新增订阅者卡片、观看时长趋势波线图、最新视频即时排名分析。
2. **设计规范与细节**：引入 Tailwind CSS 与 Lucide 静态图标 CDN，应用玻璃拟态背景，且完全隐藏滚动条保障高级质感。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.37 USD（11 个案例；原始消耗 414 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-gemini-3-8-flash-high-2026-10-09；未记录单案例费用）
- [YouTube UI 模块](../../../../demos/youtube-ui/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/gemini-3.8-flash`，提交 `7fea10d`。迁入时原始输入与实现未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
