# 验收与复盘

日期：2026-10-22。使用当前会话执行；模型名称 gpt-6-astra、档位 max 由用户指定，无子代理、无人工源码修改。

## 产物演进

[first-output.zip](first-output.zip) 保留首次完整源码，未覆盖。校验值和变更文件见 [first-output-manifest.json](first-output-manifest.json)。当前目录为完成验证与修复后的产物。

- 移动机械的方块也采用 InstancedMesh，每帧同步变换；双场景实际检查 draw calls 小于 180。
- 补充运输车装卸停留与载料变化；修正轮高、挖掘机连杆范围、搅拌罐旋转与基坑下凹几何。
- 调整工人与装载机位置，避开钢筋和料堆；移动端拆分沙盘与面板、调整视角和按钮尺寸。

## 实测结果

两个场景均渲染；场景切换、暴雨、暂停、昼夜开关生效；动态对象存在且 draw calls 小于 180；HTTP、在线 file:// 与 390px 页面检查通过。

本案例 3 项检查通过，机器可读记录见 [checks.json](checks.json)。所有已登记入口均检查 HTTP 和 390px 无页面水平溢出；静态入口另检查 file://，离线声明的案例断网运行。

环境：Windows、Node 22.16.0、Playwright 1.58.2。图形采用 Chromium SwiftShader 软件 WebGL；这些结果不构成跨模型或 GPU 性能排名。

测试环境使用软件 WebGL，截图中 FPS 不是目标硬件性能测量。未证明所有设备稳定 60FPS，也未进行连续碰撞的穷尽验证。

## 重跑

在仓库根目录安装工具依赖后执行：

```powershell
node tests/experiments/gpt-6-astra-max.mjs voxel-construction-site
```

脚本自行启动并关闭临时只读静态服务器；联网案例需要 CDN 可访问。首次使用 Playwright 的机器需安装其 Chromium。构建型小蓝书直接检查已提交 previews，不要求重建。

## 视觉记录

- 主页面：[桌面截图](index-desktop.png) · [390px 截图](index-mobile.png)
