# AI 情绪日记与生活助手原型

## 原始提示词

见 [完整原始输入](prompt.md)，对应共用任务正文 [v1](../../prompts/v1/prompt.md)。

## 产品规划与界面说明

- 主文件按提示词指定命名为 `canghe_app_prototype.html`（同目录附带 `index.html` 跳转），全部使用 Tailwind CSS 工具类完成。
- 以 375px iPhone 标准尺寸同屏展示 6 个核心页面：今日情绪首页、多模态日记编辑器、AI 情绪洞察与趋势周报、AI 生活助手与微行动、日记详情与共情回信、个人中心与隐私锁设置。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--gemini-4-hydrogen-xhigh-r01`
- 模型：Gemini 4 Hydrogen；推理档位：xhigh
- 执行模式：按原任务执行；备注：源提交按测试基线的共用任务正文在当前会话直接执行。
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：按 life-diary 任务正文 v1 原文执行；输出提示词指定的 canghe_app_prototype.html，并附带 index.html 跳转入口。 源提交的快照保留批次会话指令与本主题任务正文。
- 工具：agy v1.5.13。依赖 Tailwind CSS CDN、FontAwesome CDN 与 Unsplash 图片，已标记 network: required。 工具版本由用户提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-hydrogen-xhigh-agy-pro-2026-11-20；未记录单案例费用）
- [全部原型界面 (canghe_app_prototype.html)](../../../../demos/life-diary/runs/gemini-4-hydrogen-xhigh-r01/canghe_app_prototype.html)

### 部署适配记录

- 按提示词命名要求生成 canghe_app_prototype.html 为主入口，同时补充 index.html 自动跳转以兼容目录默认入口访问。
- 导入来源为独立测试目录 ai-coding-demo-test 的 experiment/gemini-4-hydrogen-xhigh 提交 d446209f3631a2109360d9e25d604654e75f79d4，保留其原始输入快照。
- 归档时为本仓库维护的 HTML 入口接入公共访问统计。
- 源提交没有真实截图。归档时采集桌面、手机及适用交互状态，逐帧按 v3 复核并登记真实桌面封面。
<!-- archive:end -->
