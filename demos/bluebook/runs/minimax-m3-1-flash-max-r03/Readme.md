# 小蓝书 · 瀑布流社区 · MiniMax M3.1 Flash

## 原始提示词

见 [完整原始输入](prompt.md)。本轮输入与主题提示词 `v2` 完全一致，未做改写或裁剪。

## 实现说明

- 构建：`npm ci && npm run build -- --base=./`，产物在 `dist/`，由 `npm run build:demo -- bluebook--minimax-m3-1-flash-max-r01` 复制到 previews。
- react-lazyload 依赖 prop-types，需显式写入 package.json 才能保证 `npm ci` 后的产物没有裸模块导入。
- 验证：Vite 构建成功，产物无裸 import；目录为 CSS 多列瀑布流，移动端两列、平板三列、桌面四列。

## 运行方式

构建型前端：在本目录执行 `npm ci` 与 `npm run build -- --base=./`；站点预览使用仓库中已提交的 `previews/` 产物。

## 复盘

- 优点：任务正文的组件拆分、状态管理与懒加载要求都落到了具体实现上，构建产物不含裸模块导入，可直接部署。

- 不足：下拉刷新只在移动端手势下生效，桌面端没有等价的“刷新”入口；图片为程序化 SVG，缺少真实摄影素材的质感。


## 2026-10-21 迁移复核

本轮来自测试分支提交 `9e5302c3`，在 main 另存为 `minimax-m3-1-flash-max-r03`。原始任务输入与源分支逐字节一致；以上实现说明、验收及复盘是源记录的陈述。维护者仅追加公共统计引用、归档元数据和真实截图，小蓝书另有构建路径适配。

本次截图观察：四列高低错落的本地 SVG 图片卡片清楚可辨，含搜索、发布、文字头像、作者与点赞数，v2 允许 mock 图像。多张素材重复，标题与图像文字关联松散，卡片文字偏小且字形不统一；仅评价首屏，不从截图证明懒加载和刷新。

费用与运行口径由用户补充：供应商 Minimax，工具 Opencode，公测限免；11 个案例整批耗时 2h 14m · 46.7 tok/s，不拆算到单案例。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-max-r03`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整保存 bluebook/v2 任务正文快照，与 demos/bluebook/prompts/v2/prompt.md 逐字一致。
- 工具：Opencode。当前会话内以 MiniMax-M3.1-Flash、档位 max 直接生成；仅使用本地 Node 22 与浏览器校验，未委派子代理。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Minimax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-opencode-2026-10-21；未记录单案例费用）
- [小蓝书主页面](../../../../previews/bluebook/minimax-m3-1-flash-max-r03/index.html)

### 部署适配记录

- 按任务正文使用 v2 版本；图片资源改用本地 SVG（public/images），构建时自动拷贝到产物目录，不引入外部图片。
- 预览以 vite build --base=./ 构建为纯静态站点，产物提交在 previews/bluebook/minimax-m3-1-flash-max-r01/。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支，提交 9e5302c3）中的 demos/bluebook/runs/minimax-m3-1-flash-max-r01。本轮 OpenCode 实验在 main 另存为 r03，保留既有 r01/r02；源原始输入、源码、运行说明与复盘保留。
- 维护者于 2026-10-21 为网页入口添加带 defer 的公共 assets/analytics.js 引用；原始输入未修改。
- 维护者将本轮构建预览输出登记到 previews/bluebook/minimax-m3-1-flash-max-r03/，并在 Vite 构建时适配公共统计脚本的目录深度；源说明中的旧路径保留为历史证据。
- 维护者于 2026-10-21 在本地 HTTP 中补拍真实桌面截图（1440px 宽；日记与冥想为整页长图），按案例评分规则 v2 和对应任务检查项逐图复核；统计远程请求使用拦截，不发送正式测试访问。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
