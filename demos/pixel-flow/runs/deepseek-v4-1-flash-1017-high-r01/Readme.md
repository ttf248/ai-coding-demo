# Pixel Flow

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/pixel-flow/prompts/v1/prompt.md`（中英双语原文）。

## 运行方式

通过 HTTP 打开 [index.html](index.html)。Three.js 与 MediaPipe Hands 从 jsDelivr 加载；摄像头需要 HTTPS 或 localhost。无摄像头时可直接按住画布使用鼠标/触摸吸引场。

## 实现与验证

- 默认程序化示例图；支持本地上传图片、采样密度、粒子大小与吸引强度调节。
- 每个采样像素对应一个粒子，记录目标位置与颜色；初始随机散布并在流场中漂移。
- MediaPipe Hands 识别开掌/握拳，手掌中心作为吸引场；无摄像头时指针力场回退。
- 验证：默认 32,340 粒子；上传 480×360 测试图后 36,000 粒子；使用“开掌还原”按钮模拟开掌，8 秒内 100% 粒子进入目标 5 px 内；鼠标拖拽与“重新打散”可用；摄像头缺失时显示回退提示；390 px 无横向溢出。真实摄像头手势在无摄像头环境中未验证。
- 亮度加权、粒子排序与加法混合让文字和高光在重构中保持可读。

## 复盘与边界

默认示例是程序化图形，不是外部照片。MediaPipe 与 Three.js 需要网络；自动手势识别需要摄像头权限。当前测试环境没有摄像头，因此只验证了鼠标/触摸回退和“开掌/握拳”模拟按钮；真实手部追踪需在 HTTPS 或 localhost 且授权摄像头的环境中复测。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：用户消息与 demos/pixel-flow/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [Pixel Flow](../../../../demos/pixel-flow/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 运行时依赖 Three.js 与 MediaPipe CDN；摄像头需要 HTTPS 或 localhost。
- CDN/摄像头不可用时回退到鼠标/触摸力场，不伪造手势结果。
- 无摄像头设备时仅验证了鼠标/触摸回退与模拟开掌按钮；真实摄像头手势需要在有摄像头的 HTTPS/localhost 环境中复测。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
