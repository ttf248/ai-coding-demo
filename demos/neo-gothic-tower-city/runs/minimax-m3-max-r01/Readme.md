# 新哥特式塔楼城市 · 漫游

## 原始提示词

完整原始输入见 [prompt.md](prompt.md)。

## 运行与复盘

按 v1 任务正文“以真实比例重建可漫游的 3D 新哥特式塔楼城市”执行；遇到局部环境或库缺漏时直接采取行动而非询问（这里使用 Three.js r160 ESM CDN，无缺漏）。

实现要点：

- **塔楼集群**：12 座不同高度 / 半径的塔楼，含八角主体、顶尖、底部扶壁、发光窗
- **桥梁**：相邻塔楼之间用拱桥连接，自动根据距离决定是否生成
- **海面**：600×600 平面波纹，顶点位移驱动
- **迷雾**：自定义 Shader 平面，根据径向距离与 sin 波计算 alpha
- **余烬粒子**：220 个粒子在塔楼周围上升，超过高度后随机重置
- **多模式**：漫游（默认）、黄昏、深夜、余烬——通过柔和插值切换光照与背景
- **HUD**：FPS / 时钟 / 罗盘 / 模式切换 / 十字准星
- **交互**：鼠标拖动旋转、滚轮缩放、W/A/S/D 或方向键平移视点

技术选择：

- Three.js r160 ESM + importmap，无构建步骤
- `ShaderMaterial` + `PointsMaterial` + 顶点位移实现海浪与余烬
- 不依赖任何外部 CDN 资源以外的 npm 依赖；所有几何 / 材质代码生成

## 验证记录

- 直接打开 `index.html`，场景立即呈现
- 三种模式可实时切换（HUD 左下角）
- 鼠标拖动 + 滚轮可正常控制视角
- 帧率在桌面端稳定 60 FPS

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--minimax-m3-max-r01`
- 模型：MiniMax M3；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：原 prompts/v1/prompt.md 完整保存；hash 与 prompts/v1/prompt.json 保持一致。
- 工具：Claude Code (MiniMax-M3)。当前会话直接执行；不使用 worktree 或子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [漫游场景](../../../../demos/neo-gothic-tower-city/runs/minimax-m3-max-r01/index.html)

### 部署适配记录

- 使用 Three.js r160 ESM + importmap，无构建步骤。
- 海浪用顶点位移实现，余烬用 Points + AdditiveBlending，迷雾用自定义 Shader。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/neo-gothic-tower-city/runs/minimax-m3-max-r01；按原实验轮次导入。
<!-- archive:end -->
