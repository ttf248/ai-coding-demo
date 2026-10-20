# 彩色流体实验台 · WebGL 压力投影

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- 每帧在 GPU 上执行：速度平流（半拉格朗日）→ 涡量约束 → 散度 → 压力雅可比迭代 → 梯度减除（速度投影）→ 染料平流，是真实的不可压缩求解而非粒子轨迹或画布淡出。
- 离散格式经过实测标定：散度用前向差分、梯度用后向差分，与窄模板拉普拉斯严格配对，避免中心差分组合导致的投影正反馈；涡量项采用饱和化（C/(1+|C|)）防止能量指数增长。
- 提供染料颜色、注入力度、染料消散、速度消散、压力迭代次数、模拟分辨率、染料分辨率倍率与涡量强化等参数，以及暂停、继续、清空、重置参数与 PNG 截图。
- 内置 WebGL2 与 EXT_color_buffer_float 检测、上下文丢失兜底提示、渐进质量档位（帧率不足时自动降档，重建时保留已有内容）与绘制缓冲上限。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；软渲染环境（SwiftShader）下需要预热 GPU 进程并依赖渐进质量档位，真实 GPU 可跑满档。
- 验证记录：
  - 拖动注入后染料场与速度场均非零；左右与上下拖动的速度场统计明显不同，说明方向影响流动。
  - 压力迭代次数从 1 调到 40 后计算结果发生变化；暂停后 500ms 内染料与速度统计保持不变。
  - 清空后染料与速度归零；截图可生成 data URL；真实鼠标拖动可注入染料。
  - 禁用 WebGL 时页面给出明确提示而不是空白页；390px 视口无横向溢出。
- 已知限制：
  - 软渲染环境（SwiftShader）下需要先预热 GPU 进程，否则首次加载会被 GPU 进程回收；页面已用渐进质量档位兜底。
  - 压力场按 0.8 系数逐帧衰减作为迭代初值，投影略有欠松弛，长时间运行速度场会有轻微耗散。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：完整任务正文，与 demos/fluid-simulation/prompts/v1/prompt.md 一致。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；软渲染环境（SwiftShader）下需要预热 GPU 进程并依赖渐进质量档位，真实 GPU 可跑满档。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [流体实验台](../../../../demos/fluid-simulation/runs/minimax-m3-1-flash-max-r02/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/fluid-simulation/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
<!-- archive:end -->
