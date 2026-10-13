# 冥想 App 原型

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/meditation/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，Tailwind CDN、Lucide Static CDN 图标与 Unsplash 图片，**需要联网**。
- 入口：本目录 `index.html`。

### 页面构成

按提示词「一个功能的所有页面写入一个 html，为每个页面创建 mockup 边框横向排列」的要求，同一个文件内并排放置了 9 个页面，每个页面都在自己的设备框内，彼此独立、互不影响：

1. 今日首页
2. 分类发现
3. 冥想播放页
4. 呼吸练习
5. 睡眠故事
6. 冥想计时器
7. 课程详情与播放列表
8. 冥想周记录
9. 个人中心

视觉上采用深空紫黑底 + 玻璃拟态 + 柔光球，界面内不出现滚动条，超出内容以裁切承接，底部固定 Tab Bar。

### 设计规范

页内显式声明了实际遵守的规范，避免规范只停留在口头：

- 圆角统一 24–26px
- 辅助文字不小于 10px
- 文本对比度不低于 4.5:1

### 验证记录

| 项目 | 结果 |
| --- | --- |
| 390px 横向溢出 | 无溢出（`scrollWidth == clientWidth == 390`） |
| 1440px 横向溢出 | 无溢出 |
| 图片破图 | 0（22 张图全部加载） |
| 控制台错误 | 0 |

本条目为静态原型，只做视觉呈现，页面之间的跳转未接线。

### 已知限制

- 计时器与呼吸练习是视觉示意，不做真实计时。
- 图片与图标依赖 CDN，离线不可用。

### 过程中修掉的真实问题

1. **390px 横向溢出**：`.phone` 固定 375px，叠加外层容器 `px-6` 左右各 24px，合计 423px 超过 390px 视口，导致整页出现横向滚动。改为外层 `px-3 sm:px-6`，并给 mockup 条带容器加 `overflow-x-auto`，窄屏时在条带内部横向滚动而不撑宽页面。
2. **一行错误的 SVG 脚本**：文件中有一行 `<script src=".../icons/play.svg">`，把 SVG 当作脚本加载，浏览器以 MIME 类型不符拒绝执行（`Refused to execute script ... because its MIME type ('image/svg+xml')`）。该图标实际未被任何元素引用，已整行删除。


<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：本目录 prompt.md 与 demos/meditation/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code / MiniMax-M3.1-Flash-Preview。单文件原型，Tailwind、Lucide Static 与 Unsplash 图片走 CDN，因此 network 为 required。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。 复核：390px 与 1440px 下 scrollWidth 均等于 clientWidth，图片无破图，控制台 0 错误。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [全部页面](../../../../demos/meditation/runs/minimax-m3-1-flash-preview-max-r01/index.html)

### 部署适配记录

- 9 个页面写在同一个 HTML 内，以独立 mockup 边框横向排列，页面之间互不影响。
- 深空紫黑底 + 玻璃拟态 + 柔光球；界面内隐藏滚动条，超出内容以裁切承接。
- 在页内声明了所用设计规范：圆角 24–26px、辅助文字不小于 10px、文本对比度不低于 4.5:1。
- 390px 下 mockup 条带溢出：.phone 固定 375px，叠加外层容器 px-6 左右各 24px，必然超过视口宽度。改为外层 px-3 sm:px-6，并给条带容器加 overflow-x-auto，窄屏时在条带内部横向滚动而不撑宽整个页面。
- 移除一行 <script src=".../icons/play.svg">：把 SVG 当脚本加载会被浏览器以 MIME 类型不符拒绝，且该图标实际未被任何元素引用。
<!-- archive:end -->
