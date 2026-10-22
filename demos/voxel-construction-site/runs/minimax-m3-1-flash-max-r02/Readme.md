# 体素微缩建筑工地沙盘

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- 整座工地摆在深色实木工作桌上，桌面上散落蓝图、卷尺、安全帽摆件与水平仪；沙盘分基坑、钢筋加工棚、料场、在建楼座基、板房办公区、渣土堆与临时道路。
- 动态设备包含挖掘机（铲斗往复取土）、渣土车（往返装卸）、两台塔吊（回转 + 吊钩升降）、混凝土罐车（滚筒旋转）、装载机与 12 名分工不同的工人。
- 性能：所有静态体素按材质合并为 InstancedMesh；尘土与雨滴使用自定义着色器；昼夜四阶段切换天空、雾、灯光与窗户自发光。
- 按题目要求“添加新场景进去”，新增了跨江桥工地场景（桥墩、桥面、栈桥与材料堆），可一键切换。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；Three.js r160 以 ESM + importmap 方式从 CDN 加载，需要联网并通过 HTTP 访问。
- 验证记录：
  - 场景加载后塔楼、车辆、工人、围挡、灯塔等体素全部渲染，实例化体素数量可观。
  - 机械数量与昼夜切换符合预期；空格可触发暴雨并改变地面粗糙度与反光；点击旋钮可切换调节项。
  - 可切换到新增的跨江桥场景；390px 视口无横向溢出。
- 已知限制：
  - 依赖 CDN 的 ESM 模块，file:// 直接打开会被 CORS 拦截（页面内置提示），需用静态服务器访问；暴雨为视觉近似，未做真实地面反射。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：完整任务正文，与 demos/voxel-construction-site/prompts/v1/prompt.md 一致。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；Three.js r160 以 ESM + importmap 方式从 CDN 加载，需要联网并通过 HTTP 访问。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [体素工地沙盘](../../../../demos/voxel-construction-site/runs/minimax-m3-1-flash-max-r02/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/voxel-construction-site/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
