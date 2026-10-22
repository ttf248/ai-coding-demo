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
- 费用记录：Anthropic 批次合计 $0.60 USD（11 个案例；原始消耗 3 percent，换算比例 20 USD / 100 percent；批次 claude-sonnet-5-5-medium-r01；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

- 从 F:\dev\ai-coding-demo-test 的 experiment/claude-sonnet-5-5-medium-r01（a7e690a3c5696ecd6a1c4532dd170308e2169401）迁入当前 main；保留实验产物、原始输入和源分支已记录的验证结果。
- 2026-10-12: 在当前 main 的本地 HTTP 预览中，以 Chromium 1440×1000 补拍实际运行桌面图 preview-2026-10-12.png；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
