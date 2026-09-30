# YouTube UI 模块

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

这是一个单 HTML 横向原型板，将首页、播放、发现、个人中心和创作中心放在独立的手机 mockup 内。每个画板使用玻璃拟态、清晰的层级和固定高度，避免画板内部出现滚动条；底部导航、播放按钮、订阅按钮和创作操作提供轻量反馈。

入口为 `index.html`。Tailwind、Lucide Static 和 Unsplash 使用 CDN，需要联网预览；Lucide 图标通过静态 CDN 图片引用，没有手写 SVG 路径。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gpt-5-6-luna-max-r01`
- 模型：GPT-5.6 Luna；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整输入记录为提示词 v1 原文；未附加系统提示、图片或多轮输入。
- 工具：Codex。按用户指定记录模型 gpt-5.6-luna 与 max 档位；Tailwind、Lucide 和 Unsplash 使用 CDN，需要联网预览。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [YouTube UI 原型](../../../../demos/youtube-ui/runs/gpt-5-6-luna-max-r01/index.html)

### 部署适配记录

- 首次实现，不覆盖基线提示词或既有实验。
- 把五个功能模块放入同一页面中的独立手机 mockup，避免页面滚动条干扰对照。
- 增加导航切换、播放状态、订阅切换和创作按钮等轻量交互。
<!-- archive:end -->
