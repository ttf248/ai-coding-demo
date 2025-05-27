# 开发指南

## 环境要求

- Node.js 18+
- Go 1.21+
- PostgreSQL 17
- Docker (可选)

## 系统架构

### 后端架构

后端采用 Golang 的 Gin 框架实现 RESTful API，主要模块包括：

1. **数据库模块**
   - 使用 GORM 作为 ORM 框架
   - 支持环境变量配置数据库连接
   - 自动进行数据库表迁移

2. **路由模块**
   - RESTful API 设计
   - 统一的错误处理机制
   - 内置请求日志记录

3. **跨域处理**
   - 支持本地开发环境跨域
   - 可配置的 CORS 策略
   - 支持 Cookie 跨域

### 前端架构

前端使用 React + TypeScript 构建，实现了：

- 股票列表展示
- 自选股管理
- 行情数据展示
- 错误提示机制

## 本地开发环境搭建

### 数据库配置

1. 启动 PostgreSQL 数据库：

```shell
# 使用 Docker 启动数据库
docker run -d --name postgres-dev \
  -e POSTGRES_PASSWORD=123456 \
  -p 5432:5432 \
  postgres:17
```

2. 创建开发数据库（可选，程序会自动创建）：

```sql
CREATE DATABASE trae_dev;
```

### 后端开发

1. 进入后端目录：

```shell
cd backend
```

2. 安装依赖：

```shell
go mod download
```

3. 设置环境变量：

```shell
export DB_HOST=localhost
export DB_USER=postgres
export DB_PASSWORD=123456
export DB_NAME=postgres
export DB_PORT=5432
```

4. 运行开发服务器：

```shell
go run main.go
```

后端服务将在 `http://localhost:8080` 启动。

### 前端开发

1. 进入前端目录：

```shell
cd frontend
```

2. 安装依赖：

```shell
npm install
```

3. 运行开发服务器：

```shell
npm run dev
```

前端应用将在 `http://localhost:5173` 启动。

## API 接口说明

### 股票相关接口

- `GET /api/stocks` - 获取股票列表
- `POST /api/stocks` - 添加股票
- `PUT /api/stocks/:id` - 更新股票信息
- `DELETE /api/stocks/:id` - 删除股票

### 请求示例

```shell
# 获取股票列表
curl -X GET http://localhost:8080/api/stocks

# 添加股票
curl -X POST http://localhost:8080/api/stocks \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","name":"Apple Inc.","price":150.0,"change":2.5}'
```

## 日志与调试

### 后端日志

- 通过 Gin 的日志中间件记录所有请求和响应
- GORM 日志记录数据库操作
- 日志级别可通过环境变量 `LOG_LEVEL` 配置

### 前端日志

- 开发环境下会打印 API 通信日志
- 错误信息会在控制台显示详细堆栈
- 网络请求失败会有明确的错误提示

## 代码规范

### 后端规范

- 使用 `gofmt` 格式化代码
- 遵循 Go 的命名约定
- 每个公共函数都应有注释
- 错误处理要完整

### 前端规范

- 使用 TypeScript 严格模式
- 遵循 React Hook 最佳实践
- 组件名使用 PascalCase
- 文件名使用 kebab-case

## 常见问题

### 数据库连接失败

检查数据库是否启动，环境变量是否正确配置。

### 跨域问题

开发环境下，确保后端已配置 CORS 中间件。

### 热重载不生效

检查文件监听权限，或尝试重启开发服务器。
