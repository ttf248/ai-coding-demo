# 自选股实战

模型：gpt-6.1-sol；档位：medium；任务版本：v1。当前会话顺序实现，无子代理。

## 输入与边界

见 [原始输入](prompt.md)。保存用户指令、仓库规则和任务正文；其他会话上下文未完整留存。

任务提及的项目原型图未提供；按文字需求原创实现。不登记外部部署或伪静态预览。

## 运行

见 backend/README.md 和 frontend/README.md；需 PostgreSQL 与 Go 服务，无外部部署地址。

## 实现与复盘

React + Go Gin/GORM + PostgreSQL，完整市场切换与合约 CRUD、约束校验、CORS 和通讯日志。修复 TypeScript ES2020 数组兼容性，锁定兼容 Go 1.23 的间接依赖；请求 ID 增加原子序列以避免 Windows 时间精度造成重复；改善后端非 JSON 失败应答告警。报价始终标记 simulated。

[首版快照说明](evidence/README.md) · [验证与限制](evidence/validation.md)。首版代码保留，修复没有覆盖首版快照。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--gpt-6-1-sol-medium-r01`
- 模型：gpt-6.1-sol；推理档位：medium
- 类型：fullstack；预览：none；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：保存用户本轮原始请求、仓库规则与读取的任务原文。当前会话逐个执行，并非独立会话；系统/开发者上下文、工具输出及前序案例上下文未逐字复制，不能视为独立同输入评测。
- 工具：Codex。Windows PowerShell / Node 22.16.0；当前会话执行，无子代理。模型 gpt-6.1-sol、档位 medium 由用户明确指定。默认选择各主题最大提示词版本。未读取其他分支、工作目录或远程历史实现。 验证：Chromium headless（WebGL 使用 SwiftShader）；实际摄像头手势与实体设备帧率未验证。 真实 PostgreSQL 16.4 临时实例联调，Go 工具链 1.24.3；15 项 API 检查通过，前端 CRUD/市场切换/断网与恢复/390px 检查通过。
- 运行方式：无静态预览，参见上方历史说明与源码。


### 部署适配记录

- 任务提及的项目原型图未提供；按文字需求原创实现。不登记外部部署或伪静态预览。
- React + Go Gin/GORM + PostgreSQL，完整市场切换与合约 CRUD、约束校验、CORS 和通讯日志。修复 TypeScript ES2020 数组兼容性，锁定兼容 Go 1.23 的间接依赖；请求 ID 增加原子序列以避免 Windows 时间精度造成重复；改善后端非 JSON 失败应答告警。报价始终标记 simulated。
<!-- archive:end -->
