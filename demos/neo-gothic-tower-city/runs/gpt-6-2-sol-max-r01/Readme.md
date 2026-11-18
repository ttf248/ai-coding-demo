# 灰潮城 · 新哥特式塔楼漫游

## 原始输入

[完整输入快照](prompt.md) · [共享任务正文 v1](../../prompts/v1/prompt.md)

## 运行与操作

在启用 WebGL 2 的浏览器打开 `index.html`。页面联网加载固定版本 Three.js。

拖动环视，滚轮或双指缩放。地标菜单可跳到钟楼高地、潮汐桥或西港旧城。街道漫游可用 WASD、方向键或屏幕按钮移动。

## 实现与复盘

以米为单位构造原创城市。街道镜头眼高约 1.7 m，高地钟楼约 140 m。实例化渲染尖拱窗、群塔、飞檐和桥岸，水面波动与灯火使用着色器。

地形、建筑与地标是原创设定。图形环境或依赖异常会显示待确认提示。[Three.js 渲染器文档](https://threejs.org/docs/pages/WebGLRenderer.html)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--gpt-6-2-sol-max-r01`
- 模型：GPT-6.2-Sol；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：留存仓库用户指令、批量请求原文与本主题的原始任务正文。共享会话还包含其他主题以及平台和工具上下文。
- 工具：Codex。用户指定 GPT-6.2-Sol / max，在同一会话中执行 11 个参与主题。Windows、Node.js 22.16.0。实现在本地基线测试目录中生成。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $3.40 USD（11 个案例；批次 gpt-6-2-sol-max-codex-plus-2026-11-18；未记录单案例费用）
- [主页面](../../../../demos/neo-gothic-tower-city/runs/gpt-6-2-sol-max-r01/index.html)

### 部署适配记录

- 自行设计原创塔楼城市、桥岸地形和对应漫游路线。
- 迁入自 experiment/gpt-6-2-sol-max 的 ef8d75d7，保留原始输入、素材和实现。
- 维护者为登记的 HTML 入口补充公共访问统计引用。
- 源分支无截图，维护者在 main 采集真实桌面及手机画面，由 Codex 逐帧按 v3 复核。
<!-- archive:end -->
