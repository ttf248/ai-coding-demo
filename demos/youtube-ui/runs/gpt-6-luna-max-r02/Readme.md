# YouTube UI 模块原型

按首页、播放、发现、个人中心和创作中心五个场景呈现桌面端模块卡片。播放与订阅按钮可操作，其他页面提供结构和内容样例。

打开 `index.html`。页面使用 Tailwind CDN、Lucide Static 图标和 Unsplash 图片，需联网。原提示词要求 Artifacts 插件预览；当前会话没有该插件，因此保留为可直接打开的 HTML 原型。

原提示词把 APP 需求作为用户后续输入，但本轮没有单独提供需求；实际输入仅从 `topic.json` 读取了五个模块说明，并在 `prompt.md` 明确记录。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gpt-6-luna-max-r02`
- 模型：GPT-6 Luna；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：原提示词和主题说明已保存；主题说明补足五个页面模块，未提供更详细的 APP 业务规格。
- 工具：Codex 当前会话。按用户指定记录为 gpt-6-luna / max；本轮未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [五模块总览](../../../../demos/youtube-ui/runs/gpt-6-luna-max-r02/index.html)

### 部署适配记录

- 从独立模型测试分支导入本轮实现，作为新的实验记录，保留本轮原始输入和产物。
- 当前环境未提供 Artifacts 插件；交付为可直接打开的 HTML。Tailwind、图标和图片依赖网络。
- 归档来源：model-test-base 分支 demos/youtube-ui/runs/gpt-6-luna-max-r01；此前归档已有旧 r01，因此本轮保存为 gpt-6-luna-max-r02。
<!-- archive:end -->
