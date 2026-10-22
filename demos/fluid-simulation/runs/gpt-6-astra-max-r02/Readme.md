# 彩色流体实验台 · GPT 6 Astra Max

## 输入与运行条件

见 [实际输入快照](prompt.md) 与 [共享任务正文](../../prompts/v1/prompt.md)。模型及 max 档位由用户指定。本轮在当前会话逐个直接实现，未使用子代理，未读取其他分支或工作目录中的旧实现。完整系统上下文与工具交互未逐字归档，因此输入完整性标为 partial，不作为隔离公平评测。

## 实现

GPU 双缓冲纹理实现半拉格朗日平流、旋度约束、散度、Jacobi 压力迭代与速度投影；鼠标与触摸注入，颜色、力度、消散、迭代、分辨率、暂停清空与 PNG。重建释放 GPU 纹理和帧缓冲。

## 运行

直接打开 [index.html](index.html) 或通过仓库 npm run preview 的 HTTP 静态服务器访问。

## 边界与复盘

需要 WebGL 2 和 EXT_color_buffer_float。无支持时显示具体错误；分辨率或窗口大小变更清空模拟场。不用于工程 CFD 精度评估。

## 产物与验证

[first-output.zip](evidence/first-output.zip) 保存首次完整实现，后续检查修复记录于 [verification.md](evidence/verification.md)。用户中断后发送的“继续”仅为恢复本轮，原文另存 [continuation.md](evidence/continuation.md)。无人工源码修改；修复均由当前会话实施。

最终 4 项案例检查通过：[机器可读结果](evidence/checks.json) · [桌面截图](evidence/index-desktop.png) · [390px 截图](evidence/index-mobile.png)。详细实测及边界见验证记录。


## 迁入说明

本轮在 main 登记为 `fluid-simulation--gpt-6-astra-max-r02`，源分支使用 `fluid-simulation--gpt-6-astra-max-r01`。原始输入及 evidence 中的旧 ID 和路径是历史证据；运行入口、当前评分与归档信息以本目录 run.json 为准。迁入时追加公共访问统计引用；源截图与首次源码快照保持原样。用户补充的 Pro 订阅、Fast/常规混合及 55m 52s 整批耗时见费用批次。

[迁入检查结果](../../../../docs/model-test-rounds/2026-10-22-gpt-6-astra-max/import-checks.json) 记录本次原始输入与 evidence 完整性、HTTP / Pages 子路径、390px、iframe 和统计接入检查；这些检查不追认源分支完整功能验收。源功能报告继续保存在 evidence。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gpt-6-astra-max-r02`
- 模型：GPT-6 Astra；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：保存本轮用户指令、用户提供的仓库规则、可见环境与任务正文；当前会话顺序执行多个主题，完整系统上下文及全部工具交互未逐字存档，不作为隔离同输入评测。
- 工具：Codex。Windows / PowerShell / Node 22.16.0。模型 gpt-6-astra 与 max 档位由用户明确指定；当前会话直接执行，无子代理。用户明确使用当前会话；使用现有 model-test-base 测试目录并新建 experiment/gpt-6-astra-max-20261022 分支；未读取其他分支或目录的历史实现。 用户补充：OpenAI Pro 订阅，Fast 与常规混合使用；消耗未记录。整批 11 案例耗时 55m 52s，不拆分到单案例。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 金额未记录（11 个案例；批次 gpt-6-astra-max-codex-pro-2026-10-22；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/gpt-6-astra-max-r02/index.html)

### 部署适配记录

- 本轮从空白基线新增实现；未修改共享任务正文，未导入旧答案。首次产物及后续验证见 evidence。
- 修复 ResizeObserver 首次回调重复重建帧缓冲、清掉初始染料的问题：尺寸不变时不重建；改善首屏默认染料注入。
- 2026-10-22 从独立测试目录 experiment/gpt-6-astra-max-20261022 分支提交 931b8b50 迁入；源实验 ID fluid-simulation--gpt-6-astra-max-r01 在 main 与旧记录冲突，另存为 fluid-simulation--gpt-6-astra-max-r02。与 main 旧轮次无继承关系，原始输入和 evidence 保留源 ID，不机械替换。
- 迁入时由维护者在可维护 HTML 入口添加公共 analytics.js 引用；构建型预览重建。原始输入、首次源码 ZIP 与源截图不改写。
- 维护者于 2026-10-22 采集桌面、390px 及适用的滚动/操作状态，2026-10-23 完成 v3 逐图复核；保留全部失败尝试与来源链，封面选自已复核的真实截图。首次评分，不改写源输入或历史评分。
<!-- archive:end -->
