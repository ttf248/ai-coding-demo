# 小蓝书 · 瀑布流社区

## 原始输入

- 完整原始输入：[prompt.md](prompt.md)
- 任务正文版本：[v2](../../prompts/v2/prompt.md)。按测试流程“未指定版本时使用最高版本”，本实验只执行 v2，未执行 v1。
- 输入为会话指令与任务正文原文快照；没有读取其他目录、分支或远程的历史实现。

## 实现说明

- 技术栈：React 18、TypeScript、Vite 5、Tailwind CSS 3、Zustand、react-lazyload。
- 顶部栏：小蓝书文字 logo、搜索框、发布按钮；搜索会过滤标题、作者和分类。
- 瀑布流：移动端 2 列、平板 3 列、桌面 4 列；卡片包含不同高度图片、两行标题、24px 圆形头像、作者、点赞数。
- 数据：本地 mock 初始 20 条，滚动到底自动追加；使用 IntersectionObserver 和 LazyLoad 懒加载。
- 交互：点赞放大动画、卡片按压缩放、图片失败回退、下拉刷新、无限滚动 loading、卡片详情弹层、发布笔记弹层与 toast。
- 卡片封面由本地 SVG 生成器按种子绘制，不依赖远程图片；因此构建预览可离线打开。
- 入口为 [index.html](index.html)，构建配置在 [package.json](package.json)，产物在 `previews/bluebook/deepseek-v4-1-flash-1017-max-r01/`。

## 验证记录

- `npm ci` 与 `npm run build` 通过（Vite 生产构建）。
- Playwright 桌面检查：初始 20 张卡片；点击点赞从 86 变为 87；详情弹层可打开/Esc 关闭；搜索“咖啡”得到 3 张；“发布新笔记”弹层可打开；滚动后追加卡片。
- 390px 视口无页面水平溢出。
- 备注：react-lazyload 3.2.0 的 peer 声明只到 React 17，因此增加 `.npmrc` 的 `legacy-peer-deps=true` 并显式加入 `prop-types`；这是兼容性配置，不改变页面功能。

## 复盘

- 瀑布流使用 CSS columns，配合 LazyLoad 的占位高度，避免固定列高；不同图片比例由数据中的 ratio 控制。
- 图片是程序化 SVG，优点是确定性和离线可用；没有真实摄影素材，但能完整验证布局、比例和懒加载。
- 下拉刷新依赖 touch 事件，桌面端主要用搜索、发布和无限滚动；移动端需要触摸拖动触发。
- 发布弹层会把新笔记插入内存列表，不持久化，符合 mock 演示范围。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--deepseek-v4-1-flash-1017-max-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：包含用户会话指令与任务正文原文；任务正文未改写。 任务正文版本 v2。
- 工具：Claude Code / DeepSeek-V4.1-Flash-1017。当前 Claude Code 会话直接执行，未委派子代理；Windows 11 + Node 22.16.0；模型与档位由用户指定。使用本地 HTTP 静态服务器与 Playwright/Chromium（WebGL 软件光栅器）做加载、交互与 390px 溢出检查；软件光栅器帧率不代表硬件 GPU 表现。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：deepseek 批次合计 4.46 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-max-2026-10-19；未记录单案例费用）
- [主页面](../../../../previews/bluebook/deepseek-v4-1-flash-1017-max-r01/index.html)

### 部署适配记录

- 为 react-lazyload 的 React 17 peer 声明加入 .npmrc（legacy-peer-deps=true），并显式补充 prop-types 依赖，保证 npm ci 与生产构建可用。
- 构建产物由 npm run build:demo 生成并复制到 previews/bluebook/。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017 分支未提交工作区导入本轮 max 档结果；基线提交 452ac58，文件来源指纹见 docs/imports/2026-10-19-deepseek-1017-max.json；未覆盖历史实验。
- 迁移维护者为全部 HTML 入口添加带 defer 的公共 assets/analytics.js 引用；小蓝书配置适配 previews 路径并重新构建。
- 源记录没有截图；迁移时补拍真实桌面页面并按当前 v2 规则逐图复核。费用 ¥4.46、92,462,698 Tokens 与耗时 59m 52s 为用户提供的整批 11 个案例合计，不拆分到单案例。
- 迁移补拍：Chromium 1440×960、deviceScaleFactor=1；默认实际页面。截图页面 index.html，远程统计请求被拦截；软件 WebGL 不作为硬件性能证据。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
