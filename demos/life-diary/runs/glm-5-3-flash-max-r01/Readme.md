# GLM 5.3 Flash · max 情绪日记原型

## 原始说明

完整原始输入见 [prompt.md](prompt.md)；与主题任务正文 [v1](../../prompts/v1/prompt.md) 一致。本条为 GLM 5.3 Flash（max 档）在该正文下的首次实现记录。

## 运行与复盘

- 运行方式：通过 index.html 或直接打开 canghe_app_prototype.html；需联网加载 Tailwind CDN、FontAwesome 与 Unsplash 图片。
- 复盘：任务正文指定文件名 canghe_app_prototype.html，予以保留并另建统一入口 index.html 跳转；8 个页面均按 375px iPhone 基准绘制，图片使用 Unsplash 直链，如个别图片失效不影响布局（有底色兜底）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--glm-5-3-flash-max-r01`
- 模型：GLM-5.3 Flash；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整输入为主题共享任务正文 v1 快照（prompt.md），指纹与提示词版本一致；无缺失材料。 迁移核对：源目录保存任务正文快照，与 main 的 v1 正文一致；未留存批量测试完整指令或会话上下文，源记录的“无缺失材料”声明无法独立确认，不据此认定完整原始输入一致。
- 工具：Qoder。在 model-test-base 基线新建的 experiment/glm-5-3-flash 分支上以新会话执行；任务正文取自主题 prompts/v1 原文，无多轮追加输入、图片或系统上下文；单会话内独立完成，人工仅做登记与站点校验，未改动实现。 以上为源记录声明；迁移不补造未保存的上下文。模型和 max 档位、接入供应商及工具由用户确认。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 2.27 CNY（11 个案例；原始消耗 77 积分点，换算比例 59 CNY / 2000 积分点；批次 glm-5-3-flash-max-qoder-2026-11-07；未记录单案例费用）
- [仓合 App 原型图](../../../../demos/life-diary/runs/glm-5-3-flash-max-r01/canghe_app_prototype.html)

### 部署适配记录

- 任务正文指定文件名 canghe_app_prototype.html，已保留原名并额外提供统一入口 index.html（meta 跳转到该文件）。
- 2026-11-07：从 F:/dev/ai-coding-demo-test 的 experiment/glm-5-3-flash 工作区未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留 prompt.md 原始字节、模型源码与源复盘。
- 2026-11-07：维护者为本次导入的 HTML 入口添加 defer 公共统计脚本；补采真实桌面、手机与任务相关状态，按现行 v3 规则由 Codex 逐图进行 AI 视觉复核，源验证声明不等于本次独立验收。
- 2026-11-07：本次可见证据限制：390px 实测文档宽 407px，存在 17px 横向溢出；保留原始设计，不以迁移修复美化模型产物。 八屏是静态原型，没有独立验证保存、AI 服务、统计计算或内部导航业务。 纵向滚动补拍扫描最多 5400px，桌面已展示全部八屏；不声称覆盖移动端全部滚动状态。
- 2026-11-07：HTTP、Pages 子路径、对比 iframe、file://、统计初始化及 390px 的逐项验收记录保存于 catalog/score-reviews/2026-11-07-glm-5-3-flash-max.json 的 browserVerification；原型窄屏溢出作为产物缺陷保留。
<!-- archive:end -->

## 本次迁移说明

源复盘和实现声明保留供追溯。源目录仅保存任务正文快照，未保存批量测试完整指令或会话上下文；本次独立预览与截图复核的范围、限制见 run.json，不能将源声明当作完整功能验收。费用与耗时使用批次合计，不拆分到单案例。

本次入口、对比嵌入与移动端的逐项结果见[迁移复核与浏览器验收记录](../../../../catalog/score-reviews/2026-11-07-glm-5-3-flash-max.json)。
