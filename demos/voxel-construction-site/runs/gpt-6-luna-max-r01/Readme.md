# 体素微缩建筑工地

## 原始提示词

完整输入保存在 [prompt.md](prompt.md)，关联任务正文版本 [v1](../../prompts/v1/prompt.md)。

## 本轮产物

- 入口：[index.html](index.html) 单文件页面。
- 技术栈：HTML、CSS、JavaScript、WebGL2、GLSL ES 3.00、instanced draw calls。
- 联网要求：不依赖远程资源。

## 运行与复盘

场景由程序生成的体素批次组成，包含基坑、楼体钢架、临设、材料、塔吊、挖机、卡车、工人、围挡与施工道路；动画速度、昼夜、尘土和暴雨可调。批次通过 WebGL2 drawArraysInstanced 绘制。

目标模型/档位：gpt-6-luna / max。


## 迁移核对（2026-10-27）

来源：`F:/dev/ai-coding-demo-test` 的 `model-test-base` 工作区未提交测试结果，基准提交 `452ac588702d3bde24f048fcf47cc5ffa7abb602`。本轮没有整体合并测试分支。原始任务正文快照与模型源码保留，仅为站点访问统计追加入口引用；蓝皮书另适配构建预览的统计路径。源目录没有截图，当前截图为维护者迁移期间真实运行补采。

用户提供的 OpenAI / Pro 周额度 1%、28m 25s 和 Codex 统一登记为 11 个案例的批次信息，不分摊至单条实验。源输入仅留存任务正文，缺少完整批量测试指令及其他会话上下文，因此完整性标为 partial。

[查看完整采集证据](../../../../screenshots.html?run=voxel-construction-site--gpt-6-luna-max-r01)。已按现行 v3 完成 AI 逐图视觉复核，评分与全部证据帧绑定；非人工功能验收。首次评分、逐项观察和规则快照见 [复核记录](../../../../catalog/score-reviews/2026-10-27-gpt-6-luna-max.json)。截图采集和自动点击日志不等同于完整功能验收。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--gpt-6-luna-max-r01`
- 模型：GPT-6 Luna；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：完整复制 demos/voxel-construction-site/prompts/v1/prompt.md；正文未改写。 源分支仅保存任务正文快照，未保存发起批量测试的完整指令及其他会话上下文；不宣称完整输入与其他实验一致。
- 工具：Codex。按用户指定的模型名称 gpt-6-luna 与档位 max 执行；使用当前会话，未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 1 %（Pro 周额度）（11 个案例；批次 gpt-6-luna-max-codex-pro-2026-10-27；未记录单案例费用）
- [主页面](../../../../demos/voxel-construction-site/runs/gpt-6-luna-max-r01/index.html)

### 部署适配记录

- 原提示词同时要求 Three.js r160 CDN 与不引用任何外部资源，要求相互冲突；为满足单文件零外部依赖，使用 WebGL2 自定义立方体实例批绘制实现沙盘，未使用 Three.js InstancedMesh。
- 2026-10-27：从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区未提交结果迁入；源分支基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602。保留原始 prompt.md 和模型源码，不整体合并测试分支。
- 2026-10-27：维护者为网页入口添加带 defer 的公共统计引用；原始输入不变。
- 2026-10-27：维护者使用既有采集工具补采真实桌面、390px及任务相关状态，保留失败尝试和来源链；评分保持 pending，等待本轮 AI 视觉复核授权或人工复核。
- 2026-10-27 验收：默认截图超时，ANGLE D3D11 请求下保存实际桌面 CDP 画面但 detach 卡住后终止浏览器；手机以有界等待直接 CDP 取景补拍，不调用应用函数。动画循环存在重复 requestAnimationFrame，未据截图证明稳定帧率或长期可交互。
- 2026-10-27：复核全部 PNG 时发现既有 D3D11 重试已保存手机图 mobile-retry.png，补入 lunacomplete 清单并更正先前“手机状态未执行”的恢复说明；保留原清单和原图，不覆盖失败证据。
- 2026-10-27：用户要求继续未完成工作后，由Codex完成全部4帧AI逐图视觉复核，按v3八项任务和十二项视觉分别给分；非人工功能验收。首次评分、逐项观察及规则快照见 catalog/score-reviews/2026-10-27-gpt-6-luna-max.json。
<!-- archive:end -->
