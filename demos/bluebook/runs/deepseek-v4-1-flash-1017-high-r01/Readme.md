# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/bluebook/prompts/v2/prompt.md`。

## 运行与构建

本实验是构建型 React 前端，源码位于本目录：

```bash
npm ci
npm run dev      # 本地开发
npm run build    # 生成 dist/
```

已提交的 Pages 预览位于 `previews/bluebook/deepseek-v4-1-flash-1017-high-r01/`，由 `npm run build:demo -- bluebook--deepseek-v4-1-flash-1017-high-r01` 生成。Vite 的 `base` 设为 `./`，以便在仓库子路径下加载资源。

## 实现与验证

- React 18 + TypeScript + Vite + Tailwind CSS；Zustand 管理列表、搜索、点赞与发布；react-lazyload 负责图片懒加载。
- 瀑布流使用 CSS columns：移动端 2 列、平板 3 列、桌面 4 列；卡片包含不同高宽比的程序化封面、两行标题、24 px 头像、昵称与红心点赞。
- 首次加载 20 条模拟数据，滚动到底部自动加载更多；加载动画、到底提示与空搜索结果状态齐全。
- 顶部搜索栏支持实时筛选；发布按钮打开编辑器，可新增一篇笔记并插入瀑布流顶部。
- 移动端支持下拉刷新（触摸手势），刷新后回到首批 20 条；点赞时有缩放动画。
- 图片加载失败时显示带文字的默认占位图；卡片 hover 上浮、点击有按压效果，列表切换有渐入动画。
- Chromium 验证：桌面 4 列 / 移动 390 px 2 列且无横向溢出；搜索、点赞、发布、无限滚动均可用，无控制台错误。

## 复盘与边界

- `react-lazyload@3.2.0` 的 peer 依赖仅声明到 React 17；本实验通过本目录 `.npmrc` 启用 `legacy-peer-deps` 以兼容 React 18，并实际构建运行验证。
- 封面与头像均为代码生成的 SVG data URI，不依赖外部图片；模拟数据只用于演示，没有后端与真实账号。
- 下拉刷新只在触摸设备生效；桌面端可通过浏览器刷新或重新进入页面重置。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：用户消息与 demos/bluebook/prompts/v2/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [小蓝书](../../../../previews/bluebook/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- react-lazyload 3.2.0 的 peer 依赖仅声明到 React 17；在本实验目录添加 .npmrc 启用 legacy-peer-deps，并通过实际构建验证 React 18 下可运行。
- 为便于 GitHub Pages 子路径预览，Vite base 设为 ./。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
