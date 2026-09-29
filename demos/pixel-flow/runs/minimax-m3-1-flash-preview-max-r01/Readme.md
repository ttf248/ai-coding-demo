# Pixel Flow · 图片粒子化与手势还原（任务正文 v1）

把一张本地图片拆成动态粒子流，再用摄像头捕捉的手势把粒子「捞」回原图。
纯 Vanilla JS 单页应用，无构建步骤，双击 `index.html` 即可打开（需联网加载 CDN 依赖）。

## 技术栈

- 前端：原生 JavaScript + HTML + CSS
- 3D：Three.js r160（`THREE.Points` + 自定义 `ShaderMaterial`）
- 手势：MediaPipe Hands（`hands.js` + 打包的 wasm / 模型资源）
- 图像处理：HTML Canvas 2D `getImageData` 取像素

## 实现要点

### 1. 图片 → 粒子

`buildFromImage()` 先把图片按 `采样密度`（默认 12px 一个采样点）缩到小尺寸画布，再 `getImageData`
逐像素读取。每个采样点生成一个粒子，记录三组数据：

- `target`：它在原图中的目标坐标（映射到 XY 平面，z 按亮度做一点点厚度）；
- `scatter`：它在球壳里的初始飘散位置；
- `colors`：原图颜色。

`target` 与 `scatter` 一起作为自定义 attribute 传入 ShaderMaterial，运行时在两者之间插值。

### 2. 力场

手部关键点的掌心（0、5、9、13、17 号点均值）从 MediaPipe 的归一化坐标映射到粒子平面的 XY，
作为力场中心。半径内的粒子按 `dt × force × (1 - d/r) × boost` 累加还原度，越靠近中心吸引越强。

### 3. 手势识别

用「指尖到手腕的距离 > PIP 到手腕距离 × 1.06」判断手指是否伸直，组合出：

| 手势 | 判定 | 作用 |
|---|---|---|
| 张开手掌 | 4 指伸直 | 激活力场吸引 |
| 握拳 | 4 指全收 | 暂停吸引，保持当前进度 |
| 捏合 | 拇指与食指距离 < 0.055 且其余手指收起 | 吸引强度 ×2.4 |
| 比二 | 仅食指与中指伸直 | 立即完成还原（全图 progress = 1） |

还原度用二次缓动 `e = p<0.5 ? 2p² : 1-(-2p+2)²/2`，前半段慢、后半段快，粒子落位时不会突兀。

### 4. 阶段与状态

平均还原度 >2% 进入「聚集还原」，>99.5% 进入「完整还原」，三个阶段在粒子画布下方以进度条呈现。
右侧实时显示粒子数、平均还原度、FPS 与手部检测状态。

## 参数

采样密度、粒子大小、力场半径、吸引强度、飘散流速，以及三套配色（原图 / 冷调 / 霓虹）。
另有「打散」「自动还原演示」「切换配色」三个快捷操作。

## 运行

摄像头依赖 `https` 或 `localhost`（浏览器安全策略）。本地验证可以：

```sh
npx serve .          # 或任意静态服务器
# 打开 http://localhost:3000
```

没有摄像头时点「鼠标控制力场」：鼠标在粒子画布内移动即等价于张开手掌，按住 `Shift` 等价于捏合加速。

## 已知边界

- 首次进入会自动载入一张程序化生成的示例图（山峦日落），避免空屏；也可以自行选择本地图片。
- 摄像头模型在页面加载后才按需拉取（约 5 MB），首次开启会有等待。
- 只跟踪单手；MediaPipe 偶尔丢帧时会跳过该帧继续下一帧。
- 「比二」为瞬时完成手势，不区分左右手。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：app；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：用户指令、覆盖范围确认与任务正文 v1 原文均已完整留存（任务正文含中英双版本）。无图片、附件或历史上下文。
- 工具：Claude Code（当前会话）。模型 MiniMax M3.1 Flash Preview，推理档位 max，单会话直接执行，未委派子代理。Three.js 与 MediaPipe 走 unpkg CDN，需要联网；摄像头在测试环境中不可用，手势链路按代码逻辑与 HUD 状态核对，未做真人摄像头验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [应用入口](../../../../demos/pixel-flow/runs/minimax-m3-1-flash-preview-max-r01/index.html)

### 部署适配记录

- 降级能力：浏览器只在 https 或 localhost 下开放 getUserMedia，直接打开本地文件时摄像头不可用。补充「鼠标控制力场」开关，鼠标在粒子画布内移动即等价于张开手掌，按住 Shift 等价于捏合加速，使无摄像头环境也能完整验证力场与还原逻辑。
- 渲染修正：粒子全部归位后加色混合会过曝成白块，改为普通混合并按还原度微调亮度，完整还原时能正确还原出原图配色。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/pixel-flow/runs/minimax-m3-1-flash-preview-max-r01；保留该测试轮号。
<!-- archive:end -->
