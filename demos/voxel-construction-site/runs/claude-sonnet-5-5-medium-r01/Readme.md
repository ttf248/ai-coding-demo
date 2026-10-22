# 体素建筑工地沙盘

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `index.html`，需联网加载 Three.js r160 与 OrbitControls（unpkg）。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- 静态体素合并为一个 InstancedMesh；动态地形、工人也使用 InstancedMesh；机械为少量共享几何的 Mesh。粒子与灯光光晕使用自定义着色器。
- 车辆沿圆角环路行驶并按前车间距让行，装卸点停靠；挖掘机、塔吊、装载机在固定区域作业，用 OBB 检测验证不相交。
- 桌前三个旋钮用 Raycaster 点击切换速度、昼夜循环与尘土强度；空格切换暴雨，数字键 1-4 切换昼夜阶段。

**已知局限与未验证项**

- 提示词自相矛盾（r160 CDN 与“不引用任何外部资源”），实现保留 CDN 引入库。
- 工人与塔吊吊物的碰撞约束为路径/分区设计，非通用物理碰撞；基坑加深与渣土堆增长是按进度同步的视觉表现，并非逐铲土体模拟。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright（SwiftShader）：约 11 FPS 软件渲染下无脚本/着色器错误；按键切换昼夜与空格暴雨有效；运行 30 秒 OBB 检测车辆/挖掘机/装载机无相交，车辆保持在围挡内（最大越界 22.65 < 23.27）。 提示词同时要求“Three.js r160 CDN”与“不引用任何外部资源”，实现采用 CDN 引入 Three.js 及 OrbitControls，其余几何/材质/贴图均由代码生成。未验证真实 GPU 上 60FPS。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Anthropic 批次合计 $0.60 USD（11 个案例；原始消耗 3 percent，换算比例 20 USD / 100 percent；批次 claude-sonnet-5-5-medium-r01；未记录单案例费用）
- [主页面](../../../../demos/voxel-construction-site/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

- 从 F:\dev\ai-coding-demo-test 的 experiment/claude-sonnet-5-5-medium-r01（a7e690a3c5696ecd6a1c4532dd170308e2169401）迁入当前 main；保留实验产物、原始输入和源分支已记录的验证结果。
- 2026-10-12: 在当前 main 的本地 HTTP 预览中，以 Chromium 1440×1000 补拍实际运行桌面图 preview-2026-10-12.png；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
