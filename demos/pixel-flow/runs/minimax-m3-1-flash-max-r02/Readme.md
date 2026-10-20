# 图片粒子化与手势还原

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- Canvas 抽取图片像素（可调采样密度），每个粒子记录原位坐标与颜色；初始状态为随机飘散的粒子流。
- MediaPipe Hands 实时识别手部关键点：张开手掌 = 激活力场吸引，握拳 = 暂停，拇指与食指捏合 = 完全还原；力场跟随掌心位置。
- 摄像头不可用（权限拒绝或非安全上下文）时自动降级为鼠标控制，并给出明确状态提示；支持上传本地图片与内置示例图。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；Three.js 与 MediaPipe 均从 CDN 加载，需要联网并通过 HTTP 访问。
- 验证记录：
  - Three.js 正常加载，示例图片被拆分为粒子并渲染，粒子数量与采样密度联动。
  - 鼠标拖动可产生力场并提升还原度；双击触发完全还原，还原度指标随之变化。
  - 摄像头不可用时页面给出降级提示而非报错；390px 视口无横向溢出。
- 已知限制：
  - MediaPipe 模型与 Three.js 走 CDN，且摄像头需要 https 或 localhost；无摄像头环境下手势部分无法实测，仅验证了降级路径。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整任务正文，与 demos/pixel-flow/prompts/v1/prompt.md 一致；任务正文同时提供中英文版本，实现以中文版要求为准。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；Three.js 与 MediaPipe 均从 CDN 加载，需要联网并通过 HTTP 访问。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [图片粒子化与手势还原](../../../../demos/pixel-flow/runs/minimax-m3-1-flash-max-r02/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/pixel-flow/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
<!-- archive:end -->
