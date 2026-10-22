# 苍何 · AI 情绪日记与生活助手 App 原型（Qwen3.8 Max · xhigh）

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文版本 [v1](../../prompts/v1/prompt.md)。任务正文要求入口文件命名为 `canghe_app_prototype.html`，本实验保留该文件名并在预览中显式登记（未改名为 index.html 的已记录例外，见 run.json 的 changes）。

## 批次记录

Aliyun 批次合计 91.81 CNY，覆盖 11 个案例，耗时 2h 50m 7s；费用及耗时均为批次总计，不拆分为单案例。

## 运行方式

- 入口为本目录 `canghe_app_prototype.html`；Tailwind CSS、FontAwesome 走 CDN，图片走 Unsplash，需联网（`file://` 直接打开亦可，只要可访问外网）。
- 同一 HTML 内并排展示 8 个 iPhone 375px 基准屏幕：① 欢迎 ② 首页 Today ③ 情绪记录 ④ AI 倾诉对话 ⑤ 日记时间线 ⑥ 情绪回顾 ⑦ 生活助手 ⑧ 我的。

## 产品与设计思路（复盘）

- 功能规划（产品经理视角）：核心闭环为「记录情绪（5 秒完成）→ AI 共情回应与行动建议 → 周期回顾激励」，外圈叠加生活助手（待办 / 习惯打卡 / 日程提醒）与隐私能力（保险箱、本地加密叙事）；目标人群为想理解自己情绪的年轻人、需要倾诉出口的独居者、追求秩序的忙碌上班族。
- 界面与交互（设计师视角）：暖纸底色 + 珊瑚橙主色 + 鼠尾草绿辅色，圆角卡片与柔和阴影营造「被接纳的日记本」氛围；每屏保留 iOS 状态栏 / 灵动岛 / Tab Bar / Home Indicator；关键交互做了可操作原型：情绪强度滑块、心情表情选中、待办勾选划线、倾诉对话可发送并得到 AI 回复。
- 图标使用 FontAwesome（jsdelivr 镜像；cdnjs 在本环境浏览器代理下超时，已记录在 run.json 的 environment.notes）。

## 验证记录

2026-10-14 Playwright（Chromium headless）冒烟测试：

- Tailwind 与 FontAwesome CDN 生效、Unsplash 图片全部加载；同页 8 个 iPhone 屏幕。
- 强度滑块联动文案、心情选中态、待办勾选划线、聊天发送后 AI 自动回复，四类交互均生效。
- 390px 页面无水平溢出；桌面 / 移动端 / file:// 三种方式均无 JS 报错。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--qwen3-8-max-xhigh-r01`
- 模型：Qwen 3.8 Max；推理档位：xhigh
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：prompt.md 保留用户会话指令与任务正文原文；Claude Code 系统提示与仓库 AGENTS.md 项目说明同时生效，系统提示未留存于快照。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型与档位由用户指定为 qwen3.8-max / xhigh，与会话自报一致。Windows 11 + Node 22；Playwright（Chromium headless）冒烟验证 HTTP 与 file://、CDN/图片加载与 390px 布局。FontAwesome 改用 jsdelivr 镜像：cdnjs 在本环境浏览器代理下超时。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 91.81 CNY（11 个案例；批次 qwen3-8-max-xhigh-2026-10-14；未记录单案例费用）
- [苍何 App 原型总览](../../../../demos/life-diary/runs/qwen3-8-max-xhigh-r01/canghe_app_prototype.html)

### 部署适配记录

- 入口文件名遵循任务正文要求保留为 canghe_app_prototype.html，未改名为 index.html；预览按真实文件名显式登记（仓库单文件入口惯例的已记录例外）。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
