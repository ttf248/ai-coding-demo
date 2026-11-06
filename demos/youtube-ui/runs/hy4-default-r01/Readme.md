# YouTube UI 模块原型

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

**入口**：[index.html](index.html)。需要联网加载 Tailwind CSS CDN、Lucide Static 图标与 Unsplash 缩略图。

**运行方式**：按「首页 / 观看页 / 探索 / 我的 / 创作者工作室」5 个功能模块分组展示共 18 个页面；每组页面横向排布，各 mockup 交互独立；每组末尾给出「✔ 本功能的 N 个页面已输出完成。是否继续查看下一个功能？」的分段提示。

**实现要点**：`modules` 数组按模块组织 `pages`，`icon()` 用 `<img src="https://unpkg.com/lucide-static@latest/icons/<name>.svg">` 引入图标而不手写 SVG path；视频卡、Shorts 竖滑区、评论区、频道数据与后台表格均为页面内模板；导航高亮与弹层状态在各 mockup 内独立维护。

**验证记录**：以 Node `vm` + DOM stub 实跑内联脚本并渲染全部模块；修复了探索首页残留的无效占位 `.map? "": ""`（已补全兴趣网格与「为你推荐」视频卡），并删除多余的后续 replace 修正块；内联脚本语法检查通过。

**已知限制**：静态高保真原型，视频不播放、数据为 mock；Tailwind/Lucide/Unsplash 需联网，离线时图标与缩略图缺失。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--hy4-default-r01`
- 模型：Hy4；推理档位：default
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整原始输入取自该主题 prompts 对应版本的任务正文原文，逐字复用；未追加归档要求、系统提示词或额外上下文，输入指纹与共用任务正文一致。 迁移核对：源目录仅保存任务正文快照，未保存发起批量测试的完整指令和会话上下文；不能确认完整输入与其他实验一致。
- 工具：WorkBuddy。用户指定模型名称 Hy4、档位 default，并明确要求使用当前会话直接执行、不委派子代理；本轮在 model-test-base 基线的当前工作区完成，未创建独立克隆。执行日期 2026-11-06。批量范围由 npm run topics:active 取得，testingStatus 为 archived 的 stock-watching 未参与；bluebook 按默认规则使用版本号最大的提示词 v2，其余主题使用 v1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：tencent 批次合计 0（11 个案例；批次 hy4-default-workbuddy-2026-11-06；未记录单案例费用）
- [YouTube UI 模块原型](../../../../demos/youtube-ui/runs/hy4-default-r01/index.html)

### 部署适配记录

- 按原文把每个功能的所有页面写入同一 HTML，并为每页创建简单 mockup 边框横向排列；mockup 内不出现滚动条，交互限定在各自画布内。
- 图标全部通过 Lucide Static CDN 的 img 引入，未手动输出 SVG 路径；按原文引入 Tailwind CSS CDN 与 Unsplash 图片，标记需要联网。
- 每组末尾保留「本功能页面已输出完成，是否继续」的提示与跳转，对应原文的逐步输出流程。
- 2026-11-06：从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留 prompt.md 原始字节和模型源码，仅为入口添加公共统计引用。
- 2026-11-06：维护者补采真实桌面、手机及相关操作证据，按现行 v3 逐图完成 AI 视觉复核；评分仅评价可见证据，不代表完整功能或性能验收。
<!-- archive:end -->

## 2026-11-06 迁移复核

来源：`F:/dev/ai-coding-demo-test` 的 `model-test-base` 工作区未提交产物，源基准提交 `452ac588702d3bde24f048fcf47cc5ffa7abb602`。上方实现说明和验证记录沿用源文件，仅代表源测试记录；本次额外验收以此节与 run.json 的证据为准。原始 prompt.md 保持字节不变，完整批量指令和会话上下文未保存，输入完整性记为 partial。

用户提供：Hy4 / default，供应商 tencent，工具 WorkBuddy，整批11例免费、耗时50m 56s；不分摊到单例。

本次已检查 HTTP、Pages 子路径、对比页 iframe、原始输入与截图链接、390px 视口；静态入口额外检查 file://。公共统计引用由维护者补加，测试拦截正式统计。

截图采用现行 v3 规则进行AI逐图视觉复核，得分 92 / 100。

- 源输入未包含具体APP需求补充，按已保存正文和实际视频原型评价，不补造对话。
- 横向与纵向补拍均保留，未证明所有局部按钮或真实视频播放。
- 由Codex完成AI逐图视觉复核；输入仅保存任务正文，非完整会话上下文，评分不代表完整功能验收。
