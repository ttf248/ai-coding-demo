# YouTube 移动端 UI

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：入口 `index.html`，需联网加载 Tailwind CDN、Lucide Static（unpkg）与 Unsplash。
- 执行条件：Claude Sonnet 5.5（medium），当前 Claude Code 会话，2026-10-12；首次产物，无人工修改，未使用子代理。

**实现要点**

- 提示词没有给出具体 APP 需求，按主题名推定为类 YouTube 视频 App，品牌虚构为 VidoTube。
- 按提示词流程仅输出第一个功能（首页推荐与搜索发现，3 个 mockup）；原流程应询问是否继续下一功能，并通过 Artifacts 预览，本次均未执行。

**已知局限与未验证项**

- Lucide 图标以 `<img>` 引入并用 CSS invert 着色，离线时图标缺失。

验证详情见下方自动生成区块中的“工具/验证记录”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--claude-sonnet-5-5-medium-r01`
- 模型：Claude Sonnet 5.5；推理档位：medium
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整输入为所用提示词正文原文；用户另行指示“所有案例 demo 全部做一遍，模型 claude-sonnet-5.5，档位 medium，使用当前会话”，该指示不属于任务正文。输入内未包含具体 APP 需求，执行时据主题名推定为类 YouTube 视频 App。
- 工具：Claude Code。在 model-test-base 派生的独立测试分支中，使用当前 Claude Code 会话直接执行（未委派子代理）；用户指定的模型名称为 claude-sonnet-5.5、档位 medium，会话内模型 ID 为 claude-sonnet-5-5。输入为提示词正文原文，用户未追加其他指令。 验证记录：Playwright 加载页面（联网）：CDN 与图片正常，无脚本错误，mockup 内无滚动条。 提示词未给出具体【APP 需求】，按主题名 youtube-ui 推定为类 YouTube 视频 App；按提示词流程仅输出第一个功能，未继续后续功能（原流程需用户确认继续）；无 Artifacts 预览能力，未执行第 4 步。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [功能一：首页与搜索](../../../../demos/youtube-ui/runs/claude-sonnet-5-5-medium-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
