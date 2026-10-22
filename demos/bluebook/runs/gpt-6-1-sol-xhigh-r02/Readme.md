# 小蓝书 · 瀑布流社区 · GPT 6.1 Sol xhigh

React 18 + TypeScript、Tailwind CSS、Zustand、react-lazyload；20 条初始内容、滚动追加、分类与搜索、点赞、详情、本地图片发布、移动端下拉刷新。

## 运行

npm ci 后 npm run dev；静态预览使用根 previews 下产物。图片来自 Unsplash，需要联网；加载失败有内嵌 SVG 兜底。发布仅在当前页面保存，点赞存储于本机。

## 实验条件与边界

- 模型：用户指定的 `gpt-6-1-sol`；档位：`xhigh`；日期：2026-10-23；工具：Codex。
- 按用户要求使用当前会话，未委派子代理。批量任务正文采用 v2，原文与批量指令见 [输入快照](prompt.md)。
- 2026-10-23 用户追加输入原文：`继续`。本轮继续完成同一批产物。
- 未读取其他分支、其他工作目录或远程中的历史答案。系统与开发者上下文没有完整转录，输入完整性标记为 partial；同会话连续执行不构成隔离公平评测。
- 首次产物在测试前保存在 [initial.zip](evidence/initial.zip)；测试修复见 [修复记录](evidence/repairs.md)，结果见 [验证记录](evidence/validation.md)。无人工修改。

## 参考

[Vite 相对 base 构建](https://vite.dev/guide/build)。


## 迁入说明

源分支实验 ID 使用 r01；main 中独立登记为 r02，保留原始输入、首次快照与验收报告中的源路径。与 main 旧实验无继承关系。源验证见 evidence/validation.md；本次导入记录见 [批次说明](../../../../docs/model-tests/2026-10-23-gpt-6-1-sol-xhigh/Readme.md)。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gpt-6-1-sol-xhigh-r02`
- 模型：GPT-6.1 Sol；推理档位：xhigh
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整保留用户批量指令、选用任务正文和用户提供的 AGENTS.md。宿主系统/开发者上下文及工具交互未作为原始输入完整转录；同一会话连续完成 11 个主题，不是隔离会话的公平评测。
- 工具：Codex。Windows PowerShell；模型名称 gpt-6-1-sol、档位 xhigh 由用户明确提供；按用户要求复用当前会话，未委派子代理。未获取其他分支、远程或其他工作目录的历史实现。默认选择参与主题的最大提示词版本；stock-watching 已归档，跳过。 用户迁入时补充：供应商 OpenAI，Pro 订阅，Fast 开启；整批 11 个案例消耗 Pro 周额度 2%，耗时 18m 1s（1081 秒），不分摊到单案例。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：OpenAI 批次合计 2 %（Pro 周额度）（11 个案例；批次 gpt-6-1-sol-xhigh-codex-pro-fast-2026-10-23；未记录单案例费用）
- [主页面](../../../../previews/bluebook/gpt-6-1-sol-xhigh-r02/index.html)

### 部署适配记录

- 2026-10-23：当前会话首次独立实现；无人工代码修改。首次产物在首次浏览器验证前保存于 evidence/initial.zip，后续修复见 evidence/repairs.md。
- 2026-10-23 自动验证修复：首次 Vite 构建提示 react-lazyload 的 prop-types 被作为外部依赖；补充固定版本 prop-types@15.8.1，并重新生成独立 lockfile、构建静态预览，避免浏览器裸模块导入失败。
- 2026-10-23 从 F:/dev/ai-coding-demo-test 的 experiment/gpt-6-1-sol-xhigh-20261023 分支提交 f66f19c8 迁入；源 ID bluebook--gpt-6-1-sol-xhigh-r01 与 main 历史记录冲突，登记为 bluebook--gpt-6-1-sol-xhigh-r02。与旧轮次无继承关系；输入、首次源码 ZIP、原截图及验收报告保留源标识。
- 迁入时维护者在各 HTML 入口添加公共 analytics.js 的 defer 引用；构建型预览重建，保留源输入、首次产物和验证修复证据。
- 2026-10-23 维护者按当前 v3 规则逐图复核全部采集帧、长图和补充操作，独立填写二十项首次评分、五维观察、置信度与限制；保留源截图及失败清单，不追认全部功能或性能通过。
<!-- archive:end -->
