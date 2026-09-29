# Nebula UI · YouTube 模块化设计稿（任务正文 v1）

一个视频社区 App（YouTube 风格）的完整 UI/UX 设计稿。先以**产品经理视角**把 App 拆成 7 个功能模块、
定义信息架构与页面关系，再由**设计师视角**逐模块输出高保真稿。

- 每个功能模块一个 HTML 文件，模块内的所有页面横向排列在同一个页面里、每个页面有独立的 mockup 边框、互不影响。
- 共 7 个模块、20 个界面，全部基于 iPhone 标准尺寸 375 × 812。
- 样式全部由 Tailwind CSS CDN 的原子类完成（没有手写 style），图标使用 Lucide Static CDN，图片使用 Unsplash。
- 界面中不出现任何滚动条，但保留惯性滚动。

## 文件

| 文件 | 模块 | 界面 |
|---|---|---|
| `index.html` | — | 7 个模块的索引页 |
| `01-home-recommend.html` | 首页推荐 | 首页推荐流 / 分类落地页 / 观看历史 |
| `02-watch-play.html` | 播放与观看 | 标准播放页 / 短视频全屏流 / 合集与章节 |
| `03-explore.html` | 探索与直播 | 探索首页 / 话题聚合页 / 直播间 |
| `04-subscriptions.html` | 订阅与频道 | 订阅流 / 订阅管理 / 频道主页 |
| `05-studio.html` | 创作中心 | 创作者工作台 / 数据分析 / 发布与编辑 |
| `06-search-notify.html` | 搜索与通知 | 全屏搜索 / 通知中心 / 站内消息 |
| `07-account.html` | 账号与设置 | 我的 / 播放列表与下载 / 设置与无障碍 |

## 信息架构

```
首页推荐 ──┬── 搜索（全屏覆盖层）
           ├── 分类落地页
           └── 观看历史

播放与观看 ── 标准播放页 / 短视频全屏流 / 合集与章节

探索与直播 ── 探索首页 / 话题聚合页 / 直播间

订阅与频道 ── 订阅流 / 订阅管理 / 频道主页

创作中心 ── 创作者工作台 / 数据分析 / 发布与编辑

搜索与通知 ── 全屏搜索 / 通知中心（系统通知）/ 站内消息

账号与设置 ── 我的 / 播放列表与下载 / 设置与无障碍
```

底部 5 个一级 Tab：**首页 / 探索 / 创作 / 订阅 / 我的**。搜索、通知、消息、设置都是覆盖层或二级页，
不占用 Tab 位置。

## 设计规范

| 项 | 值 |
|---|---|
| 底色 | `#070910` |
| 主色 | `#FF4D5E` |
| 辅助色 | `#7C5CFF` |
| 正向色 | `#5FE3B5` |
| 玻璃层 | `rgba(255,255,255,.07)` + 1px `rgba(255,255,255,.12)` 描边 + 18px 背景模糊 |
| 圆角 | 10（控件）/ 16（卡片）/ 24（大卡）/ 36（设备框） |
| 间距 | 4px 栅格，页面左右留白统一 16px |
| 尺寸 | 375 × 812；顶部状态区 44px，底部 Tab 78px（含 20px 安全区） |
| 图片 | Unsplash CDN，统一 2:3 或 16:9 两种裁切 |
| 可点区域 | 不小于 40px |

## 图标

图标全部来自 Lucide Static CDN，例如
`https://unpkg.com/lucide-static@latest/icons/home.svg`。

Lucide 的 SVG 内部写的是 `stroke="currentColor"`，直接用 `<img>` 引入时颜色被固定，无法跟随主题。
因此这里用 CSS mask 着色：

```css
.ic {
  width: 1.15em; height: 1.15em; display: inline-block;
  vertical-align: -0.19em; background-color: currentColor;
  mask: var(--u) center / contain no-repeat;
}
.i-home { --u: url(https://unpkg.com/lucide-static@latest/icons/home.svg); }
```

使用时写 `class="ic i-home text-white"`，图标颜色就会跟着 `text-*` 走，可以和文字一起做颜色切换。

## 与任务正文的偏离

任务正文原本是多轮交互的：每完成一个功能就停下，等待用户输入「继续」再输出下一个功能，
并要求调用【Artifacts】插件可视化预览。本轮一次性输出了全部 7 个模块（用户确认过），
本会话没有 Artifacts 工具，因此产物为可直接双击打开的 HTML 文件。

## 已知边界

- 纯静态稿，界面不可点击，无交互逻辑与真实数据。
- 界面内的数据（播放量、粉丝数、评论）均为示例数据。
- 图表为手写 SVG / div，未接入图表库。
- 只覆盖主流程界面，登录注册、支付、举报、字幕编辑等未包含。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：用户指令、覆盖范围确认与任务正文 v1 原文均已完整留存，无图片、附件或历史上下文。任务正文里的【APP 需求】由模型自行构思（YouTube 风格的视频社区），并在各文件的说明区写明信息架构与产品取舍。
- 工具：Claude Code（当前会话）。模型 MiniMax M3.1 Flash Preview，推理档位 max，单会话直接执行，未委派子代理。任务正文是多轮交互式的（每输出一个功能后停下问「是否继续」，并要求调用 Artifacts 插件预览）；本会话没有 Artifacts 工具，且用户选择一次性连续输出，因此 7 个功能模块连续产出，产物为 HTML 文件，偏离点记录在 changes。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [模块索引（7 个功能）](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/index.html)
- [01 首页推荐](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/01-home-recommend.html)
- [02 播放与观看](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/02-watch-play.html)
- [03 探索与直播](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/03-explore.html)
- [04 订阅与频道](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/04-subscriptions.html)
- [05 创作中心](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/05-studio.html)
- [06 搜索与通知](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/06-search-notify.html)
- [07 账号与设置](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/07-account.html)

### 部署适配记录

- 多轮交互改为一次性连续输出：任务正文要求每完成一个功能就停下等待用户输入「继续」。用户确认本轮一次性完成全部 7 个模块，因此 7 个模块连续产出，中间不再停顿。
- 预览方式：任务正文要求调用【Artifacts】插件可视化预览，本会话没有该工具，改为交付可直接双击打开的 HTML 文件，并在 index.html 汇总 7 个模块的入口。
- 图标着色：Lucide Static CDN 提供的 SVG 固定为 currentColor 描边，直接用 <img> 引入无法跟随主题色。改用 CSS mask（--u 变量 + background-color: currentColor）着色，图标因此能跟随所在容器的文字颜色。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01；保留该测试轮号。
<!-- archive:end -->
