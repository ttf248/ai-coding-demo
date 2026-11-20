# 生活情绪日记

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- **运行方式**：静态 HTML 原型展示页，既可打开标准入口 `index.html`，也可打开提示词指定的 `canghe_app_prototype.html`（两者均已登记在预览配置中）。使用 Tailwind CSS、FontAwesome 图标库与 Unsplash 摄影配图，需联网加载外部样式与图片资源。
- **核心设计**：
  1. **产品规划与信息架构**：顶部包含完整的产品需求规划看板（用户痛点洞察、核心功能矩阵、信息架构树与色彩设计规范）。
  2. **6 台 375px iPhone 高保真交互原型机横向/网格陈列**：涵盖「今日心绪首页」、「多模态 AI 情绪记录台」、「AI 心理共情陪伴对话」、「情绪节律与多维洞察周报」、「正念呼吸与感官疗愈舱」以及「时光记忆胶囊与个人中心」，并且各屏幕内部支持真实标签切换、心情打卡、呼吸动效与 AI 对话交互。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--gemini-4-argon-medium-r01`
- 模型：Gemini 4 Argon；推理档位：medium
- 执行模式：按原任务执行；备注：测试目录记录为在当前会话直接按共用任务正文执行。
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：按 demos/life-diary/prompts/v1/prompt.md 原文执行。
- 工具：agy v1.5.13。使用当前会话直接生成（模型 Gemini 4 Argon，档位 medium）。 CLI 版本由维护者提供。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Google 批次合计 金额未记录（11 个案例；原始消耗 24 % Google AI Pro 周额度（Argon 单独计费），换算比例未记录；批次 gemini-4-argon-medium-agy-pro-2026-11-20；未记录单案例费用）
- [主页面](../../../../demos/life-diary/runs/gemini-4-argon-medium-r01/index.html)
- [canghe_app_prototype.html](../../../../demos/life-diary/runs/gemini-4-argon-medium-r01/canghe_app_prototype.html)

### 部署适配记录

- 导入自独立测试目录 ai-coding-demo-test 的 model-test-base 工作树，基线提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。实验文件来自该工作树的未提交产物，保留原始输入快照。
- 归档时为登记的 HTML 入口接入本站公共访问统计。
- 测试工作树无截图。归档时采集真实桌面、手机及适用操作状态，按 v3 逐帧复核并登记桌面封面。
<!-- archive:end -->
