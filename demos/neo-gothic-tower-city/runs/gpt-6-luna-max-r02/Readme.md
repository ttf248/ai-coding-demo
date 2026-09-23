# 雾隐之城 · GPT 6 Luna Max 修复版

## 本轮实现

以单 HTML 创建可漫游的新哥特式塔城，使用程序化建筑和原生 WebGL，包含主塔、街区、海面、灯火广场及粒子效果。支持键盘、鼠标与触屏控制。

## 修复记录

本版本基于 `gpt-6-luna-max-r01`，针对 WebGL 报错“Precisions of uniform 'uTime' differ between VERTEX and FRAGMENT shaders”进行了人工修复。统一主场景共享 uniform 与 varying、粒子 varying 的精度声明；原始输入保持一致，未重新调用模型。

## 运行与验证

浏览器直接打开 `index.html`，无需 CDN。目标模型通过 Codex CLI 的 `gpt-6-luna`、`max` 档位执行；内嵌 JavaScript、控件引用和页面结构检查通过，`file://` 可读，本地 HTTP 返回 200。

原始任务：[prompt.md](prompt.md)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--gpt-6-luna-max-r02`
- 模型：GPT 6 Luna；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整保留主题 v1 单 HTML 城市动画提示词；未使用额外外部资源。
- 工具：人工维护。基于 gpt-6-luna-max-r01；根据用户报告修复 WebGL 着色器精度不匹配，未重新调用模型。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/neo-gothic-tower-city/runs/gpt-6-luna-max-r02/index.html)

### 部署适配记录

- 继承 gpt-6-luna-max-r01 的完整实现和原始输入，保留原记录不变。
- 人工为主场景着色器的共享 uniform 与 varying 显式指定一致的 mediump 精度，修复 WebGL 程序链接失败。
- 人工对齐粒子着色器的 varying 精度；未重新运行模型。
<!-- archive:end -->
