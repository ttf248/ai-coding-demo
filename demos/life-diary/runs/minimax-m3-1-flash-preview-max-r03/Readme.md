# 仓河 · AI 情绪日记与生活助手原型

## 原始提示词

见 [完整原始输入](prompt.md)。本轮为模型 minimax-m3-1-flash-preview、档位 max 重跑任务正文 v1。任务正文要求文件名为 `canghe_app_prototype.html`；本仓库按「单文件入口统一 index.html」的归档规范登记为 `index.html`，内容与设计未作改动。

## 运行方式

入口为本目录 `index.html`。Tailwind CSS、Font Awesome 与 Unsplash 均走 CDN，**需要联网**；无构建步骤。

## 实现要点

- 6 张 375×812 基准稿：首页（情绪打分 + AI 洞察 + 一年前今天）、记录（语音转写 + 情绪识别 + AI 追问）、AI 助手对话（含可勾选的三件小事建议）、情绪趋势（曲线 + 构成 + 影响因素）、生活片段（高光卡片 + 月度回顾 + 时间轴）、个人中心（坚持度、隐私设置、徽章）。
- 产品主线是「记录 → 识别 → 回应 → 回看」：记录页把 AI 识别到的情绪与置信度直接摊开，对话页展示 AI 如何基于近 30 天日记给出可执行建议，趋势页再把结论量化。
- 趋势页用内联 SVG 画实际曲线与预测曲线（含渐变面积），构成条与归因条用纯 div 完成，避免额外图表依赖。
- 隐私被放进个人中心的一级项（本地加密、AI 训练数据默认不参与、一键导出），与「AI 情绪记录」这类敏感场景直接相关。

## 验证记录

- 6 张 mockup 全部正常渲染，Tailwind、Font Awesome、Unsplash 均加载成功，控制台无报错。
- 375pt 基准稿宽度一致，内部滚动区域被限制在稿内。
- 390px 移动视口无水平溢出。

## 复盘

**做得好的**：任务正文强调「这些界面需要能直接拿去开发」，因此本轮刻意把 AI 的输出也设计进了界面——置信度标签、追问气泡、可勾选建议、可量化归因，这些是产品文档里最难画清楚的部分，也是这轮最有信息量的部分。

**不足**：
1. 记录页的转写与识别结果是写死的文案，没有体现 AI 识别失败、置信度过低需要用户纠正的分支。
2. 对话页只展示了一轮多轮对话，缺少长对话的滚动定位与历史管理表现。
3. 趋势页的预测曲线是静态贝塞尔曲线，与「实际」曲线没有数据上的关系，属于视觉装饰而非真实分析表达。
4. 首屏出现了未定义的 `text-sub-ish` 类名（Tailwind 里不存在），虽不影响显示但说明命名没有对齐配置。
5. 全部图标使用 Font Awesome，与仓库内其他主题混用 Unicode 图标的做法不一致。

## 批次记录

本批共 11 个主题案例、12 条实验记录（蓝皮书含 v1/v2）；MiniMax Max 五小时额度消耗 44%，token 消耗 60.6M，耗时 57m 10s。测试备注：自我审查五轮。以上为批次总计，不拆分为单条记录。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--minimax-m3-1-flash-preview-max-r03`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 执行模式：按原任务执行；备注：自我审查十轮
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整原始输入，等同于主题任务正文 v1（未增删），保存于本目录 prompt.md。
- 工具：Claude Code。Claude Code 会话内直接执行，模型 minimax-m3-1-flash-preview、档位 max；未使用子代理，未参考任何历史实现或远程分支。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 44 %（Max 订阅套餐五小时额度）（12 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-14；未记录单案例费用）
- [全部原型页](../../../../demos/life-diary/runs/minimax-m3-1-flash-preview-max-r03/index.html)

### 部署适配记录

- 自审第 4 轮：补 prefers-reduced-motion 与 :focus-visible 样式。
- 自审第 3 轮：修正首页未定义的 text-sub-ish 类名，改为显式颜色。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base）/demos/life-diary/runs/minimax-m3-1-flash-preview-max-r01；main 已有该轮号，保留旧记录后迁入为 minimax-m3-1-flash-preview-max-r03。原始输入与产物按源分支复制，prompt.md 未改写。
- 用户提供的本批测试备注：自我审查五轮。
- 迁移截图：源测试分支未登记桌面截图；已在本仓库通过本地 HTTP 入口按实际页面补拍，并在 390px 视口确认无水平溢出（2026-10-14）。
- 迁移说明：源 Readme 中“首次执行”改为“重跑”，因为 main 已有该模型的历史轮次；原始 prompt.md 未改写。
<!-- archive:end -->
