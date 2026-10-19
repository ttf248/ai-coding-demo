# 体素微缩建筑工地

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/voxel-construction-site/prompts/v1/prompt.md`。

## 运行方式

通过 HTTP 打开 [index.html](index.html)。Three.js r160 从 jsDelivr 加载；其余内容由代码生成。

## 实现与验证

- 深色实木桌面与蓝图、安全帽、卷尺、水平仪、马克杯等桌面道具。
- 工地包含基坑、钢筋棚、物料区、在建楼体、板房、渣土堆、道路、围挡、大门、警示牌、脚手架、临时水电杆与照明。
- 动态机械：挖掘机、渣土车（接土/卸料状态机）、双塔吊、搅拌车、装载机、巡逻保安与工人。
- 昼夜循环、夜间照明与窗户暖光；尘土粒子；空格触发暴雨、湿地材质与灯光增强。
- 桌前三枚实体旋钮可点击调节设备速度、昼夜循环与尘土强度。
- 新增“桥梁扩建”场景，可通过底部按钮聚焦。
- Chromium 验证：白天/夜晚/暴雨渲染、桥梁聚焦、三枚旋钮点击、390 px 无横向溢出，无控制台错误。

## 复盘与边界

软件渲染（SwiftShader）下约 20 FPS；真实 GPU 预期更高。为稳定帧率未启用实时阴影，使用实例化、假阴影与灯光池。机械沿预设路径运动并限制在沙盘内，不做完整物理碰撞求解。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：用户消息与 demos/voxel-construction-site/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [体素微缩建筑工地](../../../../demos/voxel-construction-site/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 运行时依赖 Three.js r160 CDN；其余几何、纹理与粒子由代码生成。
- 新增“桥梁扩建”场景，可通过底部按钮聚焦。
- 机械路径限定在沙盘与环路范围内，避免穿出桌面。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
