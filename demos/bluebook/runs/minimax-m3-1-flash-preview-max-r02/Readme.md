# 小蓝书 · 瀑布流图片社区（任务正文 v2 · Mock 数据版）

按任务正文 v2 生成的仿小红书瀑布流社区。v2 相对 v1 去掉了本地图片目录的要求，改为「使用 mock 数据，包含不同高度的图片」，本实验据此把 mock 数据做成 60 条、覆盖 20 张高度在 600–1100px 之间变化的图片，用于观察真实瀑布流的错落效果。

技术栈：React 18 + TypeScript + Tailwind CSS + Zustand + react-lazyload。

## 运行

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## 目录结构

```
index.html                     入口
public/images/                 20 张本地图片（不同高度），构建时整体拷贝
src/main.tsx                   挂载入口
src/App.tsx                    页面骨架、加载更多、下拉刷新指示器
src/data/notes.ts              mock 数据（60 条 / 20 张图 / 标题·昵称·标签·点赞）
src/store/useAppStore.ts       Zustand 状态：分页、搜索、点赞、刷新
src/components/SearchBar.tsx   顶部搜索栏
src/components/Masonry.tsx     绝对定位瀑布流（2 / 3 / 4 列）
src/components/NoteCard.tsx    卡片：懒加载、标题截断、文字头像、点赞动画
src/components/usePullToRefresh.ts 下拉刷新手势
src/components/Icons.tsx       搜索 / 点赞 / 发布 / loading 图标
```

## 瀑布流实现

与常见的 `column-count` 方案不同，这里用绝对定位自行排版：

1. `ResizeObserver` 观察容器宽度，按 `<640 / <1024 / 其余` 取 2、3、4 列。
2. 每张卡片的高度在渲染前就能算出：`列宽 / (图片宽 / 图片高) + 96px 信息区`，因此图片懒加载期间不会产生布局跳动。
3. 逐张放入当前最矮的一列，容器高度取所有列的最大值。
4. 信息区高度固定 96px，保证高度计算与实际渲染一致。

## 需求对照

| 需求 | 实现 |
|---|---|
| 顶部搜索栏 | `SearchBar.tsx`：文字 logo、搜索图标 + placeholder、发布按钮 |
| 2 / 3 / 4 列瀑布流 | `Masonry.tsx` |
| 卡片 hover 上浮 + 阴影加深 | `hover:-translate-y-1 hover:shadow-card-hover` |
| 卡片按压效果 | `active:scale-[0.97]` |
| 标题最多两行 | `line-clamp-2` |
| 圆形 24px 头像 | `h-6 w-6 rounded-full`，文字头像取昵称首字 |
| 首次 20 条 + 滚动加载 | `PAGE_SIZE = 20`，`IntersectionObserver` 哨兵，`rootMargin: 300px` |
| 加载动画 | `Icons.tsx` 的 SVG spinner，文字 + 图标组合 |
| 下拉刷新 | 0.42 阻尼手势，阈值 70px，指示器随下拉距离旋转 |
| 图片加载失败 | `onError` 切换到内联 SVG 占位图 |
| 点赞动画 | 红心 `animate-pop` 放大再缩小，计数 +1 |
| 页面切换渐入 | `main` 以 `query` 为 key，切换搜索时重挂载并播放淡入 |
| iPhone 12 及以上 | 移动端两列 + `env(safe-area-inset-bottom)` 安全区 |

## 已知边界

- 数据为前端 mock，刷新后回到第一页，点赞不持久化。
- 绝对定位排版在图片尺寸与 mock 数据不一致时会错位，当前数据与 `public/images` 严格对应。
- 桌面端四列面向宽屏验证，未做超宽屏断点。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-preview-max-r02`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：用户指令、覆盖范围确认与任务正文 v2 原文均已完整留存，无图片、附件或历史上下文。
- 工具：Claude Code（当前会话）。模型 MiniMax M3.1 Flash Preview，推理档位 max，单会话直接执行，未委派子代理。与同主题 r01 属于不同任务正文（v2 去掉本地图片目录要求），两者产物互相独立。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [小蓝书首页](../../../../previews/bluebook/minimax-m3-1-flash-preview-max-r02/index.html)

### 部署适配记录

- 构建修复：与同主题 r01 相同，react-lazyload 3.2.1 未声明 prop-types 依赖，需在本项目 package.json 显式补充 prop-types 15.8.1，否则构建产物会残留裸模块导入。
- 构建修复：补充 @types/react-lazyload 3.2.3 以通过 tsc 类型检查。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/bluebook/runs/minimax-m3-1-flash-preview-max-r02；保留该测试轮号。
<!-- archive:end -->
