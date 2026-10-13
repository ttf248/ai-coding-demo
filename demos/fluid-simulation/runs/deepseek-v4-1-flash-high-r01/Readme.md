# 彩色流体实验台（DeepSeek-V4.1-Flash · high · r01）

单文件静态网页，直接打开 [index.html](index.html) 即可运行。无后端、无 CDN、无远程字体或图片、无构建步骤，`file://` 与 HTTP 静态托管都能运行（需要 WebGL 与浮点纹理）。

## 原始提示词

见 [完整原始输入](prompt.md)；任务正文与 [v1 任务正文](../../prompts/v1/prompt.md) 逐字一致。

## 实现要点

- 这是**真实的 GPU 流体求解**，不是粒子轨迹或渐隐画布。速度场、染料场、压力场都存放在半浮点纹理里，每个子步骤是一次全屏片元着色器绘制。
- 每个模拟步的管线：旋度 → 涡量约束 → 散度 → 压力衰减 → Jacobi 压力迭代（次数可调）→ 压力梯度减法（速度投影）→ 速度平流 → 染料平流。压力投影保证速度场保持不可压。
- 相机/画布尺寸与模拟分辨率解耦：改分辨率会**销毁旧的帧缓冲与纹理并重建**，画布尺寸变化不改变模拟分辨率。
- 支持检查：先取 WebGL2，失败退回 WebGL1；再确认半浮点类型与可渲染的浮点格式（`EXT_color_buffer_float` / `OES_texture_half_float`）。任一步不满足都会显示明确的中文提示面板，而不是留白页面。设备像素比上限 1.5，避免移动端渲染过重。
- 指针坐标按画布矩形归一化并做宽高比校正，窗口尺寸变化后拖拽方向仍然正确。
- 截图在**渲染完成的同一帧内**抓取（`preserveDrawingBuffer` 为 false，因此在帧末尾取 `toDataURL`），保证抓到的是当前画面。

## 验收自测

无头 Chromium + SwiftShader 软件 WebGL，加载 `file://`；用截图（PNG 下载）解码后统计像素分布：

| 验收项 | 期望 | 实测 |
|---|---|---|
| 拖动方向影响流动 | 方向相关 | 向上拖拽后上下像素比 2.99；向下拖拽 0.31 |
| 染料与速度随时间演化 | 持续变化 | 拖拽后静置 1.8s，彩色像素占比 24.5% → 9.3%，画面持续演变 |
| 参数变化影响计算 | 结果不同 | 压力迭代 56 与 4 的像素分布不同（标准差 9.78 / 8.99） |
| 暂停后画面停止演化 | 完全静止 | 暂停前后两次采样 mean/std 完全相同 |
| 清空移除已有流体内容 | 归黑 | 清空后全画面 mean = 0、std = 0 |
| 截图可下载 | 有效 PNG | 下载 PNG 签名有效，含彩色像素 |
| 不支持 WebGL 时不空白 | 明确提示 | 屏蔽 WebGL 得到「无法运行：浏览器不支持 WebGL」；屏蔽半浮点扩展得到「无法运行：缺少半浮点纹理支持」 |
| 移动端运行且无水平溢出 | 正常 | 390px 下拖拽产生 21.3% 彩色像素，水平溢出 0px |
| 窗口改变大小后仍正确 | 正常 | 视口 1440→1024 后拖拽仍注入 28.9% 彩色像素 |

注：绝对帧率取决于设备 GPU，本表中的数字来自软件渲染环境，不能当作真机性能结论。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 `index.html`；或使用根目录 `npm run preview` 后的静态托管地址。
- 不需要网络；但需要 WebGL 与半浮点纹理支持。
- 复盘：管线本身一次跑通。首轮自查发现两处真实缺陷并修复——清空功能对染料与压力缓冲没有重新绑定各自的读出纹理，会拿上一张纹理当乘数；以及一处颜色循环里的残留调试语句。另做了一轮呈现调整：初始染料与消散参数下画面过暗（拖拽后彩色像素占比 0%），提高注入量、降低消散并给显示着色器加中间调提亮后达到当前效果。以上均为首轮生成内部的自查，`changes` 为空。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--deepseek-v4-1-flash-high-r01`
- 模型：DeepSeek-V4.1-Flash；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：本次批量执行的完整指令 + 主题任务正文；正文与 demos/fluid-simulation/prompts/v1/prompt.md 逐字一致。任务正文来源为 docs/test-cases.md，不含更早的对话上下文。
- 工具：Claude Code。模型名称由用户指定为 DeepSeek-V4.1-Flash；会话内模型标识为 deepseek-flash[1m]。单会话直接执行，未委派子代理。Windows 11 + Node 22.16.0。验收在无头 Chromium 的 SwiftShader（软件 WebGL）下完成，真机 GPU 上的绝对帧率与画面细节会不同。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.71 CNY（11 个案例；批次 deepseek-v4-1-flash-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/deepseek-v4-1-flash-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 工作区）/demos/fluid-simulation/runs/deepseek-v4-1-flash-high-r01；保留原测试轮次 r01 与完整输入快照。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
<!-- archive:end -->
