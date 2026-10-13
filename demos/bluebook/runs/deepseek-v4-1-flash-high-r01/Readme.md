# 小蓝书 · 瀑布流社区（DeepSeek-V4.1-Flash · high · r01）

构建型纯前端项目。源码在本目录，构建产物由 `npm run build:demo -- bluebook--deepseek-v4-1-flash-high-r01` 生成并提交到 [previews/bluebook/deepseek-v4-1-flash-high-r01](../../../../previews/bluebook/deepseek-v4-1-flash-high-r01/index.html)，无需安装依赖即可通过静态服务器预览。

## 原始提示词

见 [完整原始输入](prompt.md)；任务正文与 [v2 任务正文](../../prompts/v2/prompt.md) 逐字一致。

**版本说明**：主题下有 v1、v2 两个版本，属于同主题下的不同任务——v1 额外要求把图片资源放在 `images` 目录并在编译时自动拷贝、头像做成文字类型；v2 改为 mock 数据 + 不同高度图片。未指定版本时按测试约定使用版本号最大的 v2，v1 未在本轮执行。

## 技术栈与目录

React 18 + TypeScript + Vite + Tailwind CSS + Zustand + react-lazyload。图片为本地 SVG，放在 `public/images/`，Vite 构建时自动拷贝到产物 `images/` 并随预览提交，**不引用任何外部图片数据**。

```
src/
  main.tsx                  入口
  App.tsx                   页面骨架、整体渐入、搜索与发布提示
  index.css                 Tailwind 指令与骨架屏高光样式
  types.ts                  Note / FeedStatus 类型
  data/mock.ts              24 张本地图片尺寸表 + 60 条 mock 笔记 + 内联 SVG 兜底图
  store/useFeedStore.ts     Zustand：分页、状态、点赞与动画计数
  hooks/usePullToRefresh.ts 下拉刷新手势（阻尼、阈值、鼠标与触摸通用）
  components/TopBar.tsx     顶部搜索栏（logo / 搜索框 / 发布）
  components/MasonryGrid.tsx 瀑布流容器、IntersectionObserver 无限滚动
  components/NoteCard.tsx   卡片：图片、标题、文字头像、点赞动画
  components/SkeletonCard.tsx 骨架卡片
  components/LoadingSpinner.tsx 加载动画
  types/react-lazyload.d.ts react-lazyload 的类型补充声明
```

## 需求对照

| 提示词要求 | 实现 |
|---|---|
| React 18 + TypeScript + Tailwind + Zustand + react-lazyload | 全部采用，见 `package.json` |
| 顶部搜索栏：logo「小蓝书」/ 搜索图标 + placeholder「搜索你感兴趣的内容」/ 发布按钮 | `TopBar.tsx` |
| 2 列（移动）/ 3 列（平板）/ 4 列（桌面） | CSS 多列：`columns-2 md:columns-3 xl:columns-4` |
| 卡片：图片宽 100% 高自适应、标题两行截断、24px 圆形头像 + 昵称、点赞数 | `NoteCard.tsx`，图片用 `aspect-ratio` 占位避免布局跳动 |
| 卡片 hover 轻微上浮 + 阴影加深；点击按压效果 | `hover:-translate-y-0.5 hover:shadow-…` 与 `active:scale-[0.985]` |
| 首次加载 20 条、滚动到底部自动加载更多、加载动画 | Zustand 分页 + IntersectionObserver + 骨架屏与圆点动画 |
| 使用 mock 数据，包含不同高度的图片 | `data/mock.ts`，宽高比覆盖 0.53 ~ 1.45 |
| 主色 #fe2c55、背景 #f5f5f5、卡片纯白圆角 8px、适配 iPhone 12+ | `tailwind.config.js` 主题色 + `rounded-card` + 安全区留白 |
| 下拉刷新 | `usePullToRefresh`，带阻尼与「松开立即刷新」提示 |
| 图片加载失败显示默认图 | `onError` 切换到内联 SVG 兜底图 |
| 点赞动画：红心放大再缩小 | 每次点击递增 `likeBumps`，以 `key` 重放 `heart-pop` 动画 |
| 页面切换渐入 | 首屏 `opacity` 过渡 + 每张卡片 `animate-fade-in` |
| 组件拆分、样式处理、数据 mock | 见上方目录 |

## 验收自测

通过本地静态服务器访问构建产物 `previews/bluebook/.../index.html`，用无头 Chromium 核对：

| 检查项 | 实测 |
|---|---|
| 首次加载 20 条 | 20 张 `article` |
| 列数响应式 | 390px → 2 列；820px → 3 列；1440px → 4 列 |
| 滚动到底部自动加载更多 | 20 → 40 → 60 条 |
| 图片加载与高度差异 | 可见卡片图片全部加载成功；宽高比 0.66 / 0.94 / 0.55 / 0.54 / 0.83 / 1.45 |
| 点赞与动画 | 120 → 121（`aria-pressed=true`）→ 再点回 120 |
| 下拉刷新 | 拖动时出现「松开立即刷新」，松开后列表回到 20 条 |
| 图片加载失败兜底 | 指向不存在的图片后 `src` 变为内联 SVG 兜底图 |
| 无脚本错误 | 仅有测试中故意触发的一次 404 资源请求 |
| 横向溢出 | 390 / 820 / 1440 三种宽度下均为 0px |

## 运行与复盘

- 预览：构建产物已提交，用任何静态服务器指向仓库根目录即可访问 `previews/bluebook/deepseek-v4-1-flash-high-r01/`。
- 重新构建：`npm run build:demo -- bluebook--deepseek-v4-1-flash-high-r01`（脚本会在本目录执行 `npm ci` 与 `npm run build -- --base=./`，再把 `dist` 同步到 `previews/` 并记录源码与产物指纹）。
- 本地开发：在本目录 `npm install` 后 `npm run dev`。
- 复盘：两次构建失败在交付前修复，记入 `changes` 的两条依赖适配：① `react-lazyload@3.2.0` 未随包提供 TypeScript 类型，`tsc -b` 严格模式下报 TS7016，补了 `src/types/react-lazyload.d.ts`；② 该库的 `package.json` 并未声明它实际 `require` 的 `prop-types`，导致 Vite 把它当成外部依赖（产物里留下裸模块引用，浏览器必然报错），已把 `prop-types` 显式加入依赖。另外该库的 peerDependencies 只写到 React 17，与正文要求的 React 18 冲突，通过本目录 `.npmrc` 的 `legacy-peer-deps=true` 保留该库。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--deepseek-v4-1-flash-high-r01`
- 模型：DeepSeek-V4.1-Flash；推理档位：high
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：本次批量执行的完整指令 + 主题任务正文；正文与 demos/bluebook/prompts/v2/prompt.md 逐字一致。该主题下有 v1 与 v2 两个版本（v1 额外要求本地 images 目录编译时自动拷贝、头像用文字实现；v2 改为 mock 数据 + 不同高度图片），未指定版本时按测试约定使用版本号最大的 v2，v1 未在本轮执行。
- 工具：Claude Code。模型名称由用户指定为 DeepSeek-V4.1-Flash；会话内模型标识为 deepseek-flash[1m]。单会话直接执行，未委派子代理。Windows 11 + Node 22.16.0。构建产物由 npm run build:demo 生成并提交到 previews/，指纹由脚本记录。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Deepseek 批次合计 2.71 CNY（11 个案例；批次 deepseek-v4-1-flash-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../previews/bluebook/deepseek-v4-1-flash-high-r01/index.html)

### 部署适配记录

- react-lazyload@3.2.0 的 peerDependencies 只声明 React 16/17，与任务正文要求的 React 18 冲突。为保留该库，实验目录内加入 .npmrc 写入 legacy-peer-deps=true，使 npm ci 可以安装；这是为满足任务正文技术栈所做的依赖适配。
- react-lazyload@3.2.0 未随包提供类型声明，tsc 严格模式报 TS7016；新增 src/types/react-lazyload.d.ts 补充最小类型声明。
- react-lazyload@3.2.0 的 package.json 未声明其代码实际 require 的 prop-types，导致 Vite 将其视为外部依赖、产物中残留裸模块引用（浏览器必然报错）；已把 prop-types@15.8.1 显式加入 dependencies。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 工作区）/demos/bluebook/runs/deepseek-v4-1-flash-high-r01；保留原测试轮次 r01 与完整输入快照。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。
<!-- archive:end -->
