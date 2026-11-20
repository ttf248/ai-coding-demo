# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)，对应共用任务正文 [v2](../../prompts/v2/prompt.md)。

## 实现与功能说明

- 技术栈：React 18 + TypeScript + Tailwind CSS + Zustand + react-lazyload + Vite。
- 布局结构：顶部吸顶搜索栏（“小蓝书”标志、实时关键词搜索、“+ 发布”弹窗按钮与频道标签切换）；瀑布流主体自适应移动端 2 列、平板 3 列、桌面端 4 列。
- 数据与交互：首次加载 20 条不同画幅比例的本地 SVG 插画 mock 笔记，包含 1 条刻意设置的断图地址以验证加载失败默认图回退；支持触底自动加载更多（含 loading 动画）、触摸下拉刷新与桌面刷新按钮、点赞红心放大缩小动画、卡片悬停上浮与按压反馈、详情弹窗与渐入过渡。

## 本地运行

```sh
npm ci
npm run dev
```

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gemini-4-hydrogen-xhigh-r01`
- 模型：Gemini 4 Hydrogen；推理档位：xhigh
- 执行模式：按原任务执行；备注：源提交按测试基线的共用任务正文在当前会话直接执行。
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：采用 bluebook 最高版本任务正文 v2，完整保留会话指令与任务正文。 源提交的快照保留批次会话指令与本主题任务正文。
- 工具：agy v1.5.13。当前会话直接执行实现；使用 npm install 生成独立 package-lock.json 并通过 build:demo 产出静态预览。 工具版本由用户提供。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-hydrogen-xhigh-agy-pro-2026-11-20；未记录单案例费用）
- [小蓝书首页](../../../../previews/bluebook/gemini-4-hydrogen-xhigh-r01/index.html)

### 部署适配记录

- 导入来源为独立测试目录 ai-coding-demo-test 的 experiment/gemini-4-hydrogen-xhigh 提交 d446209f3631a2109360d9e25d604654e75f79d4，保留其原始输入快照。
- 归档时为本仓库维护的 HTML 入口接入公共访问统计。
- 沿用仓库的独立锁文件安装配置，并适配构建产物的统计脚本相对路径，在 main 重建静态预览。
- 源提交没有真实截图。归档时采集桌面、手机及适用交互状态，逐帧按 v3 复核并登记真实桌面封面。
<!-- archive:end -->
