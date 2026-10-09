# Pixel Flow · GPT 6 Astra xhigh

## 原始输入与执行条件

见 [完整输入快照](prompt.md)。任务正文采用 v1。用户指定模型 gpt-6-astra、档位 xhigh；在当前会话直接执行，没有委派子代理。11 个活跃案例共享会话上下文，不能视为隔离的独立同题测评。

## 运行

联网打开 index.html。默认图片程序生成；上传照片后初始为散落粒子。启用摄像头需权限及 HTTPS/localhost；也可按住画布操作。

## 实现与复盘

Three.js r160；MediaPipe Tasks Vision 0.10.21 HandLandmarker，HTTP 下模型从随应用归档的 assets/hand_landmarker.task 加载，file:// 使用 Google 官方地址备用；库和 WASM 仍通过 CDN 加载。模型来源、摘要和许可证见 assets/model-source.json。张掌局部吸引、握拳停止吸引、捏合全局还原。真实库、WASM 和模型已在虚拟摄像头下验证启动及关闭；实际真人手势质量需在有摄像头的设备上复验，建议独立打开页面。

## 验证

已完成 HTTP、390px 无水平溢出及页面脚本检查；案例功能检查与实际数值见[本轮总报告](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/Readme.md)和[验收结果](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/verification.json)。首次代码保存在[首次产物 ZIP](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/first-output/pixel-flow.zip)，首次定稿前的修正见 run.json 的 changes。

## API 参考

[Three.js 官方文档](https://threejs.org/docs/)；[MediaPipe Web 手部识别文档](https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js)。仅查询库文档，没有读取历史实验实现。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-6-astra-xhigh-r01`
- 模型：GPT-6 Astra；推理档位：xhigh
- 类型：app；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：保留用户本轮原文、仓库规则快照及所选任务原文。当前会话顺序完成全部活跃主题，共享上下文；系统/开发者消息和全部工具输出未复制，不能视为独立同输入测评。
- 工具：Codex。Windows / PowerShell；用户指定模型 gpt-6-astra、档位 xhigh；按用户要求沿用当前会话和当前基线目录。单代理直接执行；未读取其他分支、远程或工作目录的历史实现。版本选择：数字最大的可用版本。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI · ChatGPT Plus 订阅；单案例货币金额未记录。据用户说明，OpenAI 模型通过 ChatGPT Plus 订阅测试；全部案例完成后，五小时额度未耗尽。未提供单案例费用金额。
- [主页面](../../../../demos/pixel-flow/runs/gpt-6-astra-xhigh-r01/index.html)

### 部署适配记录

- 本轮从空白基线首次实现；没有人工修改。
- 首次定稿前检查：握拳/没有活动力场时停止尚未完成的目标吸引，已完成粒子保持归位。 首次文件保存在 docs/model-tests/2026-10-08-gpt-6-astra-xhigh/first-output/pixel-flow.zip；无新增用户提示或人工修改。
- 首次定稿前联网验收发现 MediaPipe 0.10.22 稳定版 CDN URL 返回 404；改为已验证可用的 0.10.21，并追加虚拟摄像头加载/释放测试。
- 最终网络复测：Google 模型 URL 在浏览器多次 ERR_CONNECTION_RESET。将官方未修改的 7,819,105 字节模型随静态应用归档，HTTP 下使用相对路径；file:// 保留官方远程模型备用。记录来源、SHA-256、官方 ETag 对应 MD5 和 Apache-2.0 许可证；产物类型更新为无需构建的静态 app。
<!-- archive:end -->
