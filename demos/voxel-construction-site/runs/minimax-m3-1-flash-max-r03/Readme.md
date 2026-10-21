# 体素微缩建筑工地 · MiniMax M3.1 Flash

## 原始提示词

见 [完整原始输入](prompt.md)。本轮输入与主题提示词 `v1` 完全一致，未做改写或裁剪。

## 实现说明

- 桌面包含蓝图、钢卷尺、安全帽与水平仪，桌前布置三枚可点击旋钮：设备速度、昼夜循环与尘土强度。
- 机械包含挖掘机往复作业、渣土车循环装卸、塔吊回转吊运、搅拌车行驶与装载机平场；工人使用 InstancedMesh 批量渲染。
- 环境包含黎明/正午/黄昏/夜晚四套天色，夜晚窗光与临时照明发光；空格触发暴雨并提升照明亮度。
- 验证：浏览器加载后场景与机械动画正常，帧率与实例计数实时更新，无脚本错误。

## 运行方式

纯静态单文件：直接用浏览器打开本目录入口即可运行，其中 CDN 资源（Tailwind / Three.js / 图标库 / Unsplash）需要联网加载。

## 复盘

- 优点：机械动画、昼夜与天气都在同一场景内联动，第二个场景补充了不同地形的组织方式。

- 不足：机械为参数化运动而非真实物理模拟；暴雨仅影响粒子与灯光，未做地面湿润反射的实时计算。


## 2026-10-21 迁移复核

本轮来自测试分支提交 `9e5302c3`，在 main 另存为 `minimax-m3-1-flash-max-r03`。原始任务输入与源分支逐字节一致；以上实现说明、验收及复盘是源记录的陈述。维护者仅追加公共统计引用、归档元数据和真实截图，小蓝书另有构建路径适配。

本次截图观察：日间可辨双塔吊、挖掘机、在建楼、棚区、板房、基坑、围挡、道路与块状工人，木纹桌面及蓝图可见，视角和第二场景入口明确。取景偏近，桌面边界与道具未完整展开，控制主要在屏幕浮层；大块平滑构件多，机械与人员造型较粗，部分区域遮挡。不凭帧率或实例数证明动画、碰撞与性能。

费用与运行口径由用户补充：供应商 Minimax，工具 Opencode，公测限免；11 个案例整批耗时 2h 14m · 46.7 tok/s，不拆算到单案例。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--minimax-m3-1-flash-max-r03`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：完整保存 voxel-construction-site/v1 任务正文快照，与 demos/voxel-construction-site/prompts/v1/prompt.md 逐字一致。
- 工具：Opencode。当前会话内以 MiniMax-M3.1-Flash、档位 max 直接生成；仅使用本地 Node 22 与浏览器校验，未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Minimax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-opencode-2026-10-21；未记录单案例费用）
- [体素工地沙盘](../../../../demos/voxel-construction-site/runs/minimax-m3-1-flash-max-r03/index.html)

### 部署适配记录

- 按任务正文末尾的『添加新场景进去』要求，补充第二个场景：跨江桥墩工地，可通过界面按钮切换。
- 贴图（木纹、泥土、蓝图）全部由 Canvas 程序化生成，未引用任何外部图片资源；Three.js 通过 CDN 加载。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支，提交 9e5302c3）中的 demos/voxel-construction-site/runs/minimax-m3-1-flash-max-r01。本轮 OpenCode 实验在 main 另存为 r03，保留既有 r01/r02；源原始输入、源码、运行说明与复盘保留。
- 维护者于 2026-10-21 为网页入口添加带 defer 的公共 assets/analytics.js 引用；原始输入未修改。
- 维护者于 2026-10-21 在本地 HTTP 中补拍真实桌面截图（1440px 宽；日记与冥想为整页长图），按案例评分规则 v2 和对应任务检查项逐图复核；统计远程请求使用拦截，不发送正式测试访问。
<!-- archive:end -->
