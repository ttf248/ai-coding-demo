# 小蓝书瀑布流 · Claude Opus 5.5 max

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文为主题提示词 v2。

## 产物说明

- 技术栈：React 18 + TypeScript、Tailwind CSS 3、Zustand 5（`persist` 保存点赞与发布内容）、react-lazyload 3、Vite 8。
- 顶部栏：文字 logo “小蓝书”、带搜索图标的搜索框（placeholder “搜索你感兴趣的内容”）、发布按钮；下方为频道 Tab。
- 瀑布流：小于 768px 两列、768–1023px 三列、1024px 及以上四列。按图片宽高比把卡片放进当前最短列，追加数据时已有卡片位置不变。
- 卡片：图片宽度 100%、高度按宽高比自适应；标题最多两行；24px 圆形文字头像与昵称；红心与点赞数；hover 轻微上浮并加深阴影，按下有缩放反馈。
- 数据：mock API 带 450–900ms 延迟，首屏 20 条，IntersectionObserver 触底加载；每个频道 120 条后显示“已经到底啦”。首屏为骨架屏，加载更多时显示圆点动画。
- 交互：触摸下拉刷新（超过阈值才触发，换一批内容）；桌面端可再次点击当前频道刷新。图片失败时替换为默认图。点赞时红心放大再缩小。频道、搜索切换以及笔记详情页使用渐入效果。
- 额外功能：按标题、正文、作者、标签搜索；发布笔记弹层；hash 路由的笔记详情页，可直接打开链接，按 Esc 或返回关闭，并保留列表滚动位置；回到顶部按钮。
- 图片：`scripts/generate-images.mjs` 生成 24 张本地 SVG 插画（宽 600px、高 450–980px）和默认图，放在 `public/images`，构建时由 Vite 复制，不依赖外部图片服务。
- 移动端：`viewport-fit=cover` 与安全区内边距；搜索框字号 16px，避免 iOS 聚焦时缩放；注册 touchstart 让 iOS 的 `:active` 按压效果生效。

## 运行

```sh
npm ci
npm run dev                 # 本地开发
npm run build -- --base=./  # 产出 dist，可放在任意子路径
npm run images              # 重新生成 public/images 下的 SVG 插画
```

站点预览由仓库根目录执行 `npm run build:demo -- bluebook--claude-opus-5-5-max-r01` 生成。

## 验证记录

- Playwright（Chromium）在 1440×900、900×1000 和 390×844（iPhone 12 尺寸、触摸）下检查：列数分别为 4、3、2；首屏 20 条；滚动加载 40→120 条后显示到底；加载动画；失败默认图；点赞计数与动画；hover 上浮；详情页打开、关闭并保持列表滚动位置；搜索与空结果；频道筛选；发布校验与刷新后保留；深链接；下拉超过阈值才刷新；390px 无横向溢出。
- 开发中修正：react-lazyload 运行时依赖 `prop-types` 但未声明，已补充依赖；Vite 8（Rolldown）下 react-lazyload 默认导出会变成模块对象，由 `src/lazyload.ts` 兼容；详情页评论生成误用有符号位移导致下标越界，改为无符号位移，并为详情页增加错误边界。

## 说明

- mock 数据中每第 23 条故意指向不存在的图片，用来展示默认图，控制台会出现对应的 404，属预期。
- 提示词 v2 没有要求本地图片。为让 Pages 预览离线可用，这里没有使用外部图片服务。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--claude-opus-5-5-max-r01`
- 模型：Claude Opus 5.5；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：第 1 节为用户在当前会话中的原始指令（逐字）；第 2 节为 Agent 据此读取的 demos/bluebook/prompts/v2/prompt.md 任务正文（逐字，未指定版本时取版本号最大的 v2）。Agent 的系统提示与仓库自定义指令未随输入保存；11 个参与主题在同一会话中依次完成，本主题的上下文包含先前主题的工作，因此标记 partial。
- 工具：VS Code · Copilot SDK Agent。模型名称 claude-opus-5.5（目录 slug claude-opus-5-5）与档位 max 由用户在会话中给定，并要求使用当前会话执行全部参与主题。工作区为 F:/dev/ai-coding-demo-test 的 experiment/claude-opus-5-5-max-r01 分支（基于 model-test-base 452ac58），未新建独立克隆；未委派子代理，未查看其他分支、远程或旧实现。会话 2026-10-09 开始，2026-10-10 完成。 迁移来源：F:/dev/ai-coding-demo-test 的 experiment/claude-opus-5-5-max-r01 工作树（HEAD 452ac588702d3bde24f048fcf47cc5ffa7abb602），源记录迁移时未提交；输入快照和已有模型产物按源文件保留。 供应商 GitHub Copilot 与本批消耗由用户确认；原运行工具未记录时保留 unknown.
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：GitHub Copilot 批次合计 $33.29 USD（11 个案例；原始消耗 5826.08 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-claude-opus-5-5-max-2026-10-09；未记录单案例费用）
- [瀑布流首页](../../../../previews/bluebook/claude-opus-5-5-max-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test 的 experiment/claude-opus-5-5-max-r01 工作树（HEAD 452ac588702d3bde24f048fcf47cc5ffa7abb602），源记录迁移时未提交；输入快照和已有模型产物按源文件保留。
- 迁移核验：构建预览通过 HTTP 打开，浏览器未报告脚本错误，1440px 与 390px 宽度无横向溢出；已登记真实桌面截图。
<!-- archive:end -->
