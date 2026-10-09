# Pixel Flow 图片粒子化与手势还原

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。通过静态 HTTP 托管或浏览器直接打开。

核心实现：
1. **图片像素化粒子提取**：利用 HTML Canvas API 读取上传图片或内置样本，按网格离散化采样颜色与空间坐标，映射为万级 Three.js `Points` 粒子云。
2. **初始飘散与涡流动力学**：初始状态下粒子受到三维涡旋噪声（Curl Noise）驱动，呈现自由扩散星云态。
3. **视觉手势识别与双模交互**：
   - 接入 MediaPipe Hands 模型追踪实时视频流手部关键点，根据手掌与指尖间距识别“张开手掌”（凝聚还原）与“握拳”（释放飘散）。
   - 提供备用鼠标/触控力场牵引，确保无摄像头权限环境下的完整交互性与还原进度指示。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.76 USD（11 个案例；原始消耗 414 GitHub Copilot credits，换算比例 10 USD / 1500 GitHub Copilot credits；批次 github-copilot-gemini-3-8-flash-high-2026-10-09；未记录单案例费用）
- [Pixel Flow](../../../../demos/pixel-flow/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/gemini-3.8-flash`，提交 `7fea10d`。迁入时原始输入与实现未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
