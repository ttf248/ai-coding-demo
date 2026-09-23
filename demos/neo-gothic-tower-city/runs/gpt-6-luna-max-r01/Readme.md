# 雾隐之城 · GPT 6 Luna Max

## 本轮实现

以单 HTML 创建可漫游的新哥特式塔城，使用程序化建筑和原生 WebGL，包含主塔、街区、海面、灯火广场及粒子效果。支持键盘、鼠标与触屏控制。

## 运行与验证

浏览器直接打开 `index.html`，无需 CDN。目标模型通过 Codex CLI 的 `gpt-6-luna`、`max` 档位执行；内嵌 JavaScript、控件引用和页面结构检查通过，`file://` 可读，本地 HTTP 返回 200。

原始任务：[prompt.md](prompt.md)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--gpt-6-luna-max-r01`
- 模型：GPT 6 Luna；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整保留主题 v1 单 HTML 城市动画提示词；未使用额外外部资源。
- 工具：Codex CLI。通过 --model gpt-6-luna 与 model_reasoning_effort=max 执行；CLI 完成并返回代码，具体平台上下文未随实验导出。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/neo-gothic-tower-city/runs/gpt-6-luna-max-r01/index.html)

### 部署适配记录

- 基于主题 v1 新建单文件程序化 WebGL 塔城，原有实验不变。
- 实现约 140 米主塔、街区、海面、灯火广场、粒子效果及键盘/鼠标/触屏漫游。
- 使用原生 WebGL 与浏览器 API，无外部资源依赖；完成 file:// 与本地 HTTP 检查。
<!-- archive:end -->
