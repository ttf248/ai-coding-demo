# 小蓝书 · 瀑布流图片社区（任务正文 v1 · 本地图片资源版）

仿小红书的移动端瀑布流图片社区，React 18 + TypeScript + Tailwind CSS + Zustand + react-lazyload。

## 运行

```sh
npm ci
npm run dev      # 本地开发
npm run build    # 产出 dist/
npm run preview  # 预览构建结果
```

`vite.config.ts` 中 `base: "./"`，构建产物可直接用任意静态服务器托管，也可放在 Pages 子路径下。

## 图片资源

`public/images/` 存放 20 张本地 JPG（600px 宽，高度 600–1100 不等），构建时由 Vite 整体拷贝到 `dist/images/`。数据层只引用 `./images/xxx.jpg` 相对路径，**不引入任何外部图床或远程图片数据**。用户头像为文字类型（昵称首字 + 渐变底色），同样不依赖外部素材。

## 目录结构

```
index.html                     入口
public/images/                 本地图片资源（编译自动拷贝）
src/main.tsx                   挂载入口
src/App.tsx                    页面骨架：搜索栏 / 瀑布流 / 加载更多 / 下拉刷新
src/data/notes.ts              mock 数据与本地图片清单
src/store/useAppStore.ts       Zustand 状态：列表、分页、搜索、点赞、刷新
src/components/SearchBar.tsx   顶部搜索栏（logo / 搜索框 / 发布按钮）
src/components/NoteCard.tsx    卡片：懒加载图片、标题截断、文字头像、点赞动画
src/components/RefreshIndicator.tsx  下拉刷新指示器
src/components/usePullToRefresh.ts   下拉刷新手势
src/components/FooterStates.tsx      加载中 / 无更多 / 空状态
src/index.css                  Tailwind 入口与瀑布流列数、下拉动画
```

## 实现要点

| 需求 | 位置 |
|---|---|
| 2 / 3 / 4 列响应式瀑布流 | `src/index.css` 的 `.masonry`，`column-count` 三档断点 |
| 图片懒加载 | `react-lazyload` 的 `LazyLoad`，按 mock 数据里的真实宽高占位，避免高度跳动 |
| 首次 20 条 + 滚动加载 | `PAGE_SIZE = 20`，`IntersectionObserver` 观察哨兵元素，`rootMargin: 320px` 提前预取 |
| 搜索 | 输入防抖 320ms，匹配标题 / 昵称 / 标签，命中后列表整体渐入 |
| 下拉刷新 | 触摸手势 + 0.45 阻尼，阈值 72px，触发后重置为第一页并清空点赞 |
| 图片加载失败 | `onError` 切换到内联 SVG 占位图（图片图标 + 提示文案） |
| 点赞动画 | 点击后红心 `animate-pop` 放大再缩小，计数 +1，可取消 |
| 页面切换渐入 | `main` 元素以 `query` 为 key，切换搜索时重新挂载并播放 `animate-fade-in` |
| 卡片 hover / 按压 | `hover:-translate-y-1 hover:shadow-card-hover` 与 `active:scale-[0.98]` |
| 安全区适配 | `body` 底部 `env(safe-area-inset-bottom)` |

## 已知边界

- 数据是本地 mock，点赞与搜索都在前端完成，没有后端持久化。
- 刷新后回到第一页，滚动位置不保留。
- 移动端断点以 640px / 1024px 划分，面向 iPhone 12 及以上机型验证，桌面端为四列。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：用户指令、覆盖范围确认与任务正文 v1 原文均已完整留存，无图片、附件或历史上下文。
- 工具：Claude Code（当前会话）。模型 MiniMax M3.1 Flash Preview，推理档位 max，单会话直接执行，未委派子代理。首次产物即为本目录源码，随后只做编译与依赖修复（见 changes），没有功能性返工。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [小蓝书首页](../../../../previews/bluebook/minimax-m3-1-flash-preview-max-r01/index.html)

### 部署适配记录

- 构建修复：react-lazyload 3.2.1 运行时 require('prop-types') 但未在包内声明依赖，Vite 会把它当作外部依赖，产出的 bundle 会出现裸模块导入 `import Jc from "prop-types"` 导致浏览器直接打开失败。在本项目 package.json 显式补充 prop-types 15.8.1。
- 构建修复：补充 @types/react-lazyload 3.2.3 以通过 tsc 类型检查；该类型不提供 width 属性，LazyLoad 占位只传 height。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/bluebook/runs/minimax-m3-1-flash-preview-max-r01；保留该测试轮号。
<!-- archive:end -->
