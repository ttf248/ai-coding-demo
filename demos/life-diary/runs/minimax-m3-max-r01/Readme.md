# 藏盒 · AI 情绪日记与生活助手

## 原始提示词

完整原始输入见 [prompt.md](prompt.md)。

## 运行与复盘

按 v1 任务正文“以产品经理视角规划 → 设计师视角输出 → 一个 HTML 集中展示 → 引入 Tailwind + FontAwesome”执行；任务正文同时要求使用 iPhone 标准尺寸作为基准。

页面与功能：

1. **启动 / 登录**：品牌引导、微信一键登录、手机号登录
2. **首页 / 情绪看板**：今日情绪分数、生活助手快捷入口、AI 建议
4. **写日记**：情绪选择、文字输入、标签、AI 反馈
5. **日记时间线**：日期、情绪、标签筛选
6. **情绪洞察**：30 天情绪曲线、占比、AI 解读
7. **我的**：用户卡片、统计、订阅 / 隐私设置

实现要点：

- 所有原型以 iPhone 12 (375 × 812) 为基准，使用 CSS 模拟设备边框、刘海、状态栏
- Tailwind 通过 CDN 注入；FontAwesome 通过 CDN 注入；不使用外部图片数据
- 情绪曲线用 SVG path 手动绘制，无外部图表库
- 用户头像使用 `i.pravatar.cc` 占位，仅用于静态原型

## 验证记录

- 直接打开 `index.html`，6 个 mockup 横向排列
- 移动端 390px 视口下单个原型完整呈现
- 页面无水平溢出；CDN 资源需要联网

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--minimax-m3-max-r01`
- 模型：MiniMax M3；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：原 prompts/v1/prompt.md 完整保存；hash 与 prompts/v1/prompt.json 保持一致。
- 工具：Claude Code (MiniMax-M3)。当前会话直接执行；不使用 worktree 或子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [原型合集](../../../../demos/life-diary/runs/minimax-m3-max-r01/index.html)

### 部署适配记录

- 使用纯 CSS 模拟 iPhone 边框、刘海与状态栏。
- 情绪曲线使用内联 SVG path 绘制，无外部图表库。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/life-diary/runs/minimax-m3-max-r01；按原实验轮次导入。
<!-- archive:end -->
