# 体素微缩建筑工地沙盘

## 原始提示词

见 [完整原始输入](prompt.md)，对应共用任务正文 [v1](../../prompts/v1/prompt.md)。

## 实现与功能说明

- 沙盘载体：深色实木桌面与周边蓝图图纸、钢卷尺、安全帽摆件、金属水平仪，桌前沿设 4 枚 3D 射线可点击控制旋钮（设备速度、昼夜循环、尘土强度与新场景切换）。
- 场景内容：按任务正文“添加新场景进去”实现“高层施工工地”与“跨河高架桥梁工程”双场景切换，包含挖掘机、渣土车、错层塔吊、搅拌车、装载机、体素工人、脚手架、板房与围挡大门，运动轨迹严密防穿模；空格键/按钮触发暴雨天气与湿滑反光。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--gemini-4-hydrogen-xhigh-r01`
- 模型：Gemini 4 Hydrogen；推理档位：xhigh
- 执行模式：按原任务执行；备注：源提交按测试基线的共用任务正文在当前会话直接执行。
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：按 voxel-construction-site 任务正文 v1 原文在当前会话直接执行。 源提交的快照保留批次会话指令与本主题任务正文。
- 工具：agy v1.5.13。按任务正文要求通过 Three.js r160 CDN（unpkg.com）加载模块，全部几何与贴图均为代码程序生成。 工具版本由用户提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；批次 gemini-4-hydrogen-xhigh-agy-pro-2026-11-20；未记录单案例费用）
- [体素工地沙盘](../../../../demos/voxel-construction-site/runs/gemini-4-hydrogen-xhigh-r01/index.html)

### 部署适配记录

- 导入来源为独立测试目录 ai-coding-demo-test 的 experiment/gemini-4-hydrogen-xhigh 提交 d446209f3631a2109360d9e25d604654e75f79d4，保留其原始输入快照。
- 归档时为本仓库维护的 HTML 入口接入公共访问统计。
- 源提交没有真实截图。归档时采集桌面、手机及适用交互状态，逐帧按 v3 复核并登记真实桌面封面。
<!-- archive:end -->
