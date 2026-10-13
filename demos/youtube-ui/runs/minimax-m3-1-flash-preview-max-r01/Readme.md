# Lumen 视频社区 UI/UX 参考图

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/youtube-ui/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：6 个 HTML，Tailwind CDN、Lucide Static CDN 图标与 Unsplash 图片，**需要联网**。
- 入口：本目录 `index.html`（功能总览），6 个页面都已登记在 `run.json` 的 `preview.pages` 中。

### 关于「逐个功能输出并询问是否继续」

提示词的原始流程是：每完成一个小功能就输出一份，然后询问用户「是否继续」，用户输入继续才做下一个。本次用户的要求是「所有案例 demo 全部都做一遍」，已构成对全部功能的预授权，因此一次性产出了全部 5 个功能文件与总览页，没有在中途停下来询问。这一点在此如实记录。

### 文件构成

| 文件 | 内容 |
| --- | --- |
| `index.html` | 功能总览：5 个功能卡片，各带缩放预览与设计要点说明 |
| `01-home.html` | 推荐信息流、沉浸式短视频流、分类筛选抽屉 |
| `02-watch.html` | 竖屏播放器、互动面板、相关推荐 |
| `03-search.html` | 搜索输入与建议、高级筛选面板、搜索结果列表 |
| `04-subscribe.html` | 订阅流、频道主页、订阅分组管理 |
| `05-profile.html` | 个人主页、创作中心、设置 |

每个功能文件内部，把该功能的多个页面以独立 mockup 边框横向排列，页面之间互不影响，符合提示词的要求。

### 设计规范

- 全局：深色底 `#08090d` + 20% 玻璃层，主色为白与青 `#67e8f9` 双强调。
- 所有可点击元素最小触控区 44 × 44（播放器中用 26px 的视觉尺寸 + 外扩命中区实现）。
- 图标一律通过 Lucide Static CDN 引入，不手写 icon svg 路径。
- 界面内不出现滚动条，超出内容以裁切与「查看更多」承接。

### 验证记录

用 Playwright 逐页打开 6 个 HTML：

| 页面 | 破图 | 控制台错误 | 390px 溢出 |
| --- | --- | --- | --- |
| `index.html` | 0 | 0 | 无 |
| `01-home.html` | 0 | 0 | 无 |
| `02-watch.html` | 0 | 0 | 无 |
| `03-search.html` | 0 | 0 | 无 |
| `04-subscribe.html` | 0 | 0 | 无 |
| `05-profile.html` | 0 | 0 | 无 |

### 过程中修掉的真实问题

1. 6 个页面的 `h1` 都没有设置文本色，在深色底上继承了浏览器默认的黑色，标题几乎不可读。统一补上 `text-slate-100`。
2. `index.html` 中引用了 `.orb-grad` 这个类，但没有在样式表里定义它。已补上对应的径向渐变背景。
3. `05-profile.html` 中有一处文案混入了英文（「不 interested 推荐」），改为「减少同类内容推荐」。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：本目录 prompt.md 与 demos/youtube-ui/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code / MiniMax-M3.1-Flash-Preview。Tailwind CDN、Lucide Static CDN 与 Unsplash 图片均需联网，network 为 required；6 个页面全部实测无控制台错误、无破图，390px 下 scrollWidth == clientWidth。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [功能总览](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/index.html)
- [01 首页推荐](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/01-home.html)
- [02 播放与互动](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/02-watch.html)
- [03 搜索与筛选](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/03-search.html)
- [04 订阅与频道](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/04-subscribe.html)
- [05 个人中心与创作](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-preview-max-r01/05-profile.html)

### 部署适配记录

- 提示词的交互方式是逐个功能输出并询问「是否继续」。本次用户已明确要求把所有案例 demo 全部做完，因此一次性产出全部 5 个功能文件与总览页，未在中途停下来询问。
- index.html 为功能总览页，登记在 preview.pages 中作为默认入口；各功能文件之间用相对路径互相跳转。
- 所有图标一律通过 Lucide Static CDN 引入，不手写 icon svg 路径；界面内隐藏滚动条。
- 修复各页 h1 未设置文本色、在深色底上继承浏览器默认黑色近乎不可读的问题；补上 index.html 中引用但未定义的 .orb-grad 背景样式；修正 05-profile.html 中一处混入英文的文案。
<!-- archive:end -->
