# 小蓝书瀑布流社区原型

## 原始提示词

见 [完整原始输入](prompt.md)（主题任务正文 v2 逐字快照）。本轮批量触发语：“所有的案例 demo 全部都做一遍，模型名称 qwen3.8-flash 档位 high, 用当前会话就好了”。当前会话按 `npm run topics:active` 清单逐主题直接执行；bluebook 取最高版本 v2，模型与档位按用户给定登记。

## 批次记录

Aliyun 批次共 11 个案例，合计 3.6 CNY，耗时 1h 18m 26s；费用和耗时均为批次总计，不拆分为单案例。

## 运行与复盘

- 运行方式：本目录 `npm ci && npm run dev`；Pages/站点预览使用根目录 `previews/bluebook/qwen3-8-flash-high-r01/` 已提交构建产物。构建产物为 ES module，需 HTTP 上下文打开（file:// 直开 previews 会被浏览器 CORS 拦截，这是 Vite 构建型记录的既有约定，不是本条回归）。
- 实现要点：React 18 + TypeScript + Tailwind 3 + Zustand + react-lazyload，Vite 5 打包 base=./。组件拆分 SearchBar/Masonry/PostCard/LazyImage/PublishModal；瀑布流按已知图片比例做“最短列优先”分配（<768 两列、<1024 三列、≥1024 四列）；mock 图片为内联 SVG data URI（不同高度 200–600px），每第 13 条故意指向不存在路径演示失败默认图兜底；下拉刷新为 touch 阈值手势 + 桌面提示；点赞心跳动画、卡片 hover 上浮、按压 scale、内容切换渐入；首屏 20 条，滚动到底自动加载（最多 10 页）；发布按钮可加本地帖子。整体 #fe2c55 / #f5f5f5 / 白卡圆角 8px。
- 构建修复：react-lazyload 3.2.1 运行时引用未声明的 prop-types，首版构建产物残留裸说明符导致白屏；显式补装 prop-types@15.8.1 重建（见 run.json changes）。
- 验证（headless Chromium，HTTP）：首屏 20 卡渲染、点赞 aria-pressed 切换、滚动加载 20→40、390×844 无水平溢出、无 JS 错误。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--qwen3-8-flash-high-r01`
- 模型：Qwen 3.8 Flash；推理档位：high
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：当前会话直接执行主题任务正文 v2，完整原始输入即该正文逐字快照，未附加其他材料；批量触发语记录于本 run 的 Readme。
- 工具：Claude Code CLI（当前会话）。模型名称与档位按用户给定登记（qwen3.8-flash / high）；Windows 11 + Node 22 本地生成源码并构建，未委派子代理。 迁移到 main 时，按用户确认将测试分支误记的档位从 default 更正为 high。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Aliyun 批次合计 3.6 CNY（11 个案例；批次 qwen3-8-flash-high-2026-10-14；未记录单案例费用）
- [主页面](../../../../previews/bluebook/qwen3-8-flash-high-r01/index.html)

### 部署适配记录

- react-lazyload 3.2.1 运行时引用 prop-types 却未在包中解析，首次构建产物残留裸模块说明符；显式补装 prop-types@15.8.1 并重建预览（属必要构建适配修复，已在此登记）。
- 迁移时根据用户确认将误记的 default 档位纠正为 high，并同步更正实验 ID 与路径。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
