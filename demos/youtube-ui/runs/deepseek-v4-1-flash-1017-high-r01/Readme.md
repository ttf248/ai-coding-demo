# YouTube UI 模块

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/youtube-ui/prompts/v1/prompt.md`。

## 运行方式

通过 HTTP 打开 [index.html](index.html)。Tailwind CSS、Lucide Static 图标与 Unsplash 图片需要联网。

## 实现与验证

- 8 个独立的 375 × 812 mockup：首页信息流、Shorts、播放页、搜索、频道、媒体库、上传发布、个人中心/Premium。
- 深色画布 + 玻璃拟态浮层；视频缩略图、频道、评论、推荐与上传流程均为完整的视觉 mockup。
- 使用 Lucide Static CDN 图标与 Unsplash 图片；页面无可见滚动条。
- 验证：8 个 mockup 完整渲染、图标与图片加载、390 px 无页面横向溢出。

## 复盘与边界

任务正文没有给出具体的 APP 需求，本实验依据主题“YouTube UI 模块”设计了 YouTube 移动端概念界面，并在页面底部注明“非官方产品、内容均为原型演示”。不连接真实 YouTube 数据，也不包含真实播放或上传后端。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：用户消息与 demos/youtube-ui/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [YouTube UI 模块](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 按提示词使用 Lucide Static CDN 图标；所有 mockup 独立 375×812。
- 任务正文未指定具体 APP 需求，依据主题与任务上下文设计 YouTube 移动端界面，并在页面中注明为概念设计。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
