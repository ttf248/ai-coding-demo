# Trae 股票自选系统

## 项目概述

本项目是一个基于 React + Golang 的股票自选系统，支持股票的增删改查操作，并提供基础行情数据展示功能。系统采用前后端分离架构，具有良好的可扩展性和维护性。

### Prompt

项目是从零开始创建，下面是项目的 Prompt：

```shell
基于项目原型图，开发功能：自选股，需要支持合约的新增、删除、修改、查询。自选股界面需要展示基础的行情数据。支持多个不同的市场切换。

前端：react
后端：golang gin gorm
数据库：PostgreSQL

服务端需要支持跨域请求，同时需要考虑数据的校验和错误处理，如果后端服务不可用，前端需要告警提示。

后端需要展示请求和应答的日志；前端也打印通讯的日志，方便排查问题。
```

### UI和交互优化

前端界面的设计完全依赖的 Grok，我们首先在 Trae 里面做出来产物的雏形，但是没有审美，由于使用的模型，代码能力很强，但是其他能力比较弱，所以我们需要使用 Grok 来优化前端的 UI。

通过将当前的界面截图，上传到 Grok 里面，然后让它帮我们优化 UI，可能一次性拿到很多的优化建议，我们人工评估，然后拷贝到 Trae 中执行，观察优化的效果。

![最初版本](imgs\Snipaste_2025-02-25_17-50-08.png)

![优化版本-浅色主题](imgs\Snipaste_2025-02-27_22-56-22.png)

![优化版本-深色主题](imgs\Snipaste_2025-02-27_22-56-42.png)

实际部署，你会发现，交互上也多了很多细节，动画效果更加完善。

### 技术栈

- 前端：React + TypeScript
- 后端：Golang + Gin + GORM
- 数据库：PostgreSQL 17

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

## 部署指南

### 环境要求

- Docker
- Docker Compose (可选)

### 数据库部署

```shell
docker network create trae-network
docker run -d --name postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 --network trae-network i-do-docker.pkg.coding.net/github/trae-demo/postgres:17
```

### 后端部署

1. 进入后端目录：

```shell
cd backend
```

2. 构建 Docker 镜像：

```shell
docker build -t trae-backend .
```

3. 运行容器：

```shell
docker run -d --name trae-backend --network trae-network -p 8080:8080 -e DB_HOST=postgres -e DB_USER=postgres -e DB_PASSWORD=123456 -e DB_NAME=postgres trae-backend
```

```shell
docker run -d --name trae-backend --network trae-network -p 8080:8080 -e DB_HOST=postgres -e DB_USER=postgres -e DB_PASSWORD=123456 -e DB_NAME=postgres i-do-docker.pkg.coding.net/github/trae-demo/backend
```

### 前端部署

1. 进入前端目录：

```shell
cd frontend
```

2. 构建 Docker 镜像：

```shell
docker build -t trae-frontend .
```

3. 运行容器：

```shell
docker run -d --name trae-frontend --network trae-network -p 5173:80 trae-frontend
```

```shell
docker run -d --name trae-frontend --network trae-network -p 8888:80 i-do-docker.pkg.coding.net/github/trae-demo/frontend
```

## 开发指南

### 后端开发

1. 安装依赖：

```shell
go mod download
```

2. 运行开发服务器：

```shell
go run main.go
```

### 前端开发

1. 安装依赖：

```shell
npm install
```

2. 运行开发服务器：

```shell
npm run dev
```

## 已知问题

* 由于使用国外的 AI 模型，Vue3 + Element-Plus 的训练数据不足，因此选择了 React 作为前端框架
* 可能存在偶发的语法错误，需要人工修复
* 部分复杂问题的解决方案需要人工指引
* 代码结构优化需要人工指导

## 日志与调试

- 后端通过 Gin 的日志中间件记录所有请求和响应
- 前端在开发环境下会打印 API 通信日志
- 数据库操作通过 GORM 的日志功能记录

## 生产部署的注意事项

> 如何调整前端代码，我不想浏览器直接访问服务器地址，生产环境，全部都走 Nginx 的代理

我将帮助你配置前端代理。我看到项目中已经有了 Nginx 配置文件，我们需要修改前端的环境配置文件和 Nginx 配置，将所有的 API 请求通过 Nginx 转发到后端服务。这样可以统一请求入口，提高安全性，并且便于后期维护和扩展。

让我们先查看前端的环境配置文件，了解当前的 API 请求配置。

frontend\.env

frontend\.env.production

修改生产环境配置文件，将 API 请求地址改为相对路径，这样所有请求都会通过 Nginx 代理转发。

frontend\.env.production

已完成前端代理配置的调整：

- 修改了生产环境配置文件`.env.production` ，将 API 基础 URL 从`http://test-backend:8080` 改为`/api`
- 现有的 Nginx 配置已经正确设置了代理规则，将`/api` 路径的请求转发到后端服务
- 这样的配置确保了：
  - 所有 API 请求都通过 Nginx 代理转发
  - 提高了系统安全性，隐藏了后端服务器的真实地址
  - 统一了请求入口，便于后期维护和扩展
  - 支持了跨域请求处理