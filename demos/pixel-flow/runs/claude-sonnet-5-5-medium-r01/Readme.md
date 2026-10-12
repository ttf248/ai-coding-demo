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
- [主页面](../../../../demos/pixel-flow/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
