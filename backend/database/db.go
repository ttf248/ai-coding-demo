package database

import (
	"log"

	"trae/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDB 初始化数据库连接
func InitDB() {
	// 配置数据库连接
	dsn := "host=localhost user=postgres password=123456 dbname=stockdb port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("连接数据库失败: %v", err)
	}

	// 自动迁移数据库表
	if err := db.AutoMigrate(&models.Stock{}, &models.PriceHistory{}); err != nil {
		log.Fatalf("数据库迁移失败: %v", err)
	}

	DB = db
}