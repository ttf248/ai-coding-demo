# YouTube UI 模块

## 原始提示词

见 [输入记录](prompt.md)。

## 运行与复盘

从 index.html 浏览首页、播放、发现、个人中心和创作中心五个模块，每个模块在单独 HTML 中展示两个独立画板。需要网络加载 Tailwind、Lucide 图标和 Unsplash 图片；画板是静态示例，不提供视频或账户服务。原提示词未包含实际 APP 名称，此处依据主题说明设计 YouTube。当前环境没有题目指定的 Artifacts 插件，使用本地静态预览。此实验与其他案例共用会话，存在上下文交叉。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gpt-6-1-terra-xhigh-r01`
- 模型：GPT-6.1 Terra；推理档位：xhigh
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：记录用户批量指令和读取的任务正文；同一会话还包含仓库维护规则与其他主题上下文。原提示词未包含具体 APP 需求，结合主题说明按 YouTube 设计。
- 工具：Codex。用户提供模型 gpt-6-1-terra、档位 xhigh；在当前会话顺序执行批量主题，非隔离单题会话。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 金额未记录（11 个案例；批次 gpt-6-1-terra-xhigh-codex-pro-2026-10-26；未记录单案例费用）
- [首页](../../../../demos/youtube-ui/runs/gpt-6-1-terra-xhigh-r01/index.html)
- [播放](../../../../demos/youtube-ui/runs/gpt-6-1-terra-xhigh-r01/watch.html)
- [发现](../../../../demos/youtube-ui/runs/gpt-6-1-terra-xhigh-r01/explore.html)
- [个人中心](../../../../demos/youtube-ui/runs/gpt-6-1-terra-xhigh-r01/profile.html)
- [创作中心](../../../../demos/youtube-ui/runs/gpt-6-1-terra-xhigh-r01/create.html)

### 部署适配记录

- 从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区迁入未提交测试产物；该工作区当时 HEAD 为 452ac588。维护者补充公共访问统计脚本及截图采集，原始输入保持不变。
- 2026-10-27：按用户明确授权由 Codex 对已列明全部采集帧进行 AI 视觉复核，填写 v3 二十项评分和观察；评分不代表人工复核或完整功能验收。
<!-- archive:end -->
