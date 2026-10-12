# 奇幻地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `index.html`，可 file:// 直接打开，无 CDN。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- 噪声、河流、城镇均由种子确定性生成；使用 Priority-Flood 填洼后按汇流量取河，河流沿下坡到海或填洼形成的内陆湖。
- 画笔修改的是叠加在基础高度场上的增量，海岸等高线（Marching Squares）与河流随编辑重算；改变种子或粗糙度会清除手工编辑，调整海平面不会。
- PNG 导出以 2× 世界分辨率重绘地图，包含当前编辑与种子文字。

**已知局限与未验证项**

- 手绘感主要来自颜色抖动、符号与轻微线条偏移，未使用手绘笔触纹理。
- 导出的 PNG 只含地图与种子文字，不含图例面板；山脉/树木符号密度不可配置。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright：相同种子重生成高度场哈希一致，不同种子哈希不同；画笔拖动后高度场哈希改变；导出按钮触发 PNG 下载；河流由填洼汇流计算，沿下坡流向海洋或填洼形成的内陆湖。 390px 视口无水平溢出；无控制台错误；未在真实触摸设备上验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/fantasy-map-generator/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
