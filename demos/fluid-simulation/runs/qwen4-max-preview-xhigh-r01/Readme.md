# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 `index.html`（file:// 或 HTTP 静态托管均可），无后端、无 CDN、无构建步骤；需要 WebGL 与半浮点纹理支持。
- 入口：`index.html`（单文件，HTML/CSS/JS 全部内联）。
- 实现要点：
  - 真实 GPU 流体求解：涡度 → 涡度增强（卷曲）→ 散度 → 压力 Jacobi 迭代 → 梯度减除（速度投影）→ 半拉格朗日平流（速度 / 染料双场），禁止粒子或渐隐画布替代。
  - WebGL2 优先（EXT_color_buffer_float，RG16F / R16F / RGBA16F），WebGL1 回退（OES_texture_half_float，全 RGBA）；启动时检测 Framebuffer 完整性，不支持时显示明确中文提示并隐藏画布，不出现空白页。
  - 纹理统一 NEAREST + 着色器内手动双线性插值；平流区分速度网格与染料网格 texelSize，保证不同分辨率下平流速度一致。
  - 控制：染料颜色 / 随机、注入力度、染料消散、压力迭代次数、模拟分辨率（128–384，重建时删除旧纹理与 FBO）；暂停 / 继续、清空、重置参数、PNG 截图。
  - 设备像素比上限 1.5；模拟网格与画布尺寸解耦，窗口缩放后触摸坐标按 rect 归一化，仍然正确。
  - 多点触摸同时注入；上下文丢失时提示刷新。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器，file:// 打开，WebGL 2.0 Chromium，脚本断言）：
  - 初始演示 splat 后染料 / 速度场非零；30 步后两场持续演化。✔
  - 向右拖动 splat 产生 +x 速度（180.4），向上拖动产生 +y 速度。✔
  - 消散 0 与 4 对比：60 步后染料总量 544 vs 13，参数确实影响计算。✔
  - 暂停后 30 帧染料总量逐位不变；继续后恢复演化。✔
  - 清空后染料总量为 0。✔
  - 分辨率 192→256 重建成功，旧 GPU 资源已删除。✔
  - 截图 toDataURL 有效（>5KB）。✔
  - 以 initScript 将 getContext 置 null 模拟无 WebGL：显示「当前浏览器或设备不支持 WebGL…」，画布与控件隐藏，无空白页。✔
- 复盘：首版平流着色器对速度与染料共用同一 texelSize，导致染料平流速度按分辨率比例失真；拆分为 texelSize（速度网格）与 sourceTexelSize（源网格）后物理一致。WebGL1 无 RG 格式，统一回退 RGBA 并检测可渲染性。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：批量指令原文与任务正文 v1 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户迁入时确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用和 Token 未提供，不分摊至单案例；其余执行条件为源记录声明。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [流体实验台](../../../../demos/fluid-simulation/runs/qwen4-max-preview-xhigh-r01/index.html)

### 部署适配记录

- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交工作区迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入字节与源复盘，不合并测试基线。
- 2026-11-13：迁入后追加 defer 公共统计引用，补采真实页面并按现行 v3 由 Codex 逐图视觉复核；源码声明和截图不等同完整功能验收。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。 默认渲染发生上下文丢失，使用 D3D11 请求后通过真实拖动和暂停补拍；不推断实际硬件。保留全部失败尝试。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
