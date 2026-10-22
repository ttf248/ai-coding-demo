# 验收与复盘

日期：2026-10-22。使用当前会话执行；模型名称 gpt-6-astra、档位 max 由用户指定，无子代理、无人工源码修改。

## 产物演进

[first-output.zip](first-output.zip) 保留首次完整源码，未覆盖。校验值和变更文件见 [first-output-manifest.json](first-output-manifest.json)。当前目录为完成验证与修复后的产物。

- 调整导线路径，端子先向元件外侧出线再折返，减少导线穿过元件图形。直流求解逻辑未修改。

## 实测结果

12V 与 100Ω/200Ω 串联为 0.04A；并联支路为 0.12A/0.06A、总电流 0.18A；开关断开零电流；移动保留连接、删除清线；短路/理想源冲突/无唯一解均提示；触摸端子完成连线。

本案例 3 项检查通过，机器可读记录见 [checks.json](checks.json)。所有已登记入口均检查 HTTP 和 390px 无页面水平溢出；静态入口另检查 file://，离线声明的案例断网运行。

环境：Windows、Node 22.16.0、Playwright 1.58.2。图形采用 Chromium SwiftShader 软件 WebGL；这些结果不构成跨模型或 GPU 性能排名。

初轮测试点击元件内部符号时被 SVG 子图形截获；测试改为点击元件组，产品逻辑无需为断言修改。

## 重跑

在仓库根目录安装工具依赖后执行：

```powershell
node tests/experiments/gpt-6-astra-max.mjs circuit-lab
```

脚本自行启动并关闭临时只读静态服务器；联网案例需要 CDN 可访问。首次使用 Playwright 的机器需安装其 Chromium。构建型小蓝书直接检查已提交 previews，不要求重建。

## 视觉记录

- 主页面：[桌面截图](index-desktop.png) · [390px 截图](index-mobile.png)
