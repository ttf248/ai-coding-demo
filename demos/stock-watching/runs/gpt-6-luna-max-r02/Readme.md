# 自选股全栈样例

包含 React 前端和 Go/Gin/GORM API，使用 PostgreSQL 保存自选标的。支持市场切换、代码/名称查询、新增、编辑、删除、字段校验、冲突处理、跨域请求及前端/服务端请求日志。

## 本地运行

准备 Go 1.22+、Node.js 与 PostgreSQL，并创建数据库 `stock_watch`。

在 `backend` 目录设置数据库连接并启动 API：

```powershell
Set-Location backend
$env:DATABASE_URL = "host=localhost user=postgres password=postgres dbname=stock_watch port=5432 sslmode=disable TimeZone=Asia/Shanghai"
go run ./cmd/api
```

API 默认监听 `http://localhost:8080`。另开终端，在 `frontend` 目录安装锁定依赖并运行 Vite：

```powershell
Set-Location frontend
npm ci
npm run dev
```

前端默认连接 `http://localhost:8080/api`，可通过 `VITE_API_BASE` 覆盖。首次启动后端会填充示例标的；样例价格并非实时行情。未提供外部行情商或部署地址，因此没有登记外部预览。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--gpt-6-luna-max-r02`
- 模型：GPT-6 Luna；推理档位：max
- 类型：fullstack；预览：none；网络：unknown
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：提示词 v1 原文已完整保存；正文引用的项目原型和行情服务未随本分支提供。实现仅采用正文明确列出的功能，示例行情单独标注。
- 工具：Codex 当前会话。按用户指定记录为 gpt-6-luna / max；本轮未委派子代理。
- 运行方式：无静态预览，参见上方历史说明与源码。
- 费用记录：OpenAI · ChatGPT Plus 订阅；单案例货币金额未记录。据用户说明，OpenAI 模型通过 ChatGPT Plus 订阅测试；全部案例完成后，五小时额度未耗尽。未提供单案例费用金额。


### 部署适配记录

- 从独立模型测试分支导入本轮实现，作为新的实验记录，保留本轮原始输入和产物。
- 数据库种子行情用于交互演示；未连接真实行情供应商或外部服务。
- 归档来源：model-test-base 分支 demos/stock-watching/runs/gpt-6-luna-max-r01；此前归档已有旧 r01，因此本轮保存为 gpt-6-luna-max-r02。
<!-- archive:end -->
