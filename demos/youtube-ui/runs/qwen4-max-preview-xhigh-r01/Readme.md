# YouTube UI 模块参考图

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1）。

## 运行与复盘

- 运行方式：浏览器打开本目录 `index.html`（file:// 或 HTTP 静态托管均可）作为总览入口，再进入各模块。依赖 CDN 加载 Tailwind、Lucide Static 图标与 Unsplash 配图，需联网，非离线。Tailwind CDN 会打印一条「不应在生产使用」的 `console.warn`，属预期，非错误。
- 入口与页面（多页面显式登记）：
  - `index.html` — 总览：产品需求、信息架构、五大模块卡片导航、设计系统与色板。
  - `home.html` — 01 首页模块：推荐流 / 卡片溢出菜单 / 订阅聚合 / 通知中心（4 屏）。
  - `watch.html` — 02 播放模块：播放页 / 评论弹层 / 迷你播放器 / 播放设置（4 屏）。
  - `discover.html` — 03 发现模块：Shorts 竖屏流 / 搜索发现 / 趋势热榜 / 搜索结果（4 屏）。
  - `library.html` — 04 个人中心模块：我的 / 观看历史 / 播放列表详情 / 设置（4 屏）。
  - `studio.html` — 05 创作中心模块：仪表盘 / 数据分析 / 内容管理 / 上传创作（4 屏）。
- 实现要点：
  - 按提示词「每个功能一个 HTML、所有页面横向排列、各自 mockup 边框内独立」：每模块 4 张 375×812（渲染 340×736）iPhone mockup，含动态岛/状态栏/Home 指示条，横向 flex 排列，外层隐藏滚动条。
  - 设计语言：YouTube 深色模式（#0F0F0F）+ 玻璃拟态（backdrop-blur / 半透明白 / 细描边 / 投影），品牌红 #FF0033 用于关键操作与状态；Inter 字体、8pt 间距网格。
  - 技术约束：仅用 Tailwind CDN 工具类（含 arbitrary values），不编写 `<style>`；图标全部走 Lucide Static CDN（`https://unpkg.com/lucide-static@latest/icons/XXX.svg`），深色下用 `invert` 滤镜染白；配图全部 Unsplash；数据图表用内联 SVG（非图标）。
  - 信息架构（产品视角）：底部五栏导航（首页/Shorts/+/订阅/你）贯穿消费侧；创作侧独立四栏（仪表盘/分析/内容/评论）；卡片溢出菜单、底部弹层、迷你播放器、Shorts 手势区等关键交互均有独立屏幕。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器，HTTP 打开，脚本断言）：
  - 6 个页面 Tailwind 均生效（body 背景 #0A0A0A、Inter 字体、玻璃 backdrop-blur(24px)）；控制台仅 Tailwind CDN 预期 warn，无错误。✔
  - 图标与配图：各页 Unsplash 全部加载成功，Lucide 图标无破图（index 14 / home 68 / watch 64 / discover 60 / library 77 / studio 56 张图）。✔
  - 无滚动条：每张手机屏幕 scrollWidth/scrollHeight 与 client 完全一致（溢出 0），内容自适应不出现内部滚动条；页面 body 无水平溢出。✔
  - 横向排列：每模块 4 屏 flex 横排（strip scrollWidth≈1480），外层 overflow-x-auto + 隐藏滚动条。✔
  - 390px 移动端无水平溢出与真机视觉留待 Playwright（内置浏览器视口受限）。
- 待确认 / 说明（按提示词标示并继续，未中断）：
  - 提示词第 4 步「调用 Artifacts 插件可视化预览」：本环境以浏览器直接打开 + 脚本断言替代可视化预览，未调用 Artifacts 插件。
  - 提示词「输出完成后提示用户是否继续」：本轮为批量实验，按工作流一次性完成全部 5 模块，未逐模块暂停询问。
  - Lucide Static SVG 以 `<img>` 引入时 `stroke="currentColor"` 默认黑色，深色主题下统一用 Tailwind `invert` 滤镜染白；个别强调色靠背景/文字而非图标着色。
- 复盘：把复杂产品拆成「消费侧四模块 + 创作侧一模块」既能覆盖 YouTube 核心体验，又便于逐模块对照布局与交互。玻璃拟态在深色底上用半透明白 + 细描边 + 大模糊营造高级质感，品牌红只做点睛避免喧宾夺主。隐藏滚动条 + 屏幕内容精确适配高度，是 UI/UX 参考图「干净无干扰」的关键；横向 mockup 排列让同一功能的多个页面一目了然、互不影响。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：批量指令原文与任务正文 v1 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用与 Token 未提供，不分摊；其他执行条件为源声明。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [总览 · 信息架构](../../../../demos/youtube-ui/runs/qwen4-max-preview-xhigh-r01/index.html)
- [01 首页模块](../../../../demos/youtube-ui/runs/qwen4-max-preview-xhigh-r01/home.html)
- [02 播放模块](../../../../demos/youtube-ui/runs/qwen4-max-preview-xhigh-r01/watch.html)
- [03 发现模块](../../../../demos/youtube-ui/runs/qwen4-max-preview-xhigh-r01/discover.html)
- [04 个人中心模块](../../../../demos/youtube-ui/runs/qwen4-max-preview-xhigh-r01/library.html)
- [05 创作中心模块](../../../../demos/youtube-ui/runs/qwen4-max-preview-xhigh-r01/studio.html)

### 部署适配记录

- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入与复盘，不合并测试基线。
- 2026-11-13：追加 defer 公共统计引用，补采真实截图，按 v3 由 Codex 逐图视觉复核；源声明不等于独立功能验收。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。 静态多屏设计原型，补拍滚动展开实际页面，不证明业务流程可执行。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
