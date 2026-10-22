# 小蓝书瀑布流图片社区（React 18 + TS）（Qwen3.8 Max · xhigh）

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文版本 [v2](../../prompts/v2/prompt.md)（本轮未指定版本，按流程取版本号最大的 v2）。

## 批次记录

Aliyun 批次合计 91.81 CNY，覆盖 11 个案例，耗时 2h 50m 7s；费用及耗时均为批次总计，不拆分为单案例。

## 运行方式

- 源码在本目录：`npm ci` 后 `npm run dev` 本地开发，`npm run build` 产出 `dist`（`base: "./"`，可放任意子路径托管）。
- GitHub Pages 使用仓库根 `previews/bluebook/qwen3-8-max-xhigh-r01/` 已提交的构建产物，由 `npm run build:demo -- bluebook--qwen3-8-max-xhigh-r01` 生成并记录指纹。
- 运行时零 CDN：Tailwind 编译进 CSS，mock 图片为 `public/images/` 下 48 张不等高本地 SVG（构建时自动拷贝），预览可离线打开。

## 功能对照（任务正文 v2）

- 顶部搜索栏：左「小蓝书」logo、中带图标搜索框（placeholder「搜索你感兴趣的内容」）、右发布按钮（打开发布弹窗，新笔记置顶）。
- 瀑布流：移动端 2 列 / 平板 3 列 / 桌面 4 列（CSS columns）；卡片含不等高图片、两行截断标题、24px 文字头像 + 昵称、红心点赞数；hover 上浮加深阴影、点击按压缩放。
- 数据：首屏 20 条；IntersectionObserver 触底加载 +10 条与 loading 动画；Zustand 管理 feed / 点赞 / 搜索 / 发布状态；react-lazyload 图片懒加载。
- 交互：移动端下拉刷新（释放重排 feed 并渐入重挂载）；图片 onError 回退本地占位图；点赞红心放大-缩小关键帧动画；feed 与弹窗均带渐入效果。
- 样式：主色 #fe2c55、背景 #f5f5f5、卡片纯白圆角 8px；适配 iPhone 12 及以上（390px 验证无溢出）。

## 验证记录

2026-10-14：`tsc --noEmit` 通过；`npm run build:demo` 构建并同步 previews（含 49 个图片资源与 build-info 指纹）。Playwright（Chromium headless）对构建产物冒烟：

- 首屏 20 条、本地图片全部加载、桌面 4 列 / 移动 2 列、390px 无水平溢出。
- 触底自动加载到 30 条；点赞切换计数变化且红心动画类生效；搜索「雪山」过滤命中；发布弹窗提交后新笔记置顶。
- CDP 触摸下拉刷新触发 feedKey 变化（feed 重排渐入）；桌面 / 移动端均无 JS 报错。

## 复盘

- react-lazyload@3.2.1 的包体引用了未声明依赖 prop-types，Vite/Rollup 将其外部化为裸模块导致浏览器运行时报错；在实验依赖中显式安装 prop-types 解决（已记录，属依赖修复而非实现改动）。
- 下拉刷新与发布都通过 feedKey 重挂载 feed 触发渐入，把「页面切换渐入」落实为可感知的状态切换而非一次性入场动画。
- mock 图片用代码生成的不等高 SVG 而非外链图床：保证预览离线可用、瀑布流高度差异稳定可复现，也避免外链不稳定被误判为站点问题。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--qwen3-8-max-xhigh-r01`
- 模型：Qwen 3.8 Max；推理档位：xhigh
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：prompt.md 保留用户会话指令与任务正文（v2）原文；Claude Code 系统提示与仓库 AGENTS.md 项目说明同时生效，系统提示未留存于快照。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型与档位由用户指定为 qwen3.8-max / xhigh，与会话自报一致。本目录独立 lockfile，npm run build:demo 构建并同步 previews；tsc --noEmit 通过。运行时不依赖任何 CDN（Tailwind 编译进 CSS、图片本地），Pages 预览可离线打开。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Aliyun 批次合计 91.81 CNY（11 个案例；批次 qwen3-8-max-xhigh-2026-10-14；未记录单案例费用）
- [小蓝书瀑布流](../../../../previews/bluebook/qwen3-8-max-xhigh-r01/index.html)

### 部署适配记录

- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
