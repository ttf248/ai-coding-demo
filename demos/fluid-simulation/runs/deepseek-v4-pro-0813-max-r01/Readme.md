# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与验证

- 入口：`index.html`，纯静态单文件（HTML/CSS/JS/GLSL 内联），无后端、无 CDN，`file://` 直接打开与 HTTP 托管均可。
- 操作：在画布上拖动注入颜色与动量（方向影响流向）；颜色、注入力度、染料消散、压力迭代、涡旋强度、模拟分辨率（64-192）均可调；暂停/继续、清空、重置参数、PNG 截图。
- 实现：WebGL2 + 浮点渲染纹理（默认半精度 RGBA16F，float32 回退），Stam 稳定流体四步：平流（半拉格朗日）→ 散度 → 压力 Jacobi 迭代 → 速度投影，外加涡旋约束；染料随速度场平流并消散。
- 兼容处理：无 WebGL2/浮点纹理时页面显示明确提示（不出现空白页）；上下文丢失自动等待恢复并重建 GPU 资源；显示画布上限 640×400、设备像素比按 1、模拟网格上限 192（任务要求的资源限制）。

### 验收记录（Playwright Chromium + SwiftShader，file:// 加载，2026-10-14）

- WebGL2 与浮点纹理初始化成功；注入后中心染料 > 0 ✓
- 拖动方向影响流动：向右注入 vel.x > 0，向左注入 vel.x < 0 ✓
- 染料与速度随时间演化：注入后 10 步平流把染料带向注入方向一侧 ✓
- 暂停后染料场完全静止（两次采样完全一致）✓
- 压力迭代次数影响计算（10/40/80 次结果互不相同）✓
- 清空移除已有流体 ✓；截图触发 PNG 下载 ✓
- 分辨率切换 128→160 后重建 GPU 资源并正常运行 ✓
- --disable-webgl 下显示明确提示而非空白页 ✓
- 移动端触摸注入可用、390px 无水平溢出、无 JS 错误 ✓

## 复盘

- 求解器按任务正文要求实现完整压力投影，未用粒子轨迹或渐隐画布替代；涡旋约束为额外增强。
- 验收过程中发现并修复的核心问题（见 run.json changes）：平流 dt 双重缩放、涡旋反馈环、以及两个 SwiftShader 软件渲染缺陷的绕行（CSS 缩放画布与 RGBA32F LINEAR 采样导致上下文丢失/输出归零）。修复后全部验收通过。
- 已知简化：边界条件使用 CLAMP_TO_EDGE（近似自由滑移）；压力用固定 Jacobi 迭代次数（无收敛判据，属该类实现的常规做法）；半精度纹理的舍入在极端参数下可能引入细微噪声，不影响视觉与交互。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--deepseek-v4-pro-0813-max-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：完整输入快照：用户总体指令（批量执行全部案例、模型名 DeepSeek-V4-Pro-0813、档位 max、使用当前会话）+ 任务正文 v1 逐字原文。会话未另开、未委派子代理。
- 工具：claude-code。Claude Code CLI 会话（Windows 11），用户指定模型名称为 DeepSeek-V4-Pro-0813；会话环境自报模型字符串 deepseek-v4-pro[1m]。推理档位 max（/effort 已设 max）。验收用 Playwright Chromium + SwiftShader 软件渲染（--enable-unsafe-swiftshader）加载 file:// 页面执行；注意：SwiftShader 冷启动时进程中第一个 WebGL 上下文会被 GPU 停顿看门狗丢弃，验收脚本用牺牲上下文预热后加载 demo（测试环境特性，非 demo 缺陷）；另用 --disable-webgl 验证无 WebGL 提示。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 13.77 CNY（11 个案例；批次 deepseek-v4-pro-0813-max-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/fluid-simulation/runs/deepseek-v4-pro-0813-max-r01/index.html)

### 部署适配记录

- 首次生成后修复：平流通道的 uDt 错误地乘了网格尺寸（速度按 uv/秒 存储，注入时已换算），导致速度场一步飞出边界归零；改为直接使用 dt。
- 首次生成后修复：涡旋力原先直接读-写同一纹理（反馈环）；改为先写入临时缓冲，再用加法通道累加回速度场。
- 首次生成后调整（软件渲染环境兼容）：显示画布不使用 CSS 尺寸（SwiftShader 等环境对 CSS 缩放画布会丢失上下文），缓冲与显示尺寸合一、上限 640×400，设备像素比按 1 处理。
- 首次生成后修复：默认改用半精度浮点纹理（RGBA16F）+ LINEAR 滤波——SwiftShader 对 RGBA32F 的 LINEAR 采样返回 0；float32 仅作回退（EXT_color_buffer_float）且使用 NEAREST 滤波。
- 首次生成后调整：增加 webglcontextlost/webglcontextrestored 处理，上下文丢失时提示并在恢复后自动重建全部 GPU 资源（着色器、纹理、帧缓冲），正确释放与重建资源。
- 首次生成后调整：注入笔刷半径由 0.004×力度 调整为 0.05×力度（约 3-9 纹素），提升笔触可见度与演化效果。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/fluid-simulation/runs/deepseek-v4-pro-0813-max-r01（分支 experiment/deepseek-v4-pro-0813，提交 90de279）；保留源实验的已测试代码、完整输入快照与复盘记录。
- 迁移验收：通过本地 HTTP 页面补拍 1440×960 Edge 桌面截图；入口返回 HTTP 200、无页面脚本异常，390px 视口未发现页面横向溢出。
- 迁移截图通过在画布上拖动注入颜色与动量后拍摄，记录真实运行中的流体状态。
<!-- archive:end -->
