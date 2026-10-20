# AI 情绪日记 App 原型

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- 按产品经理视角先拆出「记录 → 洞察 → 行动」主线，再落到 6 组页面：首页、情绪记录、AI 对话、回顾、我的、速记浮层。
- 记录流程做成四段式：情绪 → 标签 → 能量 → 可选文字，最快 30 秒完成；AI 回应异步生成，不阻塞保存。
- 样式全部使用 Tailwind 工具类，未写内联 style；图标用 FontAwesome，配图用 Unsplash 直链，页面宽 375pt 并预留安全区。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；Tailwind / FontAwesome / Unsplash 走 CDN，需要联网。
- 验证记录：
  - HTML 标题与文件名符合任务要求（canghe_app_prototype.html）。
  - 页面内含 6 个 375×812 手机框，含底部标签栏、顶部导航与安全区处理。
  - Tailwind CDN 与 FontAwesome 正常加载，页面无脚本报错；390px 视口无横向溢出。
- 已知限制：
  - 原型使用 CDN 资源，离线环境下样式与图标会退化；交互以静态展示为主，未接入真实数据。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整任务正文，与 demos/life-diary/prompts/v1/prompt.md 一致；按要求把原型文件命名为 canghe_app_prototype.html。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；Tailwind / FontAwesome / Unsplash 走 CDN，需要联网。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [AI 情绪日记 App 原型](../../../../demos/life-diary/runs/minimax-m3-1-flash-max-r02/canghe_app_prototype.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/life-diary/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
<!-- archive:end -->
