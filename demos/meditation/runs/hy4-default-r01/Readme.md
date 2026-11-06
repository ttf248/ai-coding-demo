# 冥想 iOS App 原型

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

**入口**：[index.html](index.html)。深色玻璃拟态单页原型，需要联网加载 Tailwind CSS CDN、FontAwesome 图标与 Unsplash 配图。

**运行方式**：横向浏览 10 个 iPhone 屏幕（启动、首页、课程分类、每日推荐、播放器、呼吸练习、睡眠、进度、社区、个人中心），每个 mockup 内的按钮与状态相互独立，可直接点击体验。

**实现要点**：`screens` 数组集中描述每屏内容并渲染到统一手机外框；深色渐变、毛玻璃卡片与圆环进度用 Tailwind 工具类 + 少量内联样式实现；播放器进度与呼吸节奏为页面内定时状态，无路由跳转。

**验证记录**：以 Node `vm` + DOM stub 实跑内联脚本并渲染全部屏幕；清理了 header 中未求值的 `${""}` 残留；内联脚本语法检查通过。

**已知限制**：静态原型，音频为模拟进度、无真实音源；外部字体/图标/图片需联网。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--hy4-default-r01`
- 模型：Hy4；推理档位：default
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：完整原始输入取自该主题 prompts 对应版本的任务正文原文，逐字复用；未追加归档要求、系统提示词或额外上下文，输入指纹与共用任务正文一致。 迁移核对：源目录仅保存任务正文快照，未保存发起批量测试的完整指令和会话上下文；不能确认完整输入与其他实验一致。
- 工具：WorkBuddy。用户指定模型名称 Hy4、档位 default，并明确要求使用当前会话直接执行、不委派子代理；本轮在 model-test-base 基线的当前工作区完成，未创建独立克隆。执行日期 2026-11-06。批量范围由 npm run topics:active 取得，testingStatus 为 archived 的 stock-watching 未参与；bluebook 按默认规则使用版本号最大的提示词 v2，其余主题使用 v1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：tencent 批次合计 0（11 个案例；批次 hy4-default-workbuddy-2026-11-06；未记录单案例费用）
- [冥想 App 原型](../../../../demos/meditation/runs/hy4-default-r01/index.html)

### 部署适配记录

- 按原文把全部页面放在同一个 HTML 文件中展示，每屏为独立的 375px 画布。
- 按原文引入 Tailwind CSS CDN 并使用 Unsplash 图片，因此标记需要联网。
- 2026-11-06：从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留 prompt.md 原始字节和模型源码，仅为入口添加公共统计引用。
- 2026-11-06：维护者补采真实桌面、手机及相关操作证据，按现行 v3 逐图完成 AI 视觉复核；评分仅评价可见证据，不代表完整功能或性能验收。
<!-- archive:end -->

## 2026-11-06 迁移复核

来源：`F:/dev/ai-coding-demo-test` 的 `model-test-base` 工作区未提交产物，源基准提交 `452ac588702d3bde24f048fcf47cc5ffa7abb602`。上方实现说明和验证记录沿用源文件，仅代表源测试记录；本次额外验收以此节与 run.json 的证据为准。原始 prompt.md 保持字节不变，完整批量指令和会话上下文未保存，输入完整性记为 partial。

用户提供：Hy4 / default，供应商 tencent，工具 WorkBuddy，整批11例免费、耗时50m 56s；不分摊到单例。

本次已检查 HTTP、Pages 子路径、对比页 iframe、原始输入与截图链接、390px 视口；静态入口额外检查 file://。公共统计引用由维护者补加，测试拦截正式统计。

截图采用现行 v3 规则进行AI逐图视觉复核，得分 90 / 100。

- 完整长图已逐段放大复核；未验证真实音频、计时逻辑和历史统计。
- 回顾图未展示曲线，按可见缺口扣任务覆盖，不推断源码缺失。
- 由Codex完成AI逐图视觉复核；输入仅保存任务正文，非完整会话上下文，评分不代表完整功能验收。
