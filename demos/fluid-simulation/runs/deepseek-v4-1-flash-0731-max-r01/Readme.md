# 彩色流体 · 首轮

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1 原文快照）。

## 运行与复盘

- 运行方式：DeepSeek-V4.1-Flash-0731（档位 max）在 Claude Code 当前会话直接生成；未使用子代理、未提供后续追问。
- 产物入口：[index.html](index.html)（纯静态单文件；WebGL 浮点纹理渲染）。
- 验证记录（Playwright，HTTP 与 file:// 双路径；帧缓冲像素采样断言）：
  - 初始化成功（WebGL2 + half-float 纹理 + 线性过滤）
  - 首屏随机注入即有流体；拖动后在拖动起点出现染料（RGB 采样 220,75,162）
  - 暂停后画面逐像素完全静止（sum 862 === 862）；继续后随时间演化
  - 压力迭代次数、模拟分辨率（64/128/256）、颜色、力度、消散滑杆全部生效
  - 清空后染料清零；重置参数恢复默认
  - 截图 PNG 下载有效；模拟不支持 WebGL 时显示明确回退提示（不空白）
  - 390px 触摸注入生效、无水平溢出；file:// 直接打开可运行
- 过程记录：验证阶段发现压力场每帧被乘以迭代次数（误用为 clear 系数）导致速度场爆炸、画面全黑；已改为独立的 0.8 衰减系数。另按禁用线性过滤的环境保留了手动双线性采样的着色器分支。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--deepseek-v4-1-flash-0731-max-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：任务正文 v1 原文。单次输入，未附后续追问或其他上下文。
- 工具：Claude Code 2.1.295。用户指定模型 DeepSeek-V4.1-Flash-0731、档位 max；当前会话直接生成，未使用子代理；Windows 11 / Node v22.16.0。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.78 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-max-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/deepseek-v4-1-flash-0731-max-r01/index.html)

### 部署适配记录

- 纯单文件 WebGL 实现；不支持浮点纹理渲染时给出明确提示（不空白）。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/fluid-simulation/runs/deepseek-v4-1-flash-max-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 打开实际入口并补拍桌面截图；390px 检查无页面横向溢出，Playwright 控制台无页面错误。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
