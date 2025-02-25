package routes

import (
	"time"

	"trae/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRouter 配置路由
func SetupRouter() *gin.Engine {
	// 创建Gin实例
	r := gin.Default()

	// 配置CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:*", "http://127.0.0.1:*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
		AllowWildcard:    true,
		MaxAge:           12 * time.Hour,
	}))

	// 配置API路由
	api := r.Group("/api")
	{
		// 股票相关路由
		api.GET("/stocks", controllers.GetStocks)
		api.GET("/stocks/create", controllers.CreateStock)
		api.GET("/stocks/update/:id", controllers.UpdateStock)
		api.GET("/stocks/delete", controllers.DeleteStock)
	}

	return r
}