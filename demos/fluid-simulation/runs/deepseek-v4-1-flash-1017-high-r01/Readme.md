# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/fluid-simulation/prompts/v1/prompt.md`。

## 运行方式

通过本地 HTTP 静态服务器打开 [index.html](index.html)。无外部资源；需要支持 WebGL 与半浮点纹理渲染的浏览器。

## 实现与验证

- GPU 求解：半拉格朗日平流、散度、Jacobi 压力迭代、压力梯度投影，附带涡量增强。
- 控制染料颜色、注入力度/半径、染料消散、压力迭代次数与模拟分辨率；支持暂停、清空、重置参数和 PNG 截图。
- 分辨率变化时重建并释放 GPU 纹理；设备像素比限制为 2。
- Chromium + WebGL2 验证：画面随时间演化、暂停后画面冻结、清空后移除内容、截图下载成功；390 px 无横向溢出。
- 不支持 WebGL2/半浮点纹理时显示明确错误，不出现空白页面。

## 复盘与边界

模拟分辨率独立于画布尺寸；修改分辨率会清空当前流体。软件渲染（SwiftShader）帧率低于真实 GPU。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：用户消息与 demos/fluid-simulation/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [彩色流体实验台](../../../../demos/fluid-simulation/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
