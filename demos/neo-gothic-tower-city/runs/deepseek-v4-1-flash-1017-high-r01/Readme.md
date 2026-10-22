# 新哥特式塔楼城市

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/neo-gothic-tower-city/prompts/v1/prompt.md`。

## 运行方式

通过 HTTP 打开 [index.html](index.html)。Three.js r160 从 jsDelivr CDN 加载，其余几何、材质、纹理、火焰与水面均由代码生成。

## 实现与验证

- 程序化新哥特城市：双塔大教堂、玫瑰窗、尖顶、飞扶壁、密集塔楼、湿石街道、运河与石桥。
- 自动空中巡游与第一人称漫游：WASD/方向键移动、鼠标或拖动环视、Shift 加速、Esc 返回巡游、移动端虚拟摇杆。
- 运河水面 shader、火光/余烬粒子、雾气、月亮与星空；建筑与运河碰撞限制。
- Chromium 验证：加载、空中巡游、进入漫游、Esc 返回巡游、390 px 无横向溢出，无控制台错误。

## 复盘与边界

城市是风格化重建，不声称与真实建筑比例完全一致。运行需要网络加载 Three.js；CDN 不可用时页面显示“待确认：Three.js 未能加载”。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：用户消息与 demos/neo-gothic-tower-city/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [新哥特式塔楼城市](../../../../demos/neo-gothic-tower-city/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 运行时依赖 Three.js r160 CDN；所有场景资产、纹理与粒子由代码生成。
- CDN 加载失败时显示“待确认”提示，不伪造运行结果。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
- 截图先保留默认欢迎层画面 screenshot-2026-10-19.png，再通过“先看巡游”关闭欢迎层补拍 screenshot-2026-10-19-result.png，后者用于展示评分。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
