# 体素微缩建筑工地沙盘

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。通过静态 HTTP 托管或浏览器直接打开。

核心实现：
1. **实木桌面与微缩沙盘载体**：构建深色实木桌面、蓝图图纸散落、钢卷尺、安全帽与金属水平仪等桌面微缩静物。
2. **作业机械与运动管线**：
   - 塔吊回转大臂并实时收放吊运缆绳料斗；
   - 体素挖掘机摆动底盘与挖斗往复挖掘；
   - 渣土卡车沿道路闭环行驶并承载土方；
   - 脚手架与大量体素工人采用 `InstancedMesh` 实例化批渲染保障 60FPS。
3. **环境系统与交互体系**：
   - 四套昼夜循环（黎明、正午、黄昏、午夜）配合工地夜间探照灯；
   - 空格键随时触发暴雨模拟，包含雨滴粒子与地面潮湿高光反射；
   - 支持双沙盘一键切换（地表基坑大楼 vs 地下盾构与隧道工程）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [体素工地沙盘](../../../../demos/voxel-construction-site/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
