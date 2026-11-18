# 筑场 · 体素微缩建筑工地

## 原始输入

[完整输入快照](prompt.md) · [共享任务正文 v1](../../prompts/v1/prompt.md)

## 运行与操作

在启用 WebGL 的浏览器直接打开 `index.html`。页面同时包含 Three.js r160、几何体、着色器和程序生成的贴图。

拖动环视，滚轮或双指缩放。用工区菜单切换中央施工区、河岸扩建区。可以点击沙盘桌前的三个实体旋钮控制速度、昼夜及尘土，按空格或点暴雨按钮切换天气。

## 实现与复盘

静态细节和移动部件都使用 InstancedMesh 批量渲染。两组起吊及挖运轨迹分区，铲斗、料箱、人员和雨尘均按浏览器动画时间更新。夜间和雨中增强灯光，湿地面改变粗糙度与金属度。

r160 的 CDN 发行版及 MIT 许可内嵌于 HTML，以支持离线直接打开。帧率随设备和图形加速环境而异。[Three.js r160 源码](https://github.com/mrdoob/three.js/tree/r160)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--gpt-6-2-sol-max-r01`
- 模型：GPT-6.2-Sol；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：留存仓库用户指令、批量请求原文与本主题的原始任务正文。共享会话还包含其他主题以及平台和工具上下文。
- 工具：Codex。用户指定 GPT-6.2-Sol / max，在同一会话中执行 11 个参与主题。Windows、Node.js 22.16.0。实现在本地基线测试目录中生成。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $3.40 USD（11 个案例；批次 gpt-6-2-sol-max-codex-plus-2026-11-18；未记录单案例费用）
- [主页面](../../../../demos/voxel-construction-site/runs/gpt-6-2-sol-max-r01/index.html)

### 部署适配记录

- 将 Three.js r160 CDN 发行版内嵌 HTML，以满足离线打开与单文件交付。
- 提供中央施工区和有河岸栈道及扩建楼层的第二套场景。
- 迁入自 experiment/gpt-6-2-sol-max 的 ef8d75d7，保留原始输入、素材和实现。
- 维护者为登记的 HTML 入口补充公共访问统计引用。
- 源分支无截图，维护者在 main 采集真实桌面及手机画面，由 Codex 逐帧按 v3 复核。
<!-- archive:end -->
