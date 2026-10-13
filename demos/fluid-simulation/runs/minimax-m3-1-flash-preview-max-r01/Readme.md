# WebGL 稳定流体实验台

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/fluid-simulation/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，全部 shader 以字符串内联在文件中，无外部资源，断网可用。
- 入口：本目录 `index.html`。

### 实现方式

在 GPU 上按稳定流体的完整求解顺序逐步跑 ping-pong FBO：

1. **平流（advection）**：速度场与染料场的半拉格朗日回溯采样。
2. **旋度（curl）**：求涡量。
3. **涡量约束（vorticity confinement）**：把数值耗散掉的小尺度涡旋补回去。
4. **散度（divergence）**。
5. **压力**：Jacobi 迭代求解泊松方程，迭代次数可调。
6. **梯度投影（project）**：减去压力梯度得到无散场。
7. 染料平流并按消散系数衰减。

优先使用 WebGL2，不可用时回退 WebGL1；半浮点纹理能力检测失败时显示明确提示面板，而不是留下白屏。

可调参数：注入力度、染料消散、压力迭代次数、模拟分辨率、黏度扩散、染色，并提供暂停 / 继续、清空、重置参数与 PNG 截图。

### 验证记录

headless Chromium（SwiftShader 软件渲染）下实测：

| 项目 | 结果 |
| --- | --- |
| 上下文 | WebGL2，半浮点纹理可用 |
| 默认参数 | 速度场 384×192、染料场 768×384，62 fps |
| 染料演化 | 随时间持续变化并扩散 |
| 拖动注入 | 有效 |
| 暂停 | 画面像素完全冻结 |
| 继续 | 恢复演化 |
| 清空 | 生效 |
| 改分辨率 | 重建为 192×96 / 384×192 |
| 截图 | 成功导出 9863 字节 PNG |
| 改窗口尺寸 | 仍可正常交互 |
| 390px 横向溢出 | 无溢出 |
| 控制台错误 | 0 |

### 已知限制

- 软件渲染下的帧率不代表真实 GPU 表现。
- 不支持流体与场景的几何碰撞，只在自由空间求解。

### 过程中修掉的真实问题

1. 颜色控件改动后染料颜色不生效（取色用了 `new Function`，改为直接读值）；另加「配色随机」复选框，关闭时使用所选颜色。
2. `pointerleave` 被误判为拖拽结束，指针移出画布就断链。
3. `blitBuf` 声明后未赋值。
4. `resizeCanvas` 中一处无效表达式。
5. 重建资源时未释放旧的 framebuffer 与纹理，已补上 `deleteFramebuffer` / `deleteTexture`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：本目录 prompt.md 与 demos/fluid-simulation/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code / MiniMax-M3.1-Flash-Preview。纯静态单文件，shader 全部内联，无外部依赖，network 为 offline。在 headless Chromium（SwiftShader 软件渲染）下实测为 WebGL2 + 半浮点纹理可用，62 fps。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [流体实验台](../../../../demos/fluid-simulation/runs/minimax-m3-1-flash-preview-max-r01/index.html)

### 部署适配记录

- 优先使用 WebGL2，不可用时回退 WebGL1；半浮点纹理能力检测失败时显示明确的提示面板，而不是白屏。
- 新增「配色随机」复选框：原实现的染料颜色控件改动后不生效，改为关闭时使用所选颜色、开启时随机配色。
- 实测暂停后画面像素完全冻结、继续后恢复、清空生效、改分辨率后速度场与染料场同步重建；重建时显式 deleteFramebuffer/deleteTexture 释放旧资源。
- 修复 pointerleave 误判为拖拽结束、blitBuf 未赋值、resizeCanvas 中一处无效表达式。
<!-- archive:end -->
