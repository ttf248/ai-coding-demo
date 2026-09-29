# 静境 · 冥想 iOS App 原型

## 原始提示词

完整原始输入见 [prompt.md](prompt.md)。

## 运行与复盘

按 v1 任务正文“以产品经理视角规划功能 → 设计师视角输出 UI/UX → 全部页面在一个 HTML 中展示 → 引入 Tailwind + Unsplash”执行。

页面与功能：

1. **启动 / 登录**：品牌引导、登录入口、合规说明
2. **首页**：问候、推荐卡片、分类 chips、热门课程瀑布
4. **课程详情**：海报、导师、关键数据、CTA
5. **播放页**：进度环、播放控件、字幕提示
6. **统计**：连续天数、心率变异、心情记录
7. **我的**：用户信息、订阅、设置

实现要点：

- 全部页面以 iPhone 12 (375 × 812) 为基准，使用 CSS 模拟设备边框、状态栏、刘海与底部 Tab Bar
- Tailwind 通过 CDN 注入；所有界面均能在不构建的情况下直接打开
- 图片使用 Unsplash 直链作为占位（任务正文允许 Unsplash）
- 自定义 `--p` 控制 conic-gradient 进度环，避免额外脚本

## 验证记录

- 直接打开 `index.html`，6 个 mockup 横向排列
- 移动端 390px 视口下单个原型 page 完整呈现
- 截图与发版前快照一致

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--minimax-m3-max-r01`
- 模型：MiniMax M3；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：原 prompts/v1/prompt.md 完整保存；hash 与 prompts/v1/prompt.json 保持一致。
- 工具：Claude Code (MiniMax-M3)。当前会话直接执行；不使用 worktree 或子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [原型合集](../../../../demos/meditation/runs/minimax-m3-max-r01/index.html)

### 部署适配记录

- 使用纯 CSS 模拟 iPhone 边框、刘海与状态栏，未依赖额外脚本。
- Tailwind 通过 CDN 注入，所有 mockup 集中在 index.html。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/meditation/runs/minimax-m3-max-r01；按原实验轮次导入。
<!-- archive:end -->
