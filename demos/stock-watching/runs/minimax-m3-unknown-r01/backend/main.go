package main

import (
	"log"
	"os"
	"path/filepath"
	"time"

	"stock-watching/database"
	"stock-watching/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化 Gin
	r := gin.New()

	// 请求/响应日志中间件 —— 记录方法、路径、状态码、耗时、客户端 IP
	r.Use(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method
		clientIP := c.ClientIP()

		c.Next()

		latency := time.Since(start)
		statusCode := c.Writer.Status()

		log.Printf("[HTTP] %3d | %13v | %15s | %-7s %s",
			statusCode, latency, clientIP, method, path)
	})

	// CORS：允许任意来源，便于前端开发
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	// 初始化数据库
	database.InitDB()

	// 注册路由
	routes.RegisterRoutes(r)

	// 健康检查
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "time": time.Now().Format(time.RFC3339)})
	})

	// 兜底 404
	r.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"error": "接口不存在", "path": c.Request.URL.Path})
	})

	// 启动服务（监听端口可通过 PORT 环境变量覆盖）
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// 确保数据库文件所在目录存在（SQLite 模式下）
	if dbDir := filepath.Dir(database.GetDBPath()); dbDir != "" && dbDir != "." {
		_ = os.MkdirAll(dbDir, 0o755)
	}

	log.Printf("后端服务监听 :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("启动服务失败: %v", err)
	}
}