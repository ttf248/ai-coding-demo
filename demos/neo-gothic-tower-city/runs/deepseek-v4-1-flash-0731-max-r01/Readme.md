# 哥特城市 · 首轮

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1 原文快照）。

## 运行与复盘

- 运行方式：DeepSeek-V4.1-Flash-0731（档位 max）在 Claude Code 当前会话直接生成；未使用子代理、未提供后续追问。
- 产物入口：[index.html](index.html)（单文件；three.js 经 CDN 加载）。
- 验证记录（Playwright，HTTP 与 file:// 双路径；帧缓冲亮度采样）：
  - 生成 25 座塔楼，火焰粒子 990、星 900；画面非全黑（sum≈3880）
  - 自动漫游：相机持续移动；拖拽环视产生 yaw 偏移并保持有效
  - 滚轮拉近（距离 262 → 224）；关闭漫游后相机几乎静止
  - 粒子动效可暂停；390px 无水平溢出且画面正常；file:// 打开运行
- 备注：海面为自定义正弦波着色器，火焰为自定义粒子着色器；依赖 CDN，加载失败时进入带「待确认」说明的回退界面（按任务正文要求）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--deepseek-v4-1-flash-0731-max-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：任务正文 v1 原文。单次输入，未附后续追问或其他上下文。
- 工具：Claude Code 2.1.295。用户指定模型 DeepSeek-V4.1-Flash-0731、档位 max；当前会话直接生成，未使用子代理；Windows 11 / Node v22.16.0。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.78 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-max-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/neo-gothic-tower-city/runs/deepseek-v4-1-flash-0731-max-r01/index.html)

### 部署适配记录

- three.js 经 CDN 加载；加载失败时进入带『待确认』说明的回退界面。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/neo-gothic-tower-city/runs/deepseek-v4-1-flash-max-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 打开实际入口并补拍桌面截图；390px 检查无页面横向溢出，Playwright 控制台无页面错误。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
