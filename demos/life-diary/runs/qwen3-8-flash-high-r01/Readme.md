# AI 情绪日记原型图

## 原始提示词

见 [完整原始输入](prompt.md)（主题任务正文 v1 逐字快照）。本轮批量触发语：“所有的案例 demo 全部都做一遍，模型名称 qwen3.8-flash 档位 high, 用当前会话就好了”。当前会话按 topics:active 清单直接执行。

## 批次记录

Aliyun 批次共 11 个案例，合计 3.6 CNY，耗时 1h 18m 26s；费用和耗时均为批次总计，不拆分为单案例。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 index.html，需联网（Tailwind CDN、Font Awesome CDN、Unsplash 图片）。依赖 CDN，不可作为离线预览。
- 实现要点：以产品经理视角规划「苍禾」App 的信息架构——今日首页、30 秒情绪打卡（表情五档+能量条+情境标签+语音）、日记详情（图文+AI 批注卡+当日情绪曲线）、情绪日历（月度能量热力+当日摘要）、AI 陪伴对话（引用历史记录的主动关怀）、数据洞察（走势/构成环/AI 发现/词云）、生活片段（照片墙+自动关联时间线）、生活助手（精力曲线排序任务+AI 建议+习惯提醒）、我的（连续天/成就墙/隐私导出）、启动登录，共 10 屏全部呈现在一屏网格内，375px 手机框。全部 Tailwind 工具类实现（无手写 style 块，仅 no-scrollbar 两行 utility 兜底），FontAwesome 图标，Unsplash 占位图带 onerror 渐变降级。
- 与原任务差异：入口文件名按本站约定统一 index.html（原要求 canghe_app_prototype.html），已登记 changes。
- 验证（headless Chromium）：Tailwind CDN 生效、10 个手机框全部渲染、无脚本错误（容忍图片网络 404）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--qwen3-8-flash-high-r01`
- 模型：Qwen 3.8 Flash；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：当前会话直接执行主题任务正文 v1，完整原始输入为该正文的逐字快照，未附加其他材料；批量触发语记录于本 run 的 Readme。
- 工具：Claude Code CLI（当前会话）。模型名称与档位按用户给定登记（qwen3.8-flash / high）；Windows 11 + Node 22，当前会话生成并自检，未委派子代理；实现过程中的自我修正记录于 changes 与 Readme。 迁移到 main 时，按用户确认将测试分支误记的档位从 default 更正为 high。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 3.6 CNY（11 个案例；批次 qwen3-8-flash-high-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/life-diary/runs/qwen3-8-flash-high-r01/index.html)

### 部署适配记录

- 产物入口按本站约定统一为 index.html（原任务要求命名 canghe_app_prototype.html），内容未改动此要求外的其他方面。
- Unsplash 图片增加 onerror 降级渐变占位，离线打开版式不塌陷（但 Tailwind/图标 CDN 仍要求联网）。
- 迁移时根据用户确认将误记的 default 档位纠正为 high，并同步更正实验 ID 与路径。
<!-- archive:end -->
