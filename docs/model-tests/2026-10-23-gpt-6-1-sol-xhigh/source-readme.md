# GPT 6.1 Sol / xhigh 全案例实验

2026-10-23，按用户指定模型名称 `gpt-6-1-sol`、档位 `xhigh`，在当前 Codex 会话逐一实现 11 个参与主题；没有委派子代理。`stock-watching` 已归档，按 `npm run topics:active` 的结果跳过。小蓝书选用最大版本 v2，其余为 v1。

工作在 `experiment/gpt-6-1-sol-xhigh-20261023` 分支完成；未获取历史实验实现，未修改发布源、域名、CNB 同步或外部部署设置。用户覆盖了新会话要求；本轮共享会话上下文，不能宣称隔离公平评测。

| 主题 | 提示词 | 预览 / 网络 | 入口 | 截图 |
|---|---|---|---|---|
| [小蓝书 · 瀑布流社区](../../../demos/bluebook/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v2 | build / required | [打开](../../../previews/bluebook/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](screenshots/bluebook-desktop.png) · [手机](screenshots/bluebook-mobile.png) |
| [简化电路实验台](../../../demos/circuit-lab/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / offline | [打开](../../../demos/circuit-lab/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/circuit-lab/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/circuit-lab/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [奇幻地图生成器](../../../demos/fantasy-map-generator/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / offline | [打开](../../../demos/fantasy-map-generator/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/fantasy-map-generator/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/fantasy-map-generator/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [彩色流体实验台](../../../demos/fluid-simulation/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / offline | [打开](../../../demos/fluid-simulation/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/fluid-simulation/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/fluid-simulation/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [生活情绪日记](../../../demos/life-diary/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / required | [打开](../../../demos/life-diary/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/life-diary/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/life-diary/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [冥想 iOS App](../../../demos/meditation/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / required | [打开](../../../demos/meditation/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/meditation/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/meditation/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [新哥特式塔楼城市](../../../demos/neo-gothic-tower-city/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / offline | [打开](../../../demos/neo-gothic-tower-city/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/neo-gothic-tower-city/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/neo-gothic-tower-city/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [寻路算法实验室](../../../demos/pathfinding-lab/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / offline | [打开](../../../demos/pathfinding-lab/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/pathfinding-lab/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/pathfinding-lab/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [Pixel Flow](../../../demos/pixel-flow/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / required | [打开](../../../demos/pixel-flow/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/pixel-flow/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/pixel-flow/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [体素微缩建筑工地](../../../demos/voxel-construction-site/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / offline | [打开](../../../demos/voxel-construction-site/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/voxel-construction-site/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/voxel-construction-site/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |
| [YouTube UI 模块](../../../demos/youtube-ui/runs/gpt-6-1-sol-xhigh-r01/Readme.md) | v1 | static / required | [打开](../../../demos/youtube-ui/runs/gpt-6-1-sol-xhigh-r01/index.html) | [桌面](../../../demos/youtube-ui/runs/gpt-6-1-sol-xhigh-r01/evidence/desktop.png) · [手机](../../../demos/youtube-ui/runs/gpt-6-1-sol-xhigh-r01/evidence/mobile.png) |

## 验证

- 20/20 组 demo 检查通过，覆盖 HTTP、静态单文件 file://、390px、核心数值和交互、WebGL 不支持提示。
- 摄像头专项通过：真实模型加载、模拟视频设备、权限拒绝及轨道释放。真实人手识别仍需真人设备确认。
- 触摸专项通过：寻路绘制、电路连线/拖动/删除、地图画笔、流体注入、粒子吸引。
- 站点专项在根路径与 Pages 子路径通过：筛选、排序、加载更多、有效链接、比较关系、无预览、单侧卸载、分享恢复与手机仅加载当前侧。不同输入与无预览使用内存 fixture，不伪造档案记录。
- 仓库单元测试 11 项与浏览器回归 12 项通过。首页回归原先假设所有主题一屏展示，本轮按真实九项分页补充“加载更多”验收；未改变首页实现。
- YouTube 原始提示词包含 Markdown 行末双空格，按输入保真规则完整保留；`.gitattributes` 仅对原始输入禁用行末空格检查，不修改其输入或指纹。
- 数值、边界和首次快照指纹见 [验证明细](validation.md)。仓库维护命令日志见 [检查日志](checks.txt)。
- 从暂存区导出一份无 node_modules 的干净站点副本，11 个入口与输入链接均可访问，小蓝书无需构建即可显示 20 张卡片；见 [干净检出检查](clean-checkout.json)。

## 归档与复现

每个 run 均保存 run.json、prompt.md、Readme.md、源码、首次产物 evidence/initial.zip、修复记录和验证记录，截图由上表索引；构建型小蓝书另有独立 lockfile 与已生成 previews。首次快照在本轮浏览器验证前封存，含首次错误，后续修复没有覆盖快照。生成工具的原始脚本保存在 [generation-scripts.zip](generation-scripts.zip)，仅作证据，不应对定稿历史再次执行。

先以端口 43903 运行静态服务：

```powershell
$env:PORT='43903'
node scripts/serve.mjs --read-only
```

另一终端执行 `node tests/experiment-gpt-6-1-sol-20261023.mjs`；其他专项用相应 experiment-*-20261023.mjs。浏览器依赖使用仓库 lockfile。

## 边界

Three.js r160 内嵌于 3D HTML 并保留 MIT 许可证。原型页使用 Tailwind 类与编译 CSS 兜底，仍按 CDN/外部图片登记为 required。YouTube 的 APP 需求根据主题补全，当前没有可用 Artifacts 插件；新哥特城市缺少测绘资料，交付原创米制比例设计。WebGL 自动化使用软件渲染，无法据此保证目标设备 60FPS 或所有机械姿态绝无几何相交。
