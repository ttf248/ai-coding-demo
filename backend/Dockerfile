# 构建阶段
FROM golang:1.23.4-alpine AS builder

LABEL stage=gobuilder

ENV CGO_ENABLED 0
ENV GOPROXY https://goproxy.cn,direct
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 设置工作目录
WORKDIR /app

# 复制 go.mod 和 go.sum
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 运行阶段
FROM alpine:latest

# 安装基本工具和 CA 证书
RUN apk --no-cache add ca-certificates tzdata

# 设置工作目录
WORKDIR /app

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .

# 设置环境变量
ENV GIN_MODE=release
ENV DB_HOST=postgres
ENV DB_USER=postgres
ENV DB_PASSWORD=123456
ENV DB_NAME=stockdb
ENV DB_PORT=5432
ENV DB_SSLMODE=disable

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["./main"]