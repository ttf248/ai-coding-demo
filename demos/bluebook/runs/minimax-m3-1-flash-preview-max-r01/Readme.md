# 小蓝书瀑布流社区

## 原始提示词

见 [本次原始提示词](prompt.md)。

采用 bluebook 主题的 v2 提示词：该主题同时存在 v1 与 v2，按照 `docs/model-test-workflow.md` 中「没有指定时使用版本号最大的版本」的规则取 v2。本目录的 `prompt.md` 与 `demos/bluebook/prompts/v2/prompt.md` 逐字节一致，未做任何删改。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成全部源码，未委派子代理。
- 工程：独立的 Vite + React 18 + TypeScript 工程，自带 `package.json` 与 `package-lock.json`，不与仓库根依赖合并。
- 构建：仓库根目录执行

  ```sh
  npm run build:demo -- bluebook--minimax-m3-1-flash-preview-max-r01
  ```

  该脚本会先在本实验内 `npm ci`，再执行 `npm run build -- --base=./`（即 `tsc --noEmit && vite build`），最后把 `dist/` 复制到 `previews/bluebook/minimax-m3-1-flash-preview-max-r01/` 并写入 `build-info.json` 指纹。
- 入口：实验内源码入口为 `index.html`，构建后的预览入口为 `previews/bluebook/minimax-m3-1-flash-preview-max-r01/index.html`。

> 注意：本实验的 `index.html` 是 **Vite 源码入口**，其中 `<script type="module" src="/src/main.tsx">` 需要经 Vite 处理才能运行，直接用静态服务器打开会请求 `/src/main.tsx` 并得到 404。`run.json` 中 `preview.kind` 为 `build`，站点与目录里登记、指向的都是 `previews/` 下的构建产物，不是这个源码入口。本地开发请用 `npm run dev`。

### 源码结构

```
src/
  main.tsx                 React 挂载
  App.tsx                  页面骨架、渐入动画、空态与 toast
  index.css                Tailwind 入口与基础样式
  types.ts                 Note 类型
  react-lazyload.d.ts      react-lazyload 的类型声明（该包不自带类型）
  data/mock.ts             定长种子生成的 120 条 mock 数据、本地 SVG 头像
  store/useFeedStore.ts    Zustand：分页、刷新、搜索、点赞
  hooks/useInfiniteScroll.ts  IntersectionObserver 触底加载
  lib/layout.ts            列数断点、卡片宽度、高度估算
  lib/fallback.ts          加载失败的本地兜底图
  components/              TopBar / PullToRefresh / WaterfallGrid /
                           NoteCard / LazyImage / FeedStates / Icons
```

### 实现要点

- **列数断点**：`< 640px` 两列、`640–1023px` 三列、`≥ 1024px` 四列，与提示词一致。列数由容器实测宽度（ResizeObserver）决定，不依赖媒体查询硬写。
- **分列策略**：每张卡片按估算高度投递到当前最矮的一列，而不是用 CSS `columns`。CSS 多列的阅读顺序是「先填满第一列」，与瀑布流的预期顺序不同。
- **不跳位**：卡片高度由 mock 数据的原始宽高比推算并提前占位，`react-lazyload` 真正加载完成后不会发生布局跳动。
- **分页**：首屏 20 条，触底哨兵进入视口 500px 内时再追加 20 条，共 120 条，到底后显示「已经到底啦」。
- **下拉刷新**：监听 window 的 touch 事件并带 0.42 阻尼，只有在页面已到顶部且手指继续下拉时才 `preventDefault` 接管，否则交还浏览器正常滚动。阈值 72px 触发。
- **图片兜底**：加载失败时切换为内联的本地 SVG（data URI），不依赖任何网络地址。
- **点赞动画**：红心先放大到 1.45 倍再回弹，图标以自增 `key` 重新挂载，保证连续点击每次都能重新播放动画。

### 验证记录

用 Playwright（chromium）打开构建产物 `previews/bluebook/.../index.html` 实测：

| 项目 | 结果 |
| --- | --- |
| 390px / 800px / 1440px 列数 | 2 / 3 / 4，均符合预期 |
| 首屏卡片数 | 20 |
| 触底加载 | 20 → 40 → 60，每次 +20 |
| 下拉刷新（CDP 触摸事件） | 出现「松开立即刷新」，松手进入「正在刷新…」，完成后首条由 `n001` 变为 `n038`，卡片数回到 20 |
| 点赞 | 未跨千分位的卡片 891 → 892，`aria-pressed` 正确切换，可再次点击取消 |
| 搜索 | 搜「桌面」得 3 条；无匹配时出现空态；清空后回到 20 条并可继续滚动加载 |
| 图片失败兜底 | 触发 `error` 后 `src` 切到 `data:image/svg+xml` |
| 图片加载 | 移动端 26 张图全部加载成功，0 失败 |
| 390px 横向溢出 | `scrollWidth == clientWidth == 390` |
| 控制台错误 | 0 |

### 已知限制

- 卡片图为 `picsum.photos` 的固定 seed 外链，需要联网；头像为本地生成，不联网。
- 下拉刷新是触摸手势，用鼠标拖拽不会触发。
- 发布按钮只给出提示浮层，没有接入真实发布流程（静态原型的边界）。

### 过程中修掉的真实问题

1. `react-lazyload@3.2.1` 在运行时 `require('prop-types')`，但其 `package.json` 没有声明该依赖。Vite 打包后产物里留下了裸 `import from "prop-types"`，离线打开会 404。已在本工程显式补充 `prop-types@15.8.1`。
2. 作者头像最初用 `i.pravatar.cc`，实测该服务返回带跨源资源策略的响应，12 个请求全部被浏览器拦为 `ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`。改为按昵称本地生成 SVG 剪影头像。
3. `useInfiniteScroll` 写的是默认导出，`App.tsx` 却按具名导入；`TopBar` 使用图标但漏了 `Icons` 的 import。两者都由 `tsc --noEmit` 在构建前拦下。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：按 docs/model-test-workflow.md「没有指定时使用版本号最大的版本」取 v2。本目录 prompt.md 与 demos/bluebook/prompts/v2/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code / MiniMax-M3.1-Flash-Preview。Node 22 + npm ci（独立 lockfile）；tsc --noEmit 类型检查通过后 vite build 产出 dist，再由 npm run build:demo 复制到 previews/bluebook/minimax-m3-1-flash-preview-max-r01/。图片用 picsum.photos 与 i.pravatar.cc 的固定 seed 外链，因此 preview.network 为 required。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。 实测：2/3/4 列响应式正确，首屏 20 条、滚动到底依次 20→40→60，下拉刷新会更换内容并回到 20 条，点赞数值 +1，搜索可过滤且空态正确，图片失败自动切换本地兜底图，390px 下无横向溢出。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [瀑布流主页](../../../../previews/bluebook/minimax-m3-1-flash-preview-max-r01/index.html)

### 部署适配记录

- 按提示词选用了 v2 提示词（该主题存在 v1/v2 两版，未指定时取版本号最大的一版）；实际输入保存在本目录 prompt.md，与 demos/bluebook/prompts/v2/prompt.md 逐字节一致。
- react-lazyload@3.2.1 在运行时 require('prop-types')，但其 package.json 未声明该依赖，构建产物会留下裸 ESM import 导致离线 404；在本项目 package.json 中显式补充 prop-types@15.8.1 修复。
- 瀑布流按容器实测宽度分列（ResizeObserver），卡片按估算高度投递到当前最矮列，而不是用 CSS columns，避免列序从上到下与阅读顺序不一致。
- 卡片图片高度由 mock 数据的原始宽高比推算并提前占位，懒加载完成后不发生布局跳动。
- 搜索框接了真实过滤（标题 + 昵称），下拉刷新会更换 mock 起始偏移；发布按钮给出提示浮层而非空按钮，这两处提示词未明确要求，按原型完整性补齐。
- 头像最初用 i.pravatar.cc，实测该服务返回带跨源资源策略的响应，在浏览器中 12 个请求全部被拦为 ERR_BLOCKED_BY_RESPONSE.NotSameOrigin；改为按昵称本地生成 SVG 剪影头像，去掉该第三方依赖，移动端 26 张图 0 失败、0 控制台错误。
- 修复两处使 tsc 报错的问题：useInfiniteScroll 导出为默认导出但按具名导入，以及 TopBar 漏引 Icons。
<!-- archive:end -->
