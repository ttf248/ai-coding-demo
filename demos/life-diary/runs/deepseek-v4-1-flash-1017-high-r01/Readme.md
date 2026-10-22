# 生活情绪日记

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/life-diary/prompts/v1/prompt.md`。

## 运行方式

通过 HTTP 打开 [index.html](index.html)，会自动跳转到 `canghe_app_prototype.html`。页面使用 Tailwind CSS CDN、Font Awesome（jsDelivr）与 Unsplash 图片，需要联网。

## 实现与验证

- 9 个独立的 375 × 812 iPhone mockup：欢迎、今日首页、情绪打卡、AI 对话、日记时间线、日记详情、情绪洞察、陪伴花园、个人中心。
- 页面包含产品目标、用户场景、信息架构、设计原则、组件与开发交付标注。
- AI 对话包含边界说明与危机求助提示；个人中心包含隐私、导出与数据删除入口。
- Chromium 验证：9 个 mockup 完整渲染、图片与图标加载、390 px 无页面横向溢出。

## 复盘与边界

这是 UI/UX 原型，不是可运行 App；AI 文案与数据均为演示内容。Tailwind、Font Awesome 与 Unsplash 依赖网络。每台设备框内可滚动，页面本身在窄屏横向滑动查看。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：用户消息与 demos/life-diary/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [生活情绪日记](../../../../demos/life-diary/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 按提示词要求保留 canghe_app_prototype.html 文件名；新增 index.html 作为站点统一入口并重定向到该文件。
- Font Awesome 改用 jsDelivr CDN（cdnjs 在测试环境中加载不稳定）。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
