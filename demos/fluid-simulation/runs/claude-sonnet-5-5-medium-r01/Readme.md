# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `index.html`，可 file:// 直接打开，无 CDN。需要 WebGL 与可渲染的半精度/浮点纹理，不满足时显示错误面板。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- 使用 RGBA16F（WebGL2）/ OES_texture_half_float（WebGL1）渲染目标，包含旋度、涡度约束、散度、Jacobi 压力迭代、梯度投影、平流与染料平流；不支持线性过滤时自动手动双线性。
- 限制 DPR ≤ 1.5、画布 ≤ 1600px；分辨率改变与上下文恢复时先释放旧纹理/帧缓冲再重建。

**已知局限与未验证项**

- 未测量真实 GPU 帧率；自动化在软件 WebGL（SwiftShader）下验证。
- 暂停期间不接受注入（按设计）；PNG 截图为当前画布分辨率（受 DPR 与 1600px 上限约束）。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright（SwiftShader 软件 WebGL2）：拖动后染料与速度能量由 0 增长；暂停后读回的染料/速度总量保持不变；清空后均为 0；切换分辨率 128→256 重建缓冲；截图触发下载。 禁用 WebGL 时显示明确错误提示且无空白页；390px 无水平溢出。仅在软件渲染下验证，未测真实 GPU 与移动设备。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/fluid-simulation/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
