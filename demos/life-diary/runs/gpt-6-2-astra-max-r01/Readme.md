# 晴间 · 情绪日记

[本次输入](prompt.md) · [共用任务正文](../../prompts/v1/prompt.md)

## 运行

打开 index.html 或任务指定的 canghe_app_prototype.html。所有手机画板在同一页面，可选择心情、保存日记、回顾记录并完成生活小事。

## 实现与复盘

以一次记录为主线，首页、编辑器、时间线、洞察、助手与设置各自有独立画板。照片取自 Unsplash，Tailwind 工具类预编译并内嵌。助手展示本地规则生成的原型反馈。

## 验证记录

以浏览器选择心情、写入日记并按关键词回顾，刷新后仍可找到记录。试用了助手的小事清单，并下载 JSON 备份。六个 375px 画板在桌面和手机宽度下均可访问。

在本地 HTTP、直接打开文件和 390px 视口下检查了入口，页面没有横向溢出。

<details>
<summary>随附照片来源（Unsplash）</summary>

- [green](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05)
- [field](https://images.unsplash.com/photo-1470252649378-9c29740c9fa8)

</details>

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--gpt-6-2-astra-max-r01`
- 模型：GPT-6.2-Astra；推理档位：max
- 类型：prototype；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：保存两条用户消息和本案例读取的完整版本正文。批量实验共享同一会话，本快照未逐条收录其余工具输出和运行时上下文。
- 工具：Codex。按用户提供的信息登记 GPT-6.2-Astra / max。Windows、PowerShell、Node.js 22.16.0。使用当前测试克隆及同一会话，由主代理直接生成。 首次产物生成后的验收期间，用户追加消息「继续」。同一会话继续验证，无人工代写或手工改动。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $8.74 USD（11 个案例；批次 gpt-6-2-astra-max-codex-plus-2026-11-18；未记录单案例费用）
- [主页面](../../../../demos/life-diary/runs/gpt-6-2-astra-max-r01/index.html)

### 部署适配记录

- 从 experiment/gpt-6-2-astra-max 的 780cbd8d 导入；首轮提交为 cd9b208b。保留原始输入和测试分支的复盘、素材及验收说明。
- 维护者为网页入口接入公共访问统计脚本。
- 源分支无截图。维护者在 main 采集桌面与移动证据，由 Codex 逐帧按 v3 复核并登记封面。
<!-- archive:end -->
