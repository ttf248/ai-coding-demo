# 像素粒子 · MiniMax M3

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

按主题 v1 任务生成单 HTML 图片粒子化 + 手势还原 Web 应用。

实现要点：

- Three.js r160 via CDN；Canvas API 提取像素数据 → BufferGeometry 粒子。
- MediaPipe Hands via jsDelivr CDN（`@mediapipe/hands@0.4.1675469240`），手部 21 关键点驱动「力场」位置。
- 内置暖色调「日落幻境」示例图（黄昏天空 + 山脉 + 凤凰剪影 + 火星），同时支持上传本地图片。
- 自定义 36×36 暖色径向渐变 sprite，加性混合。
- 加载层（呼吸球 + spinner）首次绘制后隐藏。
- 键盘 fallback（无摄像头）：
  - 方向键：移动力场（按压 dt 累积）。
  - Space：切换吸引。
  - R：重置还原。
  - S：粒子散开。
  - B：boost 模式（加速吸引）。
  - O：autoOrbit（力场自动绕场景旋转）。
- 摄像头 / MediaPipe 加载失败时回退到键盘 + 按钮；摄像头释放后键盘控制回归。
- 严格处理非图像 MIME、>18 MB 文件、`getUserMedia` 错误、安全上下文（HTTPS）检查。
- 响应式断点 960 / 720 / 390 px；移动端力场 92 px。
- 状态胶囊：手势状态、粒子数、源文件名（长名截断）。

直接打开 `index.html` 即可（需联网加载 Three.js / MediaPipe CDN）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--minimax-m3-unknown-r01`
- 模型：MiniMax M3；推理档位：unknown
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：保留主题 v1 任务正文。
- 工具：未记录。通过 minimax-m3 模型执行；具体平台上下文未记录。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/pixel-flow/runs/minimax-m3-unknown-r01/index.html)

### 部署适配记录

- 按主题 v1 任务生成单 HTML 图片粒子化 + 手势还原应用。
- Three.js r160 + MediaPipe Hands via CDN；Canvas 提取像素数据生成粒子流。
- 键盘 fallback：方向键移动力场、Space 切换吸引、R 重启、S 散开、B 加速、O 自动环绕。
- 暖色调「日落幻境」示例图（自带）与可上传本地图片两种入口。
<!-- archive:end -->
