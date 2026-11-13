# Pixel Flow 粒子手势还原

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1，含中英文）。

## 运行与复盘

- 运行方式：浏览器打开本目录 `index.html`。依赖 CDN（Three.js r128、MediaPipe Hands / drawing_utils），需联网，非离线。
- 摄像头注意：`getUserMedia` 仅在 **HTTPS 或 localhost** 下可用；file:// 直接打开时摄像头不可用，应用自动降级为「鼠标力场」模式（移动鼠标 = 力场，按住左键增强吸引并启动还原），功能仍可完整体验。GitHub Pages（HTTPS）上摄像头手势可用。
- 入口：`index.html`（单文件，HTML/CSS/JS 内联）。
- 实现要点：
  - 图片 → 粒子：`<input type="file">` 上传或内置示例图；Canvas 按采样间隔（2–8px 可调）提取像素，每像素生成一个粒子，存储原始位置与颜色；初始为随机飘散粒子流（锚点 + 正弦流场）。粒子上限 42000 保性能。
  - 渲染：Three.js `THREE.Points` + BufferGeometry（position/color），圆形软 sprite，单 DrawCall。
  - 手势：MediaPipe Hands 21 关键点；按指尖/指根到手腕距离判定伸指数 → ≥3 张开手掌（激活吸引）、≤1 握拳（暂停）；手掌中心（腕+四 MCP 均值）映射到场景坐标作为力场中心。PiP 镜像视频 + 关键点连线叠加。
  - 力场还原：张开手掌时全局弱吸引 + 力场半径内强吸引（随距离衰减），粒子加速归位；握拳暂停飘散；「完全还原」完成手势一键归位。进度=接近目标粒子占比，>98.5% 自动判定完成。
  - UI：玻璃拟态控制面板（上传/示例/散开/还原/完成、采样/半径/速度滑杆、手势状态、进度条）、摄像头 PiP、操作提示、加载指示；响应式。
  - 降级与容错：无摄像头 / 非安全上下文 / MediaPipe 未加载时给出状态提示并启用鼠标力场，不中断。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器，HTTP 打开，脚本断言；强制 resize 1280×800）：
  - 示例图生成 4356 粒子，初始 mode=scatter；单 DrawCall，gl.getError()=0，控制台无报错。✔
  - 完全还原 progress=1；散开 progress=0（修复后散开会重置粒子到锚点）；还原+力场迭代收敛（150 步 0.84，持续至 1）。✔
  - 手势分类：合成关键点张开手掌→open（ext 4）、握拳→fist（ext 0）。✔
  - readPixels 中心 [84,54,131] 非黑，确认粒子实际绘出。✔
  - MediaPipe Hands 全局加载成功；摄像头实机手势与 60FPS 留待 HTTPS + Playwright 复核（内置浏览器无摄像头）。
- 复盘：力场「局部加速 + 全局弱吸引」组合既保证最终完全还原，又让手部移动有即时局部反馈，交互直观。伸指数判定比单点距离更稳。无摄像头降级是可用性的关键——把鼠标映射为同一套力场接口，保证任何环境都能体验核心玩法。散开必须重置位置而非仅切模式，否则已还原粒子不会重新飘散。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：批量指令原文与任务正文 v1 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用与 Token 未提供，不分摊；其他执行条件为源声明。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [Pixel Flow 粒子手势还原](../../../../demos/pixel-flow/runs/qwen4-max-preview-xhigh-r01/index.html)

### 部署适配记录

- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入与复盘，不合并测试基线。
- 2026-11-13：追加 defer 公共统计引用，补采真实截图，按 v3 由 Codex 逐图视觉复核；源声明不等于独立功能验收。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。 未提供真实相机与手部识别；不以鼠标或按钮代替手势证据。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
