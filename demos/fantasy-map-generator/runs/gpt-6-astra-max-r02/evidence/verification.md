# 验收与复盘

日期：2026-10-22。使用当前会话执行；模型名称 gpt-6-astra、档位 max 由用户指定，无子代理、无人工源码修改。

## 产物演进

[first-output.zip](first-output.zip) 保留首次完整源码，未覆盖。校验值和变更文件见 [first-output-manifest.json](first-output-manifest.json)。当前目录为完成验证与修复后的产物。

首次源码快照之后没有修改功能源码。

## 实测结果

同种子高度场逐项一致，异种子不同；所有生成河流逐节点下降；缩放后画笔位置正确、地形和水系更新；PNG 下载成功；390px 触摸画笔实际改变高度场。

本案例 4 项检查通过，机器可读记录见 [checks.json](checks.json)。所有已登记入口均检查 HTTP 和 390px 无页面水平溢出；静态入口另检查 file://，离线声明的案例断网运行。

环境：Windows、Node 22.16.0、Playwright 1.58.2。图形采用 Chromium SwiftShader 软件 WebGL；这些结果不构成跨模型或 GPU 性能排名。

初轮测试在高度已达 1 的中心执行升高并期待继续增加，属于断言错误；改为降低并核对缩放坐标与水系。

## 重跑

在仓库根目录安装工具依赖后执行：

```powershell
node tests/experiments/gpt-6-astra-max.mjs fantasy-map-generator
```

脚本自行启动并关闭临时只读静态服务器；联网案例需要 CDN 可访问。首次使用 Playwright 的机器需安装其 Chromium。构建型小蓝书直接检查已提交 previews，不要求重建。

## 视觉记录

- 主页面：[桌面截图](index-desktop.png) · [390px 截图](index-mobile.png)
