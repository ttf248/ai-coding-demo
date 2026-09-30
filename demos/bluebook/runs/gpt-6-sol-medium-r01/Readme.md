# 小蓝书瀑布流

## 原始提示词

见 [完整原始输入](prompt.md)。本轮使用 v2 任务正文。

## 运行与复盘

运行：`npm ci` 后 `npm run dev`；生产预览由仓库 `npm run build:demo -- bluebook--gpt-6-sol-medium-r01` 生成。图片位于 `public/images`，构建时由 Vite 复制。搜索、分页、下拉刷新、点赞与发布为本地 mock 状态。

模型名称和档位由用户指定为 gpt-6-sol / medium；工具是当前 Codex 会话。运行环境未提供可独立核验的模型标识。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gpt-6-sol-medium-r01`
- 模型：GPT-6 Sol；推理档位：medium
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：本轮按存档任务正文原文执行。 用户另行指定本轮全部主题、模型名 gpt-6-sol、medium 档位及当前会话执行。
- 工具：Codex 当前会话。用户指定模型名称 gpt-6-sol、档位 medium；运行环境未提供可独立核验的模型标识。未委派子代理。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [预览](../../../../previews/bluebook/gpt-6-sol-medium-r01/index.html)

### 部署适配记录

- 首次生成，无人工修改历史产物。
- 展示图为本轮新建的本地 SVG mock，未使用外部图片。
<!-- archive:end -->
