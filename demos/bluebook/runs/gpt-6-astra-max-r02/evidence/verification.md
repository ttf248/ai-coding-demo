# 验收与复盘

日期：2026-10-22。使用当前会话执行；模型名称 gpt-6-astra、档位 max 由用户指定，无子代理、无人工源码修改。

## 产物演进

[first-output.zip](first-output.zip) 保留首次完整源码，未覆盖。校验值和变更文件见 [first-output-manifest.json](first-output-manifest.json)。当前目录为完成验证与修复后的产物。

- 首次构建的 react-lazyload 缺少运行时 prop-types，补充固定版本依赖和独立 lockfile，并通过 build:demo 重建预览。
- 远程头像在本环境出现响应限制和长时间等待，替换为本地 SVG 字头像；图片增加加载提示，并保留失败时的本地 SVG 占位。

## 实测结果

首次 20 条、滚动分页、分类搜索、点赞、详情、本机发布；真实触摸事件下拉刷新；390/800/1440px 分别为 2/3/4 列；主动阻断图片请求后显示有效 SVG 占位。

本案例 3 项检查通过，机器可读记录见 [checks.json](checks.json)。所有已登记入口均检查 HTTP 和 390px 无页面水平溢出；静态入口另检查 file://，离线声明的案例断网运行。

环境：Windows、Node 22.16.0、Playwright 1.58.2。图形采用 Chromium SwiftShader 软件 WebGL；这些结果不构成跨模型或 GPU 性能排名。

## 重跑

在仓库根目录安装工具依赖后执行：

```powershell
node tests/experiments/gpt-6-astra-max.mjs bluebook
```

脚本自行启动并关闭临时只读静态服务器；联网案例需要 CDN 可访问。首次使用 Playwright 的机器需安装其 Chromium。构建型小蓝书直接检查已提交 previews，不要求重建。

## 视觉记录

- 主页面：[桌面截图](index-desktop.png) · [390px 截图](index-mobile.png)
