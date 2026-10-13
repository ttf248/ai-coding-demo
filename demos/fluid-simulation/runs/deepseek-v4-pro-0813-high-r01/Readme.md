# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/fluid-simulation/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`，浏览器直接打开或静态托管均可运行，无外部依赖。
- 实现：WebGL2（RGBA16F）或 WebGL1（半浮点扩展）双缓冲实现稳定流体求解，速度场与染料场分离；每步依次执行速度自平流、染料平流、散度计算、雅可比压力迭代、速度投影。拖动画面注入颜色与动量。
- 控制：染料颜色、注入力度、染料消散、压力迭代次数、模拟分辨率（64/128/256）、暂停/继续、清空、重置参数、PNG 截图。
- 验证：拖动方向影响流动；染料与速度随时间演化；参数变化影响计算；暂停后画面停止演化；清空移除已有流体；截图可下载；不支持 WebGL 时显示明确提示而非空白页；移动端可运行且无水平溢出。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/fluid-simulation/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
- 迁移验收备注：当前 Edge 无头环境未能创建 WebGL2 RGBA16F 帧缓冲（FBO incomplete），页面显示其原有 WebGL 不支持提示；未改写模型产物。
<!-- archive:end -->
