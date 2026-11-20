# YouTube 模块化 UI/UX 原型

## 原始提示词

见 [完整原始输入](prompt.md)，对应共用任务正文 [v1](../../prompts/v1/prompt.md)。

## 模块列表

- [首页模块](index.html)：首页信息流、订阅更新墙与智能搜索。
- [播放模块](player.html)：竖屏播放详情、玻璃拟态评论面板与迷你播放器悬浮态。
- [发现模块](explore.html)：热榜分类与 Shorts 沉浸短视频流。
- [个人中心](profile.html)：媒体库与观看时长统计。
- [创作中心](studio.html)：YT Studio 数据仪表盘与视频投稿编辑。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gemini-4-hydrogen-xhigh-r01`
- 模型：Gemini 4 Hydrogen；推理档位：xhigh
- 执行模式：按原任务执行；备注：源提交按测试基线的共用任务正文在当前会话直接执行。
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：按 youtube-ui 任务正文 v1 及主题模块划分生成 5 个独立模块 HTML。 源提交的快照保留批次会话指令与本主题任务正文。
- 工具：agy v1.5.13。依赖 Tailwind CSS CDN、Lucide Static CDN 与 Unsplash 图片资源，已标记 network: required。 工具版本由用户提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-hydrogen-xhigh-agy-pro-2026-11-20；未记录单案例费用）
- [首页模块](../../../../demos/youtube-ui/runs/gemini-4-hydrogen-xhigh-r01/index.html)
- [播放模块](../../../../demos/youtube-ui/runs/gemini-4-hydrogen-xhigh-r01/player.html)
- [发现模块](../../../../demos/youtube-ui/runs/gemini-4-hydrogen-xhigh-r01/explore.html)
- [个人中心](../../../../demos/youtube-ui/runs/gemini-4-hydrogen-xhigh-r01/profile.html)
- [创作中心](../../../../demos/youtube-ui/runs/gemini-4-hydrogen-xhigh-r01/studio.html)

### 部署适配记录

- 导入来源为独立测试目录 ai-coding-demo-test 的 experiment/gemini-4-hydrogen-xhigh 提交 d446209f3631a2109360d9e25d604654e75f79d4，保留其原始输入快照。
- 归档时为本仓库维护的 HTML 入口接入公共访问统计。
- 源提交没有真实截图。归档时采集桌面、手机及适用交互状态，逐帧按 v3 复核并登记真实桌面封面。
<!-- archive:end -->
