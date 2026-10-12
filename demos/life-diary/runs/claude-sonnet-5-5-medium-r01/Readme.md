# AI 情绪日记与生活助手原型

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `canghe_app_prototype.html`（提示词指定文件名，因此不是 index.html），需联网加载 Tailwind CDN、Font Awesome 与 Unsplash 图片。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- 一个页面横向排列 8 个 375px 宽的 iPhone 尺寸界面，附产品规划说明；全部样式使用 Tailwind 工具类，未写 style 样式块。
- 图片加载失败时通过 onerror 移除图片，避免出现破图。

**已知局限与未验证项**

- 原型无交互逻辑；Unsplash 图片 ID 取自作者已知的公开图片，未逐一校验可用性。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright 加载页面（联网）：Tailwind / Font Awesome CDN 与 Unsplash 图片正常，无脚本错误。 提示词要求文件名 canghe_app_prototype.html，因此入口为该文件而非 index.html。未做交互逻辑（原型页为静态）。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [APP 原型总览](../../../../demos/life-diary/runs/claude-sonnet-5-5-medium-r01/canghe_app_prototype.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
