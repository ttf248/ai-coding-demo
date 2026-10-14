# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)（主题任务正文 v1 逐字快照）。本轮批量触发语：“所有的案例 demo 全部都做一遍，模型名称 qwen3.8-flash 档位 high, 用当前会话就好了”。当前会话按 topics:active 清单直接执行。

## 批次记录

Aliyun 批次共 11 个案例，合计 3.6 CNY，耗时 1h 18m 26s；费用和耗时均为批次总计，不拆分为单案例。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 index.html（WebGL2 单文件，离线，无 CDN）。
- 实现要点：真实 GPU Navier–Stokes 求解管线——半浮点双缓冲（RGBA16F 染料/RG16F 速度/R16F 标量），每帧 curl → 涡量力 → 散度 → 压力清零(0.8 衰减) → Jacobi 压力迭代(可调 4–60) → 梯度减除投影 → 速度/染料平流（染料消散独立系数）；指针/触摸拖动以高斯 splat 注入动量与三色之一（3 组调色板轮换），非粒子轨迹亦非渐隐画布。设备像素比上限 1.5、分辨率滑杆 96–384（染料 2×），重建帧缓冲前对全部 texture/framebuffer 显式 delete；启动检测 WebGL2、EXT_color_buffer_float 与 RGBA16F FBO 可渲染性，失败给整页明确提示；暂停仅停步进而保留渲染，清空用 value=0 清零 pass，截图 preserveDrawingBuffer + toDataURL。
- 验收（headless Chromium SwiftShader）：WebGL2 可用时不显示错误页；拖动注入后画面演化；清空+暂停后连续两帧截图字节一致（演化真实停止）；390×844 无水平溢出；无 JS 错误。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--qwen3-8-flash-high-r01`
- 模型：Qwen 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：当前会话直接执行主题任务正文 v1，完整原始输入为该正文的逐字快照，未附加其他材料；批量触发语记录于本 run 的 Readme。
- 工具：Claude Code CLI（当前会话）。模型名称与档位按用户给定登记（qwen3.8-flash / high）；Windows 11 + Node 22，当前会话生成并自检，未委派子代理；实现过程中的自我修正记录于 changes 与 Readme。 迁移到 main 时，按用户确认将测试分支误记的档位从 default 更正为 high。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 3.6 CNY（11 个案例；批次 qwen3-8-flash-high-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/qwen3-8-flash-high-r01/index.html)

### 部署适配记录

- 实现期清理：显示着色器去掉冗余混合行；half-float 线性过滤按 WebGL2 核心能力处理。
- 窗口尺寸变化时重建 GPU 资源并显式 deleteTexture/deleteFramebuffer，重建后坐标按归一化 UV 保持正确。
- 迁移时根据用户确认将误记的 default 档位纠正为 high，并同步更正实验 ID 与路径。
<!-- archive:end -->
