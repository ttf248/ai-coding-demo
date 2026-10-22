# 图片粒子化与手势还原

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/pixel-flow/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，Three.js r160 与 MediaPipe Hands 均通过 CDN 引入，**需要联网**。
- 入口：本目录 `index.html`。

### 实现方式

- 用 Canvas 按可调采样步长（2–14）读取图片像素，为每个采样点生成一个粒子，保存它的 `home`（原位）、`pos`、`vel`、`color`、`glow`、`seed`。
- 初始状态是**随机飘散**而不是直接显示原图。力场移动到某处时，附近的粒子获得额外加速度，朝各自的 `home` 归位，配合弹簧与阻尼（damp 0.86）收敛。
- 实时显示还原进度；超过 98% 自动进入「完成」阶段，并提供「重新飘散」重置。
- **手势**：基于 MediaPipe Hands 的 21 个关键点，用「指尖到手腕的距离」与「掌指关节到手腕的距离」比较来判断该指是否伸展。
  - 张开手掌（≥4 指伸展）→ 激活还原
  - 握拳（≤1 指伸展）→ 暂停吸引
  - 胜利手势（食指 + 中指伸、无名指小指收）→ 放大 / 缩小力场半径
  - 手部骨架绘制在镜像 canvas 上
- 没有本地图片也能直接体验：内置一张程序生成的示例图（渐变天空 + 太阳 + 三层山 + 星点）。也支持本地文件上传。

### 验证记录

| 项目 | 结果 |
| --- | --- |
| 示例图载入 | 采样步长 5 时生成 2028 个粒子（260×195） |
| 粒子动画 | 运行中 |
| 鼠标力场 | 拖拽后还原进度到 100%，阶段变为「完成」 |
| 「重新飘散」→「完全还原」链路 | 生效 |
| 开启摄像头 | 提示「摄像头启动失败：Requested device not found，已使用鼠标力场」 |
| 390px 横向溢出 | 无溢出 |

**未能实测的部分**：本机没有摄像头设备，MediaPipe 的手势识别链路本身（张开手掌激活、握拳暂停、胜利手势调半径）无法在本次环境中验证，只验证到「无摄像头时给出明确提示并自动降级为鼠标力场」这一步。需要接摄像头时可通过页面上的开启摄像头按钮实测。

控制台唯一的报错是 MediaPipe 自身的 `Failed to acquire camera feed: NotFoundError`，属于环境缺失导致的预期报错。

### 过程中修掉的真实问题

1. `let camera` 与 Three.js 的 `const camera` 重名，导致 `SyntaxError: Identifier 'camera' has already been declared`，整页无法启动。改名 `mpCamera`。
2. 初始 `BufferGeometry` 缺少 `aGlow` 属性，`animate()` 在第一帧同步抛错，中断了模块后续的全部初始化（图片载入、按钮绑定等）。补齐属性并加了守卫，同时调整了初始化顺序。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--minimax-m3-1-flash-preview-max-r02`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：本目录 prompt.md 与 demos/pixel-flow/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code 桌面版（MiniMax M3.1 Flash Preview）。Three.js 与 MediaPipe 均走 CDN，network 为 required。本机无摄像头设备，MediaPipe 手势识别链路未能在本环境实测；已验证到「无摄像头时给出明确提示并自动降级为鼠标力场」这一步，控制台唯一的报错是 MediaPipe 自身的 NotFoundError（Requested device not found）。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。 本轮使用 MiniMax Code 桌面版执行，未使用 Claude Code。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 37 %（Max 订阅套餐五小时额度）（11 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-13；未记录单案例费用）
- [粒子还原](../../../../demos/pixel-flow/runs/minimax-m3-1-flash-preview-max-r02/index.html)

### 部署适配记录

- 内置程序生成的示例图（渐变天空 + 太阳 + 三层山 + 星点），没有本地图片也能直接体验；也支持本地文件上传。
- 初始为随机飘散状态而非直接显示原图，还原度超过 98% 自动进入「完成」阶段，并提供「重新飘散」重置。
- 手势识别基于 21 个关键点的指尖-腕距与掌指关节-腕距比较来判断伸展数量。
- 修复 let camera 与 Three.js 的 const camera 重名导致 SyntaxError 使整页无法启动；以及初始 BufferGeometry 缺 aGlow 属性导致 animate() 首帧同步抛错、中断模块后续全部初始化。
- 摄像头不可用时给出明确提示并切换到鼠标力场，而不是静默失败或白屏。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/minimax-m3-1-flash-preview-max）/demos/pixel-flow/runs/minimax-m3-1-flash-preview-max-r01；当前 main 已存在该轮号，保留历史并迁入为 minimax-m3-1-flash-preview-max-r02。
- 迁移验证：使用本仓库本地 HTTP 入口补拍实际桌面截图 screenshot.png；Chromium 确认入口可加载且无页面异常，390px 视口横向溢出为 0。
- 迁移验证补充：本 static 入口可通过 file:// 直接打开，Chromium 页面异常为 0。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
