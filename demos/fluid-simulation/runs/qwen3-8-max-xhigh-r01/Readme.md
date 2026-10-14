# WebGL 彩色流体实验台（Qwen3.8 Max · xhigh）

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文版本 [v1](../../prompts/v1/prompt.md)。

## 批次记录

Aliyun 批次合计 91.81 CNY，覆盖 11 个案例，耗时 2h 50m 7s；费用及耗时均为批次总计，不拆分为单案例。

## 运行方式

- 入口为本目录 `index.html`，`file://` 直接打开或 HTTP 静态托管均可，无外部依赖；需要浏览器支持 WebGL（WebGL2 半浮点优先，WebGL1 + 半浮点扩展回退）。
- 鼠标 / 手指拖动注入染料与动量，多点触摸同时生效；控件覆盖染料颜色、注入力度、染料消散、压力迭代次数、模拟分辨率、卷曲强度，以及暂停 / 清空 / 重置参数 / PNG 截图。

## 验证记录

2026-10-14 Playwright（Chromium headless + SwiftShader）冒烟测试，file:// 与 HTTP 双入口：

- 开场染料可见、流场随时间演化；向右拖与向左拖的染料质心分别偏右 / 偏左，方向影响流动。
- 染料消散 1.0 与 0 的亮度衰减差异显著；压力迭代次数调整后模拟继续；模拟分辨率切换重建帧缓冲正常。
- 暂停后两帧快照完全一致（停止演化）；清空后画面亮度归零；PNG 截图可下载且非空。
- 视口尺寸变化后在左上区域拖动，染料质心落在左上，坐标换算正确。
- 以 `--disable-webgl --disable-webgl2` 启动时显示明确文字提示，不是空白页。
- 390px 无水平溢出；CDP 触摸拖动可注入染料；桌面与移动端均无 JS 报错。

## 复盘

- 求解管线为 GPU 稳定流体：平流（半拉格朗日）→ 涡度约束 → 散度 → 压力雅可比迭代 → 梯度投影 → 染料平流，全部在浮点纹理帧缓冲中完成，不是粒子轨迹或渐隐画布。
- 首版把 `gl.TEXTURE0` 枚举值当采样器单元索引传给 `uniform1i`（应为单元序号 0/1/2），导致所有采样无效、画面全黑；改为 `activeTexture(TEXTURE0 + i)` + 单元序号后正常。该 bug 由「读回 FBO 内容全零」的探针定位。
- headless SwiftShader 在部分视口尺寸下启动瞬间会丢失 WebGL 上下文：实现 `webglcontextlost/restored` 完整恢复链（重新获取扩展、重建着色器与帧缓冲、重注入开场染料），并保证恢复期不抛出、不白屏；上下文丢失后旧 GL 对象直接丢弃引用而非 delete。
- 设备像素比上限 2，染料分辨率按模拟分辨率 4 倍封顶；窗口尺寸变化时重建 FBO 并用 copy 着色器复制旧场数据，触摸坐标按新 drawingBuffer 换算。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--qwen3-8-max-xhigh-r01`
- 模型：Qwen 3.8 Max；推理档位：xhigh
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：prompt.md 保留用户会话指令与任务正文原文；Claude Code 系统提示与仓库 AGENTS.md 项目说明同时生效，系统提示未留存于快照。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型与档位由用户指定为 qwen3.8-max / xhigh，与会话自报一致。Windows 11 + Node 22；Playwright（Chromium headless + SwiftShader）冒烟验证 file://、HTTP、无 WebGL 降级与 390px 触摸。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 91.81 CNY（11 个案例；批次 qwen3-8-max-xhigh-2026-10-14；未记录单案例费用）
- [彩色流体实验台](../../../../demos/fluid-simulation/runs/qwen3-8-max-xhigh-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
