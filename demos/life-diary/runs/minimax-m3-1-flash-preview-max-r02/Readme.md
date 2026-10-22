# AI 情绪日记 App 原型

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/life-diary/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，Tailwind CDN、Font Awesome 6.5.2 CDN 与 Unsplash 图片，**需要联网**。
- 入口：本目录 `index.html`。

### 与提示词的命名差异（重要）

提示词要求产物文件名为 `canghe_app_prototype.html`，但本仓库规定「单文件入口统一使用 `index.html`」。此处遵循仓库规则使用 `index.html`，并在此显式记录该差异，**没有静默改写任务正文**，`prompt.md` 保留的是提示词原文。

### 页面构成

同一个文件内并排放置 8 个页面，每个页面都在自己的设备框内，彼此独立、互不影响：

1. 今日情绪打卡
2. AI 情绪对话
3. 日记编辑器
4. 日记时间线
5. 情绪趋势洞察
6. 生活助手
7. 提醒中心
8. 个人中心

### 产品主线

整条线索是「记录 → 理解 → 干预」：打卡与编辑器负责记录，趋势洞察与 AI 对话负责理解，生活助手与提醒中心负责干预。视觉上用暖白底 + 珊瑚色主色。

### 两条无障碍 / 合规约定

- 情绪色**始终**搭配文字标签，不单独用颜色传达含义。
- AI 对话页与趋势洞察页都带明确的「AI 生成内容」说明与「不构成医学诊断」提示。

### 验证记录

| 项目 | 结果 |
| --- | --- |
| 390px 横向溢出 | 无溢出（`scrollWidth == clientWidth == 390`） |
| 1440px 横向溢出 | 无溢出 |
| 图片破图 | 0（9 张图全部加载） |
| 控制台错误 | 0 |

本条目为静态原型，页面之间的跳转未接线，AI 对话为示意内容。

### 过程中修掉的真实问题

**390px 横向溢出**：`.phone` 固定 375px，叠加外层容器 `px-6` 左右各 24px，合计 423px 超过 390px 视口，导致整页出现横向滚动。改为外层 `px-3 sm:px-6`，并给 mockup 条带容器加 `overflow-x-auto`，窄屏时在条带内部横向滚动而不撑宽页面。装饰性的模糊光斑仍会超出 `.screen` 的右边界，但 `.screen` 本身是 `overflow: hidden`，属于预期内的裁切。


<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--minimax-m3-1-flash-preview-max-r02`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：本目录 prompt.md 与 demos/life-diary/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code 桌面版（MiniMax M3.1 Flash Preview）。单文件原型，Tailwind 与 Font Awesome 走 CDN，因此 network 为 required。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。 复核：390px 与 1440px 下 scrollWidth 均等于 clientWidth，图片无破图，控制台 0 错误。 本轮使用 MiniMax Code 桌面版执行，未使用 Claude Code。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 37 %（Max 订阅套餐五小时额度）（11 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-13；未记录单案例费用）
- [全部页面](../../../../demos/life-diary/runs/minimax-m3-1-flash-preview-max-r02/index.html)

### 部署适配记录

- 提示词要求产物文件名为 canghe_app_prototype.html，与仓库「单文件入口统一 index.html」的规则冲突；此处遵循仓库规则使用 index.html，并在此显式记录该差异，未静默改写任务正文。
- 8 个页面写在同一个 HTML 内，以独立 mockup 边框横向排列，页面之间互不影响。
- 情绪色始终搭配文字标签，不单独用颜色传达含义；AI 对话页与洞察页都带「不构成医学诊断」提示。
- 390px 下 mockup 条带溢出：.phone 固定 375px，叠加外层容器 px-6 左右各 24px，必然超过视口宽度。改为外层 px-3 sm:px-6，并给条带容器加 overflow-x-auto，窄屏时在条带内部横向滚动而不撑宽整个页面。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/minimax-m3-1-flash-preview-max）/demos/life-diary/runs/minimax-m3-1-flash-preview-max-r01；当前 main 已存在该轮号，保留历史并迁入为 minimax-m3-1-flash-preview-max-r02。
- 迁移验证：使用本仓库本地 HTTP 入口补拍实际桌面截图 screenshot.png；Chromium 确认入口可加载且无页面异常，390px 视口横向溢出为 0。
- 迁移验证补充：本 static 入口可通过 file:// 直接打开，Chromium 页面异常为 0。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
