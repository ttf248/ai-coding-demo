# 心屿 · MiniMax M3

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

按主题 v1 任务生成单 HTML AI 情绪日记 App 原型，深色极光玻璃拟态风格，含桌面横向 7 个手机框并排与移动端单框滚动。

主要屏幕：

- **今日 / 首页**：今日心情、写作快捷、推荐日记、底部 Tab。
- **日记**：日历视图（月切换 + 当日点）、搜索、列表 + 详情弹层。
- **写作**：标题 + 富文本 + 心情选择 + 标签；保存后弹出反思弹层并可继续对话。
- **AI 对话**：情绪感知的 mock 回复、建议气泡；网络日志与错误提示。
- **洞察**：SVG 周 / 月趋势图 + 心情分布柱图。
- **关怀**：可勾选的照护计划 + 1 分钟呼圆（动画 + 4-2-6 阶段）。
- **我的**：统计、设置、提醒与白噪音开关。

直接打开 `index.html` 即可使用；依赖 Tailwind CDN、FontAwesome 6.5 CDN、Unsplash、Google Fonts（Cormorant Garamond + Inter），网络必需。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--minimax-m3-unknown-r01`
- 模型：MiniMax M3；推理档位：unknown
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：保留主题 v1 任务正文。
- 工具：未记录。通过 minimax-m3 模型执行；具体平台上下文未记录。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/life-diary/runs/minimax-m3-unknown-r01/index.html)

### 部署适配记录

- 按主题 v1 任务生成单 HTML 移动端日记 App 原型，375px iPhone 基准宽度。
- 7 个主屏幕 + 3 个弹层：今日/日记/写作/AI 对话/洞察/关怀/我的。
- 深色极光玻璃拟态 + Cormorant Garamond 标题字体。
<!-- archive:end -->
