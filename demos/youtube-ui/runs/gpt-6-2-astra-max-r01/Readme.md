# YouTube 移动端工作台

[本次输入](prompt.md) · [共用任务正文](../../prompts/v1/prompt.md)

## 运行

从 index.html 进入首页，可切换到播放、发现、个人中心和创作中心。每个文件同时展示同一功能的独立手机画板，支持横向触摸浏览。

## 实现与复盘

任务正文未给出额外 APP 需求，五个功能取自本主题的元数据说明。本轮按批量指令连续完成。可用环境未提供名为 Artifacts 的可调用预览工具，使用本地 Chromium 查看实际页面。

## 验证记录

五个功能 HTML 各自可独立打开。实测首页分类筛选、打开播放页、保存稍后观看、评论、观看历史以及创作中心保存草稿。模块间使用相对链接，本地 Chromium 渲染验证覆盖五个页面。

在本地 HTTP、直接打开文件和 390px 视口下检查了入口，页面没有横向溢出。

<details>
<summary>随附照片来源（Unsplash）</summary>

- [village](https://images.unsplash.com/photo-1516483638261-f4dbaf036963)
- [room](https://images.unsplash.com/photo-1600210492486-724fe5c67fb0)
- [walk](https://images.unsplash.com/photo-1441974231531-c6227db76b6e)
- [city](https://images.unsplash.com/photo-1519501025264-65ba15a82390)
- [coffee](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085)

</details>

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gpt-6-2-astra-max-r01`
- 模型：GPT-6.2-Astra；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：保存两条用户消息和本案例读取的完整版本正文。批量实验共享同一会话，本快照未逐条收录其余工具输出和运行时上下文。
- 工具：Codex。按用户提供的信息登记 GPT-6.2-Astra / max。Windows、PowerShell、Node.js 22.16.0。使用当前测试克隆及同一会话，由主代理直接生成。 首次产物生成后的验收期间，用户追加消息「继续」。同一会话继续验证，无人工代写或手工改动。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $8.74 USD（11 个案例；批次 gpt-6-2-astra-max-codex-plus-2026-11-18；未记录单案例费用）
- [首页](../../../../demos/youtube-ui/runs/gpt-6-2-astra-max-r01/index.html)
- [播放](../../../../demos/youtube-ui/runs/gpt-6-2-astra-max-r01/watch.html)
- [发现](../../../../demos/youtube-ui/runs/gpt-6-2-astra-max-r01/discover.html)
- [个人中心](../../../../demos/youtube-ui/runs/gpt-6-2-astra-max-r01/library.html)
- [创作中心](../../../../demos/youtube-ui/runs/gpt-6-2-astra-max-r01/studio.html)

### 部署适配记录

- 按固定版本的 Lucide Static 文件名使用 house 图标，内嵌同版本图标的加载失败回退。
- 从 experiment/gpt-6-2-astra-max 的 780cbd8d 导入；首轮提交为 cd9b208b。保留原始输入和测试分支的复盘、素材及验收说明。
- 维护者为网页入口接入公共访问统计脚本。
- 源分支无截图。维护者在 main 采集桌面与移动证据，由 Codex 逐帧按 v3 复核并登记封面。
<!-- archive:end -->
