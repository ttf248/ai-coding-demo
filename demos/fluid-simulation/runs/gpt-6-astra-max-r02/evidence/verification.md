# 验收与复盘

日期：2026-10-22。使用当前会话执行；模型名称 gpt-6-astra、档位 max 由用户指定，无子代理、无人工源码修改。

## 产物演进

[first-output.zip](first-output.zip) 保留首次完整源码，未覆盖。校验值和变更文件见 [first-output-manifest.json](first-output-manifest.json)。当前目录为完成验证与修复后的产物。

- 修复 ResizeObserver 首次回调重复重建帧缓冲、清掉初始染料的问题：尺寸不变时不重建；改善首屏默认染料注入。

## 实测结果

GPU 纹理初始化成功，注入后像素持续变化；暂停后画布像素与步数不变；清空移除染料；切换分辨率仍为 8 个渲染目标；PNG 下载；模拟无 WebGL 2 时显示错误并禁用控件。

本案例 4 项检查通过，机器可读记录见 [checks.json](checks.json)。所有已登记入口均检查 HTTP 和 390px 无页面水平溢出；静态入口另检查 file://，离线声明的案例断网运行。

环境：Windows、Node 22.16.0、Playwright 1.58.2。图形采用 Chromium SwiftShader 软件 WebGL；这些结果不构成跨模型或 GPU 性能排名。

初轮暂停测试使用 DOM 元素截图，包含每秒更新的 FPS 叠层；改为比较 canvas.toDataURL() 的像素缓冲。

## 重跑

在仓库根目录安装工具依赖后执行：

```powershell
node tests/experiments/gpt-6-astra-max.mjs fluid-simulation
```

脚本自行启动并关闭临时只读静态服务器；联网案例需要 CDN 可访问。首次使用 Playwright 的机器需安装其 Chromium。构建型小蓝书直接检查已提交 previews，不要求重建。

## 视觉记录

- 主页面：[桌面截图](index-desktop.png) · [390px 截图](index-mobile.png)
