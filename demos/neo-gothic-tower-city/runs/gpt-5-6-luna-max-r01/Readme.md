# 新哥特式塔楼城市

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

这是一个单 HTML WebGL 场景。代码生成塔楼、尖顶、桥梁、海面和粒子火焰，支持拖拽旋转、滚轮缩放、自动漫游和雾效强度控制；缺少真实测绘比例的部分在界面中标记为“待确认”。

入口为 `index.html`。Three.js 从 CDN 加载，因此需要联网；没有外部纹理或图片资源。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--gpt-5-6-luna-max-r01`
- 模型：GPT 5.6 Luna；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整输入记录为提示词 v1 原文；未附加系统提示、图片或多轮输入。
- 工具：Codex。按用户指定记录模型 gpt-5.6-luna 与 max 档位；Three.js 使用 CDN，需要联网预览。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [塔楼城市漫游](../../../../demos/neo-gothic-tower-city/runs/gpt-5-6-luna-max-r01/index.html)

### 部署适配记录

- 首次实现，不覆盖基线提示词或既有实验。
- 在单 HTML 中使用代码几何体搭建塔楼、尖顶、桥梁和海湾，并提供鼠标/触控漫游。
- 将缺少真实比例测绘数据的部分标记为『待确认』，同时继续完成可运行场景。
<!-- archive:end -->
