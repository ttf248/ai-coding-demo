# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v2）。

## 运行与复盘

- 运行方式：本目录 `npm ci` 后 `npm run dev` 本地开发，`npm run build` 产出 `dist/`。站点预览使用已提交的 `previews/bluebook/qwen4-max-preview-xhigh-r01/`（根目录 `npm run build:demo -- bluebook--qwen4-max-preview-xhigh-r01` 可重建），无需构建即可在 GitHub Pages 打开。
- 入口：`index.html`（Vite 入口，`base: "./"` 支持子路径托管）。
- 实现要点：
  - React 18 + TypeScript + Tailwind CSS v3 + Zustand + react-lazyload + Vite；独立 `package-lock.json`。
  - 80 条 mock 笔记（标题 / 作者 / 渐变 SVG 封面，高度 300–560 交错），首屏 20 条；Zustand 管理顺序、可见数量、点赞、搜索词与刷新种子。
  - 瀑布流用 CSS columns（移动 2 列 / md 3 列 / lg 4 列），卡片 8px 圆角、标题两行截断、作者头像取首字 + 底色。
  - 无限滚动：IntersectionObserver（rootMargin 300px）哨兵触发 loadMore（600ms 模拟延迟）；移动端触摸下拉刷新（阈值 70px，700ms 后按种子重排）。
  - 搜索按标题或作者 OR 过滤；点赞 heart-pop 动画 + aria-pressed；图片懒加载占位高度防跳动，加载失败回退 `images/fallback.svg`。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器 + 构建产物，脚本断言）：
  - 构建成功，`dist/` 与 previews 同步提交；首屏 20 张卡片、logo / 搜索框 / 发布按钮齐全。✔
  - 8px 圆角、两行截断、columns-2 → md:3 → lg:4 断点类名生效。✔
  - 搜索「咖啡」命中 6 条（标题 + 作者「咖啡练习生」OR 匹配），清空恢复 20 条。✔
  - 点赞 120 ↔ 121 切换、aria-pressed 同步（React 异步渲染需等待一帧后断言）。✔
  - 20 张 SVG 封面全部 200；懒加载占位存在；img 派发 error 事件后 src 变为 `./images/fallback.svg`。✔
  - 修复记录：react-lazyload 运行时依赖 prop-types 但未声明，构建产物出现裸 `from"prop-types"` 导致白屏；在 dependencies 显式加入 prop-types ^15.8.1 后重建解决。
  - 内置浏览器视口为 0×0，IntersectionObserver 触发、下拉刷新手势与 390px 布局留待 Playwright（`npm run test:browser` 与最终浏览器检查）复核。
- 复盘：CSS columns 实现瀑布流最简单且天然响应式，代价是列内顺序按列填充（可接受）；懒加载必须给定占位高度否则滚动跳动。第三方库的隐式 peer 依赖（prop-types）要在构建产物里检查裸模块引用，不能只看 tsc 通过。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：批量指令原文与任务正文 v2 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户迁入时确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用和 Token 未提供，不分摊至单案例；其余执行条件为源记录声明。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [小蓝书首页](../../../../previews/bluebook/qwen4-max-preview-xhigh-r01/index.html)

### 部署适配记录

- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交工作区迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入字节与源复盘，不合并测试基线。
- 2026-11-13：迁入后追加 defer 公共统计引用，补采真实页面并按现行 v3 由 Codex 逐图视觉复核；源码声明和截图不等同完整功能验收。
- 2026-11-13：Vite 构建将统计源码路径四级回退适配为 previews 三级回退，保留相对 base 并重新构建。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。 滚动范围有界，不穷尽无限列表；保留图片空槽和本地几何 SVG mock，不替换原始素材。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
