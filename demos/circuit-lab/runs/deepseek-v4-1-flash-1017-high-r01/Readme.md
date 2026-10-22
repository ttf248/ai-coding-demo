# 简化电路实验台

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/circuit-lab/prompts/v1/prompt.md`。

## 运行方式

直接用浏览器打开 [index.html](index.html)，或通过任意静态服务器访问。无外部依赖，可离线运行。

## 实现与验证

- SVG 画布放置电池、电阻、灯泡、开关；拖动元件，点击两个端子连线，点击元件/导线编辑或删除。
- 导线与闭合开关按理想导体处理；灯泡按固定 120 Ω 电阻建模；使用 MNA 对每个连通子网络求解。
- 内置“运行验收自检”，覆盖 12 V 串联 100/200 Ω、并联 0.12/0.06/0.18 A、开关断开、电源短路与冲突理想电源。
- 在 Chromium 中验证了端子连线、拖动、删除、开关切换、串联/并联/开关灯预设，以及 390 px 移动端无横向溢出。

## 复盘与边界

只支持理想直流电源、电阻、开关、灯泡与理想导线；不支持交流、电容、电感、半导体。短路、冲突理想电源或无唯一解时只显示提示，不输出伪造的有限电流。触摸端子的命中区域已放大，适合小屏操作。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：用户消息与 demos/circuit-lab/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [简化电路实验台](../../../../demos/circuit-lab/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
