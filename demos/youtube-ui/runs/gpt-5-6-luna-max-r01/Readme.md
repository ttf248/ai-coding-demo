# VideoTube UI · GPT 5.6 Luna Max

## 重做说明

按照主题 v1 的模块化提示词，把首页推荐、视频播放、个人中心、发现和创作中心五个模块重新收束为一个 `index.html`。旧版五个独立页面仍作为历史证据保留。

## 交互

顶部模块切换会在同一个 iPhone 画板中切换页面；首页支持本地过滤，播放页支持播放/暂停、点赞和收藏，发现页支持趋势筛选，个人页有开关状态，创作页支持拖拽/选择文件的上传反馈。

页面使用 Tailwind CDN、Lucide Static 图标和 Unsplash 视觉素材，断网时布局仍可打开但外部资源可能显示占位。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gpt-5-6-luna-max-r01`
- 模型：GPT 5.6 Luna；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整保留主题 v1 多轮模块提示词；未补造历史 Artifacts 会话上下文。
- 工具：Codex。将五个模块作为一个独立单文件原型重新实现；外部 CDN 仅用于预览视觉资源。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [五模块原型](../../../../demos/youtube-ui/runs/gpt-5-6-luna-max-r01/index.html)

### 部署适配记录

- 将首页、播放、发现、个人中心和创作中心收束在同一 index.html，便于横向比较与直接打开。
- 加入模块切换、播放状态、点赞、搜索、上传区域和设置开关等可点击反馈。
- 历史多页面 unknown 版本继续保留，未修改其原始文件。
<!-- archive:end -->
