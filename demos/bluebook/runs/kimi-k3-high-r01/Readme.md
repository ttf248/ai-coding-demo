# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：构建型纯前端。源码在本目录，`npm ci && npm run build` 产出 `dist/`（相对 base），站点预览使用 `previews/bluebook/kimi-k3-high-r01/`。**图片依赖 picsum.photos**，离线时走「图片加载失败」默认图兜底。
- 入口：构建产物 `index.html`
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 需求覆盖：
  - 顶部搜索栏：「小蓝书」logo、带搜索图标与指定 placeholder 的搜索框（本地过滤标题/作者）、右侧发布按钮 ✓
  - 瀑布流：移动端两列 / 平板三列 / 桌面四列；按估算高度贪心分配到最短列；卡片含图片（react-lazyload 懒加载）、两行省略标题、24px 圆形头像+昵称、红心+点赞数；hover 上浮加阴影、点击按压缩放 ✓
  - 数据加载：首次 20 条 mock（不同高度图片），IntersectionObserver 触底自动加载，加载中转圈动画 ✓
  - 样式：主色 #fe2c55、页面底 #f5f5f5、卡片白底 8px 圆角，适配 iPhone 12（375px 起）✓
  - 交互：顶部下拉刷新（触摸手势 + 指示条）、图片 onError 默认图、点赞红心放大再缩小动画、页面渐入 ✓
  - 状态管理集中在 Zustand store；组件拆分为 SearchHeader / Waterfall / NoteCard ✓
- 验证记录：`tsc && vite build` 通过（vite 5.4.21，产物 162 KB JS / 11 KB CSS gzip 前）；`npm run build:demo -- bluebook--kimi-k3-high-r01` 复制 dist 到 previews 并记录指纹。
- 复盘：一次生成完成，未做追加修复。mock 数据使用确定性伪随机，同一会话内稳定；图片为 picsum 外链，失败兜底为本地灰底占位。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整输入即主题任务正文 v2，无附加上下文。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：GitHub Copilot 批次合计 $5.89 USD（11 个案例；原始消耗 883 GitHub Copilot credits，换算比例 10 USD / 1500 GitHub Copilot credits；批次 github-copilot-kimi-k3-high-2026-10-09；未记录单案例费用）
- [小蓝书瀑布流](../../../../previews/bluebook/kimi-k3-high-r01/index.html)

### 部署适配记录

- 2026-10-09 fix：首版构建时 react-lazyload 的 prop-types 未打入产物（运行时 bare import 报错、页面空白）；补登 prop-types 依赖并重建预览后浏览器复测通过（首屏 20 条、触底加载至 40 条、搜索过滤、点赞、390px 无横向溢出）。
- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
