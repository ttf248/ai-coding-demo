# GLM 5.3 Flash · max 小蓝书瀑布流

## 原始说明

完整原始输入见 [prompt.md](prompt.md)；与主题任务正文 [v1](../../prompts/v1/prompt.md) 一致。本条为 GLM 5.3 Flash（max 档）在该正文下的首次实现记录。

## 运行与复盘

- 运行方式：在本目录 npm ci 后 npm run dev 本地开发；npm run build 产出 dist（tsc 类型检查 + vite build）。
- 复盘：按任务正文逐项实现：React18+TS+Tailwind+Zustand+react-lazyload 全部落地；瀑布流用 CSS columns 实现 2/3/4 列响应；本地图片资源由脚本生成的 24 张 SVG 组成，构建自动拷贝；点赞动画、下拉刷新、懒加载与失败回退均已实现。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--glm-5-3-flash-max-r01`
- 模型：GLM-5.3 Flash；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整输入为主题共享任务正文 v1 快照（prompt.md），指纹与提示词版本一致；无缺失材料。 迁移核对：源目录保存任务正文快照，与 main 的 v1 正文一致；未留存批量测试完整指令或会话上下文，源记录的“无缺失材料”声明无法独立确认，不据此认定完整原始输入一致。
- 工具：Qoder。在 model-test-base 基线新建的 experiment/glm-5-3-flash 分支上以新会话执行；任务正文取自主题 prompts/v1 原文，无多轮追加输入、图片或系统上下文；单会话内独立完成，人工仅做登记与站点校验，未改动实现。 以上为源记录声明；迁移不补造未保存的上下文。模型和 max 档位、接入供应商及工具由用户确认。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：aliyun 批次合计 2.27 CNY（11 个案例；原始消耗 77 积分点，换算比例 59 CNY / 2000 积分点；批次 glm-5-3-flash-max-qoder-2026-11-07；未记录单案例费用）
- [小蓝书瀑布流](../../../../previews/bluebook/glm-5-3-flash-max-r01/index.html)

### 部署适配记录

- 原始输入要求展示图片全部使用本地 images 文件夹资源且构建时自动拷贝：以 scripts/gen-images.mjs 生成 24 张本地 SVG 展示图置于 public/images，Vite 构建自动拷贝到产物。
- 2026-11-07：从 F:/dev/ai-coding-demo-test 的 experiment/glm-5-3-flash 工作区未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留 prompt.md 原始字节、模型源码与源复盘。
- 2026-11-07：维护者为本次导入的 HTML 入口添加 defer 公共统计脚本；补采真实桌面、手机与任务相关状态，按现行 v3 规则由 Codex 逐图进行 AI 视觉复核，源验证声明不等于本次独立验收。
- 2026-11-07：Vite 构建将公共统计路径从源码四级回退适配为 previews 三级回退，重新构建并保留相对 base。
- 2026-11-07：本次可见证据限制：仅扫描初始内部滚动范围前 5400px，不声称穷尽无限列表；未独立验收下拉刷新、点赞动画或搜索业务。 本地 SVG 为模型生成的展示 mock，保留原始素材与留白，不替换成照片。
- 2026-11-07：HTTP、Pages 子路径、对比 iframe、file://、统计初始化及 390px 的逐项验收记录保存于 catalog/score-reviews/2026-11-07-glm-5-3-flash-max.json 的 browserVerification；原型窄屏溢出作为产物缺陷保留。
<!-- archive:end -->

## 本次迁移说明

源复盘和实现声明保留供追溯。源目录仅保存任务正文快照，未保存批量测试完整指令或会话上下文；本次独立预览与截图复核的范围、限制见 run.json，不能将源声明当作完整功能验收。费用与耗时使用批次合计，不拆分到单案例。

本次入口、对比嵌入与移动端的逐项结果见[迁移复核与浏览器验收记录](../../../../catalog/score-reviews/2026-11-07-glm-5-3-flash-max.json)。
