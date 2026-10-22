# 新哥特式塔楼城市漫游

## 原始提示词

见 [完整原始输入](prompt.md)（主题任务正文 v1 逐字快照）。本轮批量触发语：“所有的案例 demo 全部都做一遍，模型名称 qwen3.8-flash 档位 high, 用当前会话就好了”。当前会话按 topics:active 清单直接执行。

## 批次记录

Aliyun 批次共 11 个案例，合计 3.6 CNY，耗时 1h 18m 26s；费用和耗时均为批次总计，不拆分为单案例。

## 运行与复盘

- 运行方式：HTTP 或 file:// 直接打开本目录 index.html；three.js r160 走 unpkg importmap，必须联网（不标记离线可用）。
- 实现要点：全程序化哥特城——尖拱窗（ShapeGeometry）、四角扶壁+小尖塔、收分主尖顶+金球、教堂中殿/飞扶壁/玫瑰花窗（Canvas 生成彩色玻璃贴图 emissiveMap）；真实比例街区（塔高约 46–240、街区 120、路幅 24），5×5 环岛上 40+ 塔、环岛堤岸与四座拱桥；海浪为顶点三层正弦位移 + 泡沫条带 + 月华反射的 ShaderMaterial；灯柱火焰为 GPU 粒子（加性混合、寿命上升、摆动）；星空/月轮。相机：拖拽环视、滚轮/双指缩放、WASD+QE 地面漫游、自动巡航（缓慢环绕+起伏轨道，交互后暂停）、夜间灯火开关（窗 emissive 联动）、回到全景。
- 待确认项按提示词要求标注在页面 HUD 中未中断交付：three 版本选择、音效素材缺漏、比例数据来源。
- 验证（headless Chromium）：WebGL canvas 创建成功、无致命脚本错误（CDN 失败时页面显示明确网络提示）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--qwen3-8-flash-high-r01`
- 模型：Qwen 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：当前会话直接执行主题任务正文 v1，完整原始输入为该正文的逐字快照，未附加其他材料；批量触发语记录于本 run 的 Readme。
- 工具：Claude Code CLI（当前会话）。模型名称与档位按用户给定登记（qwen3.8-flash / high）；Windows 11 + Node 22，当前会话生成并自检，未委派子代理；实现过程中的自我修正记录于 changes 与 Readme。 迁移到 main 时，按用户确认将测试分支误记的档位从 default 更正为 high。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 3.6 CNY（11 个案例；批次 qwen3-8-flash-high-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/neo-gothic-tower-city/runs/qwen3-8-flash-high-r01/index.html)

### 部署适配记录

- 按提示词要求在页面标注『待确认』：three.js 版本选择、音效素材缺漏、真实比例数据来源未指定（自行取 60–240m 塔群）；其余相机路线与粒子丰富度按审美自行决定。
- 迁移时根据用户确认将误记的 default 档位纠正为 high，并同步更正实验 ID 与路径。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
