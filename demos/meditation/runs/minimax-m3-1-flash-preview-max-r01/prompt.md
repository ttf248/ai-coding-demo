# 完整原始输入

## 用户指令

所有的案例 demo 全部都做一遍，模型名称 Minimax-M3.1-Flash-Preview 档位 max, 用当前会话就好了，模型名称我已经告诉你

## 补充确认

- 覆盖范围：demos 下全部 8 个主题、9 个提示词版本（bluebook v1 与 v2 各执行一次）。
- youtube-ui：任务正文的多轮交互改为一次性连续输出全部功能页面，不逐个功能停顿确认；本会话没有 Artifacts 插件，产物以 HTML 文件交付。

## 任务正文（demos/meditation/prompts/v1/prompt.md 原文）

你是一位全栈工程师，同时精通产品规划和 UI 设计。
我现在想要开发一个 “冥想” iOS App，需要输出一套完整的 APP 原型图，请按照下面的要求执行：

* 模拟真实用户使用冥想类 APP 的真实场景和需求
* 结合用户需求，以产品经理的视角去规划 APP 的功能、页面和交互
* 结合产品规划，以设计师的视角去输出完整的 UI/UX
* 引入 tailwindcss 来完成，而不是变成 style 样式，图片使用 unsplash
* 以上全部页面都在同一个 html 文件中展示