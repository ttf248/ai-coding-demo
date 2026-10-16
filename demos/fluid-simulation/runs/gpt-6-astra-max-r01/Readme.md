# 彩色流体实验台 · Astra Max

WebGL2 二维流体计算，包含速度与染料平流、散度、压力迭代、投影及涡量增强。

任务版本：v1。模型与档位按用户提供记录为 **gpt-6-astra / max**。开始日期 2026-10-16，2026-10-17（Asia/Shanghai）继续完成验证与归档；本轮在同一会话直接执行，未委派子代理。

[输入快照](prompt.md) · [首次产物与修复](evidence/Readme.md) · [后续输入](evidence/follow-up.md) · [整轮实验报告](../../../../docs/experiments/gpt-6-astra-max-20261016/Readme.md)

输入完整性为 partial：保留了批量请求、仓库指令和所选任务正文，未完整导出系统/开发者上下文及工具历史；不作为隔离或同输入公平评测。

## 运行

直接双击 [index.html](index.html) 即可离线运行；也可在仓库根目录执行 `npm run preview` 后从主题页进入。

## 实现

- RGBA16F 双缓冲纹理计算速度与染料场；手动双线性采样、Jacobi 压力求解和速度投影，自定义 GLSL 着色器。
- 拖动注入动量与颜色；力度、消散、压力迭代和分辨率控件实际影响计算。支持暂停、清空、重置、截图和资源重建。

## 验证

- 暂停时画布像素不变，清空后染料消失；注入后场随时间演化。改变分辨率后资源数量保持 8，WebGL 错误码为 0。
- 验证 PNG 下载、390px 适配及禁用 WebGL2 后的明确降级提示；离线 file:// 运行通过。

具体脚本、运行报告与截图见整轮实验报告。自动验证环境为 Windows、Node.js 22.16.0、Playwright 1.58.2 和无头 Chromium，3D 检查使用 SwiftShader。

## 边界与复盘

- 需要 WebGL2 与 EXT_color_buffer_float；不支持时显示原因，无法在纯 Canvas 上提供同等模拟。
- 这是交互式数值演示，不用于工程流体精度或性能结论。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gpt-6-astra-max-r01`
- 模型：GPT-6 Astra；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：保存用户批量请求、用户仓库指令与所选任务正文原文。当前会话逐个执行，系统/开发者上下文与其他主题的工具过程未完整导出，不作为隔离或同输入公平评测。 用户后续“继续”另存 evidence/follow-up.md，未改写首次输入快照或任务正文。
- 工具：Codex。Windows / PowerShell / Node.js 22.16.0；按用户明确指定记录 gpt-6-astra / max；当前会话直接执行，未委派子代理。最新版本优先；已归档主题跳过。基线目录已有其他实验残留，未读取实现，移至 .cache/preexisting-run-artifacts-20261016 保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 13 %（ChatGPT Plus 周额度）（11 个案例；批次 gpt-6-astra-max-2026-10-16；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/gpt-6-astra-max-r01/index.html)

### 部署适配记录

- 本轮按所选任务正文创建新实验，当前会话直接执行；首次实现保留为 evidence/first-pass.zip，后续修复均由本会话代理完成，无人工代码修改。
- 根据首次截图增强初始染料注入的可见度；保留原有场计算与参数控制。
- 从 experiment/gpt-6-astra-max-20261016 分支迁移到 main；保留原始实现、输入、首次产物、修复记录和验证报告。
- 迁移归档时于 2026-10-17 在 1440px 桌面视口补拍真实运行截图，并按案例截图评分规则 v2 逐图复核；截图、维度与依据保存在本实验记录。
- 本轮 11 个案例的订阅额度消耗与耗时由用户按批次提供，关联 billing batch gpt-6-astra-max-2026-10-16，不拆分为单案例。
<!-- archive:end -->
