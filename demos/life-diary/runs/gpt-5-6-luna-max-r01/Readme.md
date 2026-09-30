# 生活情绪日记

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

这是一个单 HTML 的移动端原型集合。页面以 375px iPhone 画板呈现首页、写日记、AI 洞察、生活回顾和个人中心，使用 Tailwind CDN 完成布局，并保留 `canghe_app_prototype.html` 这一提示词要求的文件名兼容入口。

情绪选择、快速记录、底部导航、写作弹层和 AI 洞察展开均有轻交互；图片使用 Unsplash CDN，因此需要联网预览。入口为 `index.html`，单 HTML 也可直接用浏览器打开。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--gpt-5-6-luna-max-r01`
- 模型：GPT-5.6 Luna；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整输入记录为提示词 v1 原文；未附加系统提示、图片或多轮输入。
- 工具：Codex。按用户指定记录模型 gpt-5.6-luna 与 max 档位；原型使用 CDN 资源，需要联网预览。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [情绪日记原型](../../../../demos/life-diary/runs/gpt-5-6-luna-max-r01/index.html)

### 部署适配记录

- 首次实现，不覆盖基线提示词或既有实验。
- 将多个 iPhone 375px 画板集中在一个 HTML 中，页面之间互不影响。
- 增加可点击的情绪选择、记录弹层、底部导航和 AI 洞察演示。
<!-- archive:end -->
