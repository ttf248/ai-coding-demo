# 奇幻地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/fantasy-map-generator/prompts/v1/prompt.md`。

## 运行方式

直接用浏览器打开 [index.html](index.html)，或通过静态服务器访问。所有纹理与地图均在本地生成。

## 实现与验证

- 种子 + 参数确定性生成高度场；海平面、粗糙度、笔刷半径可调。
- 河流沿最陡下降方向追踪，只保留最终入海的河段，避免逆坡穿过山峰。
- 升高/降低笔刷会重算地形分类、海岸线段与河流；支持平移、滚轮/双指缩放、城镇标签开关与 PNG 导出。
- Chromium 验证：同种子两次渲染逐像素一致、不同种子不同、笔刷修改地图、PNG 下载成功；390 px 无横向溢出。

## 复盘与边界

地图是程序化艺术结果，不追求地理学精确。笔刷编辑后再次“按种子生成”会重置地形。默认地图使用程序化图形，不依赖外部图片。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：用户消息与 demos/fantasy-map-generator/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [奇幻地图生成器](../../../../demos/fantasy-map-generator/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
