# 流体色场

[本次输入](prompt.md) · [共用任务正文](../../prompts/v1/prompt.md)

## 运行

在支持 WebGL 2 与 EXT_color_buffer_float 的浏览器打开 index.html。按住画布并移动注入染料，暂停可比较静止状态，保存 PNG 导出当前帧。

## 实现与复盘

半拉格朗日平流、涡量约束与 Jacobi 压力投影分别运行于片元着色器。重建分辨率时释放旧纹理与帧缓冲并初始化色场。

## 验证记录

浏览器实测暂停后画面逐像素稳定，清空与继续拖动可移除、重新注入染料。更改分辨率后成功重建，PNG 可下载。屏蔽 WebGL 2 后能看到明确提示。GPU 验证使用支持浮点渲染的 Chromium 浏览器。

在本地 HTTP、直接打开文件和 390px 视口下检查了入口，页面没有横向溢出。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gpt-6-2-astra-max-r01`
- 模型：GPT-6.2-Astra；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：保存两条用户消息和本案例读取的完整版本正文。批量实验共享同一会话，本快照未逐条收录其余工具输出和运行时上下文。
- 工具：Codex。按用户提供的信息登记 GPT-6.2-Astra / max。Windows、PowerShell、Node.js 22.16.0。使用当前测试克隆及同一会话，由主代理直接生成。 首次产物生成后的验收期间，用户追加消息「继续」。同一会话继续验证，无人工代写或手工改动。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $8.74 USD（11 个案例；批次 gpt-6-2-astra-max-codex-plus-2026-11-18；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/gpt-6-2-astra-max-r01/index.html)

### 部署适配记录

- 从 experiment/gpt-6-2-astra-max 的 780cbd8d 导入；首轮提交为 cd9b208b。保留原始输入和测试分支的复盘、素材及验收说明。
- 维护者为网页入口接入公共访问统计脚本。
- 源分支无截图。维护者在 main 采集桌面与移动证据，由 Codex 逐帧按 v3 复核并登记封面。
<!-- archive:end -->
