package main

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type PriceHistory struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	StockID   string    `json:"stockId"`
	Price     float64   `json:"price"`
	Timestamp time.Time `json:"timestamp"`
}

// 生成历史价格数据
func generatePriceHistory(stockID string, basePrice float64) []PriceHistory {
	// 生成过去30天的历史数据
	var history []PriceHistory
	baseTime := time.Now().Add(-30 * 24 * time.Hour)
	currentPrice := basePrice

	// 每天生成4个数据点
	for i := 0; i < 30*4; i++ {
		// 生成-2%到2%之间的随机价格变动
		priceChange := currentPrice * (rand.Float64()*0.04 - 0.02)
		currentPrice += priceChange

		// 确保价格不会太低
		if currentPrice < 1 {
			currentPrice = 1
		}

		history = append(history, PriceHistory{
			StockID:   stockID,
			Price:     currentPrice,
			Timestamp: baseTime.Add(time.Duration(i) * 6 * time.Hour),
		})
	}

	return history
}

type Stock struct {
	ID            string         `json:"id" gorm:"primaryKey"`
	Code          string         `json:"code" binding:"required"`
	Name          string         `json:"name" binding:"required"`
	Price         float64        `json:"price"`
	Change        float64        `json:"change"`
	ChangePercent float64        `json:"changePercent"`
	Market        string         `json:"market"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	PriceHistory  []PriceHistory `json:"priceHistory" gorm:"foreignKey:StockID"`
}

func main() {
	// 初始化随机数种子
	rand.Seed(time.Now().UnixNano())

	// 配置数据库连接
	dsn := "host=localhost user=postgres password=123456 dbname=stockdb port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("连接数据库失败: %v", err)
	}

	// 自动迁移数据库表
	if err := db.AutoMigrate(&Stock{}, &PriceHistory{}); err != nil {
		log.Fatalf("数据库迁移失败: %v", err)
	}

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
		// 获取股票列表
		api.GET("/stocks", func(c *gin.Context) {
			market := c.Query("market")
			if market == "" {
				c.JSON(400, gin.H{"error": "市场参数不能为空"})
				return
			}
			var stocks []Stock
			result := db.Preload("PriceHistory").Where("market = ?", market).Find(&stocks)
			if result.Error != nil {
				c.JSON(500, gin.H{"error": "获取股票列表失败"})
				return
			}
			c.JSON(200, stocks)
		})

		// 添加新股票
		api.POST("/stocks", func(c *gin.Context) {
			var stock Stock
			if err := c.ShouldBindJSON(&stock); err != nil {
				c.JSON(400, gin.H{"error": "无效的请求数据"})
				return
			}
			if stock.Market == "" {
				c.JSON(400, gin.H{"error": "市场参数不能为空"})
				return
			}

			// 生成UUID作为股票ID
			stock.ID = fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
				rand.Int31n(0x10000),
				rand.Int31n(0x10000),
				0x4000|rand.Int31n(0x1000),
				0x8000|rand.Int31n(0x4000),
				rand.Int63n(0x1000000000000))

			// 生成历史价格数据
			priceHistory := generatePriceHistory(stock.ID, stock.Price)

			// 开启事务
			tx := db.Begin()
			if tx.Error != nil {
				c.JSON(500, gin.H{"error": "开启事务失败"})
				return
			}

			// 创建股票记录
			if err := tx.Create(&stock).Error; err != nil {
				tx.Rollback()
				c.JSON(500, gin.H{"error": "创建股票失败"})
				return
			}

			// 批量创建历史价格记录
			if err := tx.CreateInBatches(priceHistory, 100).Error; err != nil {
				tx.Rollback()
				c.JSON(500, gin.H{"error": "创建历史价格数据失败"})
				return
			}

			// 提交事务
			if err := tx.Commit().Error; err != nil {
				tx.Rollback()
				c.JSON(500, gin.H{"error": "提交事务失败"})
				return
			}
			c.JSON(201, stock)
		})

		// 更新股票信息
		api.PUT("/stocks/:id", func(c *gin.Context) {
			id := c.Param("id")
			var stock Stock
			if err := c.ShouldBindJSON(&stock); err != nil {
				c.JSON(400, gin.H{"error": "无效的请求数据"})
				return
			}
			if stock.Market == "" {
				c.JSON(400, gin.H{"error": "市场参数不能为空"})
				return
			}
			result := db.Model(&Stock{}).Where("id = ? AND market = ?", id, stock.Market).Updates(stock)
			if result.Error != nil {
				c.JSON(500, gin.H{"error": "更新股票失败"})
				return
			}
			if result.RowsAffected == 0 {
				c.JSON(404, gin.H{"error": "股票不存在"})
				return
			}
			c.JSON(200, gin.H{"message": "更新成功"})
		})

		// 删除股票
		api.DELETE("/stocks", func(c *gin.Context) {
			id := c.Query("id")
			market := c.Query("market")
			if market == "" {
				c.JSON(400, gin.H{"error": "市场参数不能为空"})
				return
			}

			// 开启事务
			tx := db.Begin()
			if tx.Error != nil {
				c.JSON(500, gin.H{"error": "开启事务失败"})
				return
			}

			// 先删除历史价格数据
			if err := tx.Where("stock_id = ?", id).Delete(&PriceHistory{}).Error; err != nil {
				tx.Rollback()
				c.JSON(500, gin.H{"error": "删除历史价格数据失败"})
				return
			}

			// 再删除股票记录
			result := tx.Where("id = ? AND market = ?", id, market).Delete(&Stock{})
			if result.Error != nil {
				tx.Rollback()
				c.JSON(500, gin.H{"error": "删除股票失败"})
				return
			}
			if result.RowsAffected == 0 {
				tx.Rollback()
				c.JSON(404, gin.H{"error": "股票不存在"})
				return
			}

			// 提交事务
			if err := tx.Commit().Error; err != nil {
				tx.Rollback()
				c.JSON(500, gin.H{"error": "提交事务失败"})
				return
			}

			c.JSON(200, gin.H{"message": "删除成功"})
		})
	}

	// 启动服务器
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("启动服务器失败: %v", err)
	}
}
