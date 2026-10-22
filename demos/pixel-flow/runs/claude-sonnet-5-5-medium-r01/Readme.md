# 图片粒子化与手势还原

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `index.html`，需联网加载 Three.js r160 与 MediaPipe Tasks Vision（jsDelivr/Google Storage 模型）；摄像头需 HTTPS 或 localhost。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- 内置演示图片，亦可选择本地图片；采样步长决定粒子数（上限 6 万）。粒子 CPU 模拟，Three.js `Points` 渲染。
- 手势：张开手掌=激活力场并还原范围内粒子；握拳=暂停吸引并轻推范围内未还原粒子；食指=精细小范围；双手张开=完整还原。无摄像头时回退为鼠标左键/F 键/Enter/R 键模拟。

**已知局限与未验证项**

- 识别阈值为经验值，未用真实手势数据调参；第一次还原的视觉强度在深色图片上较暗。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright：无摄像头时自动退回鼠标模式，按住左键 2.5 秒后还原约 28%，Enter 完整还原至 100%，R 重新打散至 0%；使用 Chromium 假摄像头时 MediaPipe 模型加载成功并提示就绪。 未用真实摄像头与真实手势验证识别准确率；图片上传路径仅验证事件绑定，未在自动化中上传文件。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Anthropic 批次合计 $0.60 USD（11 个案例；原始消耗 3 percent，换算比例 20 USD / 100 percent；批次 claude-sonnet-5-5-medium-r01；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

- 从 F:\dev\ai-coding-demo-test 的 experiment/claude-sonnet-5-5-medium-r01（a7e690a3c5696ecd6a1c4532dd170308e2169401）迁入当前 main；保留实验产物、原始输入和源分支已记录的验证结果。
- 2026-10-12: 在当前 main 的本地 HTTP 预览中，以 Chromium 1440×1000 补拍实际运行桌面图 preview-2026-10-12.png；按 Enter 展示完整还原（100%）状态后截图；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
