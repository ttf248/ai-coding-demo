# 彩色流体实验台

## 原始输入

[完整输入快照](prompt.md) · [共享任务正文 v1](../../prompts/v1/prompt.md)

## 运行与操作

在启用 WebGL 2、支持浮点颜色缓冲的浏览器打开 `index.html`。页面也可通过 HTTP 静态托管。

拖动画布注入选定颜色和方向的动量，调节衰减、压力迭代或分辨率。暂停后可清空或保存当前 PNG。

## 实现与复盘

GPU 双缓冲纹理保存速度、染料和压力，依次执行平流、旋度约束、散度、Jacobi 压力迭代与投影。改变模拟分辨率会重采样场并释放旧纹理。

分辨率和设备像素比有上限。设备缺少 WebGL 2 浮点渲染能力时，页面会给出支持提示。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gpt-6-2-sol-max-r01`
- 模型：GPT-6.2-Sol；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：留存仓库用户指令、批量请求原文与本主题的原始任务正文。共享会话还包含其他主题以及平台和工具上下文。
- 工具：Codex。用户指定 GPT-6.2-Sol / max，在同一会话中执行 11 个参与主题。Windows、Node.js 22.16.0。实现在本地基线测试目录中生成。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $3.40 USD（11 个案例；批次 gpt-6-2-sol-max-codex-plus-2026-11-18；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/gpt-6-2-sol-max-r01/index.html)

### 部署适配记录

- 以半浮点渲染目标执行速度场与染料场求解，提供 GPU 能力检测。
- 迁入自 experiment/gpt-6-2-sol-max 的 ef8d75d7，保留原始输入、素材和实现。
- 维护者为登记的 HTML 入口补充公共访问统计引用。
- 源分支无截图，维护者在 main 采集真实桌面及手机画面，由 Codex 逐帧按 v3 复核。
<!-- archive:end -->
