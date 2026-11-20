# 3D 新哥特式塔楼城市漫游

## 原始提示词

见 [完整原始输入](prompt.md)，对应共用任务正文 [v1](../../prompts/v1/prompt.md)。

## 实现与功能说明

- 离线 3D 重建：使用原生 WebGL 1 构建 1:1 米制比例新哥特式海港大教堂主塔群（主尖塔高 116m）、飞扶壁、发光花格尖拱窗、码头拱桥与卫星塔楼区，配合 Gerstner 海洋波浪与加法混合火盆火焰/余烬粒子。
- 漫游与交互：支持“电影巡航”、“步行漫游（按码头/拱桥/广场真实高程贴地行走）”与“高空飞行”三种模式，支持 WASD / 移动端虚拟方向键、鼠标拖拽环视及三种天色切换。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--gemini-4-hydrogen-xhigh-r01`
- 模型：Gemini 4 Hydrogen；推理档位：xhigh
- 执行模式：按原任务执行；备注：源提交按测试基线的共用任务正文在当前会话直接执行。
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：按 neo-gothic-tower-city 任务正文 v1 原文在当前会话直接执行。 源提交的快照保留批次会话指令与本主题任务正文。
- 工具：agy v1.5.13。按提示词关于环境缺漏的约定，采用纯原生 WebGL 与内置着色器实现完全离线 3D 漫游，并在界面角标中明确标示『待确认』。 工具版本由用户提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-hydrogen-xhigh-agy-pro-2026-11-20；未记录单案例费用）
- [3D 城市漫游](../../../../demos/neo-gothic-tower-city/runs/gemini-4-hydrogen-xhigh-r01/index.html)

### 部署适配记录

- 导入来源为独立测试目录 ai-coding-demo-test 的 experiment/gemini-4-hydrogen-xhigh 提交 d446209f3631a2109360d9e25d604654e75f79d4，保留其原始输入快照。
- 归档时为本仓库维护的 HTML 入口接入公共访问统计。
- 源提交没有真实截图。归档时采集桌面、手机及适用交互状态，逐帧按 v3 复核并登记真实桌面封面。
<!-- archive:end -->
