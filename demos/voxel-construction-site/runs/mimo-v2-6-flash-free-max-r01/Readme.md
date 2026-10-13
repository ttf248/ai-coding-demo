# 体素微缩建筑工地

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行方式

- 单文件入口 `index.html`，Chrome 直接打开或经本地静态服务器访问。
- 网络：`required`（Three.js r160 走 unpkg CDN；所有几何、材质、贴图、图标均由代码生成）。

## 实现要点

- 第三工作桌视角的体素沙盘：蓝图、卷尺、安全帽、水平仪等桌面道具；场内含基坑、钢筋加工棚、物料区、在建楼座、办公板房、渣土堆、环形施工路。
- 动态机械：2 台挖掘机往复挖掘、2 台渣土车双车道环行（翻斗卸土）、2 台塔吊回转吊运、搅拌车环行、装载机往返平整；19 名体素工人行走/绑扎/指挥/巡逻/搬运，围挡、警示旗（顶点着色器风摆）、照明塔、脚手架、水泥袋与钢筋（实例化）。
- 自定义着色器：尘土粒子（点精灵）与暴雨粒子；昼夜循环（黎明/正午/黄昏/夜晚）驱动天空、雾、太阳、窗光、探照灯与警示灯闪烁。
- 交互：拖拽环视、空闲自动环视、滚轮缩放；点击桌前三个实体旋钮切换设备速度/昼夜循环/尘土强度；空格触发暴雨（雨量渐变、地面变湿反光、灯光增强）。

## 验收记录

- 工具：Playwright（Chromium，`--use-angle=swiftshader`，`check-voxel` 临时脚本未入库）。
- 通过项：启动约 21 FPS、598 mesh + 5 实例化 + 9 光晕 sprite + 2 粒子系统、机械随时间运动、车辆始终在道路带内且两车间距 ≈48、物体在沙盘范围内、拖拽环视与滚轮缩放、旋钮速度 1→2→0.5 与标签、昼夜循环开关、夜晚相位天空 `0d1424`、尘土档位切换、空格暴雨开（雨量 >0.5、文案"暴雨"）与关、390px 无横向溢出、无控制台错误。

## 人工适配与变更

见 run.json `changes`：Three.js r160 必须 CDN 加载，按 `required` 登记（与提示词"不引用外部资源"的自相冲突已在本说明留痕）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--mimo-v2-6-flash-free-max-r01`
- 模型：MiMo-V2.6-Flash Free；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：完整记录：与主题提示词原文一致，hash 为 BOM/换行规范化后的 SHA-256。 提示词版本 v1。
- 工具：OpenCode + Playwright 静态验收。实际执行模型 MiMo-V2.6-Flash Free，档位 max，在当前会话内直接执行（未委派子代理）。产物在本地用 Playwright 验收脚本回归，脚本存于系统临时目录、未入库。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenCode · 免费模型 订阅；单案例货币金额未记录。用户说明本次使用 OpenCode 免费模型，无付费费用；未提供可折算的货币金额，amount 保持 null。
- [预览首页](../../../../demos/voxel-construction-site/runs/mimo-v2-6-flash-free-max-r01/index.html)

### 部署适配记录

- Three.js r160 需 CDN 加载，preview.network 按 required 登记（提示词“不引用外部资源”与其自身 CDN 要求冲突）。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/mimo-v26-flash-free）/demos/voxel-construction-site/runs/mimo-v2-6-flash-free-max-r01；保留源测试轮号 r01，原始输入指纹与 main 的 vv1 提示词一致。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
<!-- archive:end -->
