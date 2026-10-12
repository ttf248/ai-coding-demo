# 新哥特式塔楼城市

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `index.html`，需联网加载 Three.js r160（importmap 指向 unpkg）；库加载失败或无 WebGL 时页面给出“待确认”提示。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- 全部几何、纹理（窗户/石材/玫瑰窗）由代码生成；海面、天空、火焰/火星/浪花粒子为自定义着色器；窗光自发光随昼夜滑块变化。
- 默认自动运镜；拖动或按 WASD 切换到自由漫游。粒子丰富度滑块可降低负载。
- “待确认”：提示词未指定真实原型，页面中已标注并按 1 单位=1 米设定典型哥特建筑尺度。

**已知局限与未验证项**

- 约 260 栋房屋共用一种窗户纹理，拉伸后细节较粗；未做碰撞，自由漫游可穿过建筑。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright（SwiftShader）加载约 10 FPS，无着色器或脚本错误；截图确认塔楼、窗光、火星与海面渲染。 页面内以『待确认』标注：未指定真实原型，采用程序化新哥特风格，比例按 1 单位=1 米设定。自由漫游键鼠操作仅做代码级检查，未做真实设备手感验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/neo-gothic-tower-city/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
