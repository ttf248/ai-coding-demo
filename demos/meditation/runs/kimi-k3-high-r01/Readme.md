# 冥想 iOS App

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：单文件原型页，file:// 与 HTTP 均可打开；**依赖网络**（Tailwind CDN 与 Unsplash 图片），离线打开会失去样式与配图。
- 入口：[index.html](index.html)
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 产品规划（PM 视角）：真实场景为晨间唤醒、通勤减压、睡前放松与长期坚持，据此规划 8 个页面：启动页、首页（今日推荐/快捷入口/连续天数）、课程库（分类筛选/老师）、冥想播放（进度/定时/混音）、4-7-8 呼吸练习（节奏圆环）、睡眠故事（智能渐弱）、情绪日记（心情+事件标签）、统计与个人中心（周柱状图/设置）。
- 验证记录：所有页面同处一个 HTML；iPhone 375×812 机框横向排列；Tailwind 工具类完成全部样式，未写自定义 style 块；图片均为 Unsplash。
- 复盘：一次生成完成，未做追加修复。图标采用 emoji 与少量内联 SVG（任务允许 FontAwesome 等开源图标库，本次选择无额外依赖的方案）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：完整输入即主题任务正文 v1，无附加上下文。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [冥想 App 原型](../../../../demos/meditation/runs/kimi-k3-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
