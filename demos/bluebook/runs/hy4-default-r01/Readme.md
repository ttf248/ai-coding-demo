# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

**入口**：站点预览为仓库根目录 `previews/bluebook/hy4-default-r01/index.html`（已提交的构建产物）；本目录是源码，不是直接打开的页面。

**运行方式**：在本目录执行 `npm ci && npm run dev` 本地开发；`npm run build` 做类型检查与打包；仓库根目录执行 `npm run build:demo -- bluebook--hy4-default-r01` 会重建预览并写入 `previews/bluebook/hy4-default-r01/build-info.json` 指纹。

**实现要点**：React 18 + TypeScript + Vite 5 + Tailwind CSS + Zustand + `react-lazyload`；瀑布流按窗口宽度切 2/3/4 列，采用「最短列优先」分配；首次 20 条，`IntersectionObserver` 触底自动加载下一页；支持下拉刷新、关键词搜索过滤、点赞放大回弹动画、图片懒加载与渐入；图片为代码生成的 SVG data URI，其中 2 条故意指向缺失路径以验证 `onError` 默认图回退；Vite 使用相对 `base: "./"` 以适应 Pages 子路径。

**验证记录**：`tsc --noEmit && vite build` 成功，71 个模块，产物 `index-CWZCsFJ6.js` 166.13 kB（gzip 55.88 kB）与 `index-DJuAnlGb.css` 15.51 kB；修复后产物中不再残留裸模块引用 `from"prop-types"`，并包含 `checkPropTypes|PropTypes` 打包标记；`npm run build:demo` 已生成 preview 与指纹文件。

**部署适配与已知限制**：`react-lazyload@3.2.0` 的 peerDependencies 只声明到 React 17，与任务要求的 React 18 冲突，因此在本实验目录用独立 `.npmrc` 设置 `legacy-peer-deps=true` 局部放宽；同时显式安装 `prop-types@15.8.1`，避免 Vite 把它当 external 留下浏览器不可解析的裸引用；`react-lazyload` 的类型由 `src/react-lazyload.d.ts` 补齐。修改任何源码或构建配置后需重新 `build:demo`，否则 `validate` 会报 `Stale source build`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--hy4-default-r01`
- 模型：Hy4；推理档位：default
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整原始输入取自该主题 prompts 对应版本的任务正文原文，逐字复用；未追加归档要求、系统提示词或额外上下文，输入指纹与共用任务正文一致。 迁移核对：源目录仅保存任务正文快照，未保存发起批量测试的完整指令和会话上下文；不能确认完整输入与其他实验一致。
- 工具：WorkBuddy。用户指定模型名称 Hy4、档位 default，并明确要求使用当前会话直接执行、不委派子代理；本轮在 model-test-base 基线的当前工作区完成，未创建独立克隆。执行日期 2026-11-06。批量范围由 npm run topics:active 取得，testingStatus 为 archived 的 stock-watching 未参与；bluebook 按默认规则使用版本号最大的提示词 v2，其余主题使用 v1。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：tencent 批次合计 0（11 个案例；批次 hy4-default-workbuddy-2026-11-06；未记录单案例费用）
- [小蓝书瀑布流首页](../../../../previews/bluebook/hy4-default-r01/index.html)

### 部署适配记录

- react-lazyload@3.2.0 的 peerDependencies 仅声明到 React 17，与任务要求的 React 18 冲突；在本实验目录用独立 .npmrc 放宽 peer 解析，并在运行时验证可用。
- 显式加入 prop-types 依赖，避免 Vite 产物残留裸模块引用导致浏览器无法加载。
- 展示图片全部由代码生成的 SVG data URI 提供，不引用外部图片；其中 2 条故意指向缺失路径以验证图片加载失败显示默认图。
- Vite 使用相对 base 构建，Pages 预览采用 previews 中已提交的构建产物。
- 2026-11-06：从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留 prompt.md 原始字节和模型源码，仅为入口添加公共统计引用。
- 2026-11-06：维护者补采真实桌面、手机及相关操作证据，按现行 v3 逐图完成 AI 视觉复核；评分仅评价可见证据，不代表完整功能或性能验收。
- 2026-11-06：维护者在 Vite 构建中适配公共统计脚本相对路径，源码入口使用四级、previews 入口使用三级回退，兼容 Pages 子路径。
- 2026-11-06：为本实验 .npmrc 显式登记 LF checkout 属性，保持跨平台干净检出的源文件构建指纹一致；文件内容保持源目录原样。
<!-- archive:end -->

## 2026-11-06 迁移复核

来源：`F:/dev/ai-coding-demo-test` 的 `model-test-base` 工作区未提交产物，源基准提交 `452ac588702d3bde24f048fcf47cc5ffa7abb602`。上方实现说明和验证记录沿用源文件，仅代表源测试记录；本次额外验收以此节与 run.json 的证据为准。原始 prompt.md 保持字节不变，完整批量指令和会话上下文未保存，输入完整性记为 partial。

用户提供：Hy4 / default，供应商 tencent，工具 WorkBuddy，整批11例免费、耗时50m 56s；不分摊到单例。

本次已检查 HTTP、Pages 子路径、对比页 iframe、原始输入与截图链接、390px 视口；静态入口额外检查 file://。公共统计引用由维护者补加，测试拦截正式统计。

截图采用现行 v3 规则进行AI逐图视觉复核，得分 89 / 100。

- 图片是源产物生成的SVG mock，不是照片；长图中的空槽不能等同于资源加载失败。
- 未穷尽无限流或完整验证点赞、下拉刷新、搜索筛选。
- 由Codex完成AI逐图视觉复核；输入仅保存任务正文，非完整会话上下文，评分不代表完整功能验收。
