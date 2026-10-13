# 新哥特式塔楼城市漫游

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与验证

- 入口：`index.html`。使用 ES Module + import map 加载 Three.js r160（unpkg CDN），**需联网且经 HTTP 托管打开**（file:// 下浏览器限制 ES 模块加载）；本地可用仓库根目录 `npm run preview` 后访问对应路径。
- 操作：W A S D / 方向键移动，拖动鼠标环视（或点击画面锁定鼠标后直接环视，Esc 释放），滚轮调节移动速度；移动端左侧虚拟摇杆移动、右侧区域滑动环视。
- 场景：程序化生成的哥特式塔楼群（尖顶收分、扶壁、拱门、随机点亮窗列）环绕中央大教堂；海面顶点波浪 + 浪花粒子；塔尖火焰粒子；夜色雾效与月光。
- 『待确认』项：本次生成未遇到环境或库缺漏（Three.js CDN 可用），无需标记。

### 验收记录（Playwright Chromium + SwiftShader，HTTP 加载，2026-10-14）

- 场景初始化：≥10 座塔楼、火焰与浪花粒子系统就绪；画布渲染非全黑 ✓
- W 键向前漫游且受碰撞约束；拖动环视改变朝向；滚轮调速 ✓
- 海面顶点随时间演化 ✓
- 移动端 390px 无水平溢出、虚拟摇杆存在且可驱动移动 ✓；无 JS 错误 ✓

## 复盘

- 按任务正文自由裁量相机与粒子丰富度：采用第一人称漫游（含移动端双区触摸方案）替代纯自动运镜，火焰 110 粒 + 浪花 900 粒平衡视觉与性能；塔楼用确定性随机保证每次载入同一座城市。
- 碰撞为塔楼包围圆 + 城市边界圆的简易检测，行人高度固定 1.7m（无上下坡）。
- 已知简化：未使用阴影贴图（以雾效与发光材质营造氛围，保证软件渲染环境帧率）；城市规模（约 20 塔 + 大教堂）为展示级而非真实街区尺度，任务正文“真实比例”按塔楼单体比例（层高 5.4m、尖顶收分）执行。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--deepseek-v4-pro-0813-max-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整输入快照：用户总体指令（批量执行全部案例、模型名 DeepSeek-V4-Pro-0813、档位 max、使用当前会话）+ 任务正文 v1 逐字原文。会话未另开、未委派子代理。
- 工具：claude-code。Claude Code CLI 会话（Windows 11），用户指定模型名称为 DeepSeek-V4-Pro-0813；会话环境自报模型字符串 deepseek-v4-pro[1m]。推理档位 max（/effort 已设 max）。验收用 Playwright Chromium + SwiftShader（--enable-unsafe-swiftshader）经本地静态服务器（HTTP）加载执行。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 13.77 CNY（11 个案例；批次 deepseek-v4-pro-0813-max-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/neo-gothic-tower-city/runs/deepseek-v4-pro-0813-max-r01/index.html)

### 部署适配记录

- 首次生成后调整：玩家出生点由 (52, 44) 移至街道 (23, 0)，避免出生时位于塔楼碰撞半径内。
- 首次生成后调整：增加 __GOTHIC.readPixel() 验收钩子（同步渲染后立即读回中心像素，默认绘图缓冲在合成后被清空，直接 readPixels 读不到内容）。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/neo-gothic-tower-city/runs/deepseek-v4-pro-0813-max-r01（分支 experiment/deepseek-v4-pro-0813，提交 90de279）；保留源实验的已测试代码、完整输入快照与复盘记录。
- 迁移验收：通过本地 HTTP 页面补拍 1440×960 Edge 桌面截图；入口返回 HTTP 200、无页面脚本异常，390px 视口未发现页面横向溢出。
<!-- archive:end -->
