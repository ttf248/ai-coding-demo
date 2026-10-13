# 图片粒子化与手势还原

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与验证

- 入口：`index.html`。ES Module + import map 加载 Three.js r160（unpkg），MediaPipe Tasks Vision 经 jsdelivr 动态加载；**需联网且经 HTTP 托管打开**（file:// 下 ES 模块受浏览器限制）。
- 流程：选择本地图片 → Canvas 采样（长边 110 格，跳过透明像素，约 8 千粒子）→ 粒子初始随机飘散；摄像头 + MediaPipe HandLandmarker 识别手势：张开手掌生成跟随手心的力场（场内粒子加速还原并锁定），握拳暂停；进度条实时显示还原比例；摄像头不可用时自动回退为鼠标/触摸按住拖动。
- 手势判定：五个指尖到手腕的平均距离与手部尺寸之比，> 1.35 判为张开、< 0.95 判为握拳。

### 验收记录（Playwright Chromium + SwiftShader，HTTP 加载，2026-10-14）

- 无摄像头环境：明确提示并回退鼠标/触摸模式 ✓
- 上传 60×40 图片 → 粒子数符合 110 网格上限采样；初始平均偏移 > 0.5（确实散开）✓
- 模拟张开手掌：中心区域粒子还原、进度单调增长；力场跟随手部移动（远处区域开始还原）✓
- 模拟握拳：进度完全停止变化 ✓；重新散开：进度归零 ✓
- 鼠标按住拖动吸引粒子 ✓；移动端按住拖动可用、390px 无水平溢出 ✓
- 画面渲染非黑 ✓；假摄像头设备下视频流启动、摄像头路径无 JS 错误 ✓

## 复盘

- 按任务正文实现“像素 → 粒子 → 力场还原”闭环；MediaPipe 模型经 CDN 加载，手势数据换算为场景世界坐标。
- 摄像头依赖浏览器授权与设备，无法保证任何环境可用，因此补充指针替代交互（见 run.json changes）以保证核心体验可演示；手势模拟验收钩子与摄像头识别走同一力场数据通路。
- 已知简化：粒子无 Tween 库、按物理式吸引（加速度 + 阻尼 + 锁定阈值）实现平滑还原；采样上限 110 格控制粒子规模以保证帧率。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--deepseek-v4-pro-0813-max-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整输入快照：用户总体指令（批量执行全部案例、模型名 DeepSeek-V4-Pro-0813、档位 max、使用当前会话）+ 任务正文 v1 逐字原文（含中英文两版，英文为中文的对应版本）。会话未另开、未委派子代理。
- 工具：claude-code。Claude Code CLI 会话（Windows 11），用户指定模型名称为 DeepSeek-V4-Pro-0813；会话环境自报模型字符串 deepseek-v4-pro[1m]。推理档位 max（/effort 已设 max）。验收用 Playwright Chromium + SwiftShader（--enable-unsafe-swiftshader）经本地静态服务器（HTTP）加载执行；摄像头路径用 --use-fake-device-for-media-stream 假设备验证启动。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 13.77 CNY（11 个案例；批次 deepseek-v4-pro-0813-max-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/deepseek-v4-pro-0813-max-r01/index.html)

### 部署适配记录

- 首次生成后调整：视口适配重构——粒子保存归一化图像坐标，窗口尺寸变化时重算相机视锥与粒子目标位置（原先固定 12:7 视锥会被画布拉伸变形）。
- 首次生成后调整：补充鼠标/触摸替代交互（按住拖动 = 张开手掌的吸引区域），在摄像头不可用/未授权时启用并明确提示；摄像头 + MediaPipe 手势路径保持完整实现。
- 首次生成后调整：增加 __PIXELFLOW.readPixel() 验收钩子（同步渲染后立即读回像素，默认绘图缓冲在合成后被清空）。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/pixel-flow/runs/deepseek-v4-pro-0813-max-r01（分支 experiment/deepseek-v4-pro-0813，提交 90de279）；保留源实验的已测试代码、完整输入快照与复盘记录。
- 迁移验收：通过本地 HTTP 页面补拍 1440×960 Edge 桌面截图；入口返回 HTTP 200、无页面脚本异常，390px 视口未发现页面横向溢出。
<!-- archive:end -->
