package routes

import (
	"net/http"

	"stock-watching/controllers"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes 注册业务路由
func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// 股票自选 CRUD（RESTful）
		api.GET("/stocks", controllers.GetStocks)             // 查询（可按 market 过滤）
		api.POST("/stocks", controllers.CreateStock)           // 新增
		api.PUT("/stocks/:id", controllers.UpdateStock)        // 修改
		api.DELETE("/stocks/:id", controllers.DeleteStock)     // 删除单条
		api.DELETE("/stocks", controllers.DeleteAllStocks)     // 批量清空（按 market 可选）
	}
}

// Ping 健康检查（备用，避免与其他版本冲突）
func Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}