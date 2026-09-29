// Package database 负责建立数据库连接、建表与初始化种子数据。
package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"stockwatch/backend/internal/models"
)

// Open 建立 GORM 连接，设置连接池，并按需执行建表与种子数据。
func Open(dsn string, seedEnabled bool) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})
	if err != nil {
		return nil, fmt.Errorf("打开数据库连接失败: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("取数据库句柄失败: %w", err)
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(time.Hour)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := sqlDB.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("数据库 ping 失败: %w", err)
	}

	if err := db.AutoMigrate(&models.Market{}, &models.Symbol{}, &models.WatchItem{}); err != nil {
		return nil, fmt.Errorf("自动迁移失败: %w", err)
	}
	if seedEnabled {
		if err := seed(db); err != nil {
			return nil, err
		}
	}
	return db, nil
}

// seed 写入三个市场与一批示例代码；已存在则跳过。
func seed(db *gorm.DB) error {
	type marketSeed struct {
		code, name, tz, currency string
		order                    int
	}
	markets := []marketSeed{
		{"CN", "A 股", "Asia/Shanghai", "CNY", 1},
		{"HK", "港股", "Asia/Hong_Kong", "HKD", 2},
		{"US", "美股", "America/New_York", "USD", 3},
	}
	for _, m := range markets {
		var count int64
		if err := db.Model(&models.Market{}).Where("code = ?", m.code).Count(&count).Error; err != nil {
			return err
		}
		if count > 0 {
			continue
		}
		if err := db.Create(&models.Market{
			Code: m.code, Name: m.name, Timezone: m.tz, Currency: m.currency, SortOrder: m.order,
		}).Error; err != nil {
			return err
		}
	}

	symbols := map[string][][2]string{
		"CN": {{"600519", "贵州茅台"}, {"000858", "五粮液"}, {"601318", "中国平安"}, {"300750", "宁德时代"}, {"000001", "平安银行"}},
		"HK": {{"00700", "腾讯控股"}, {"09988", "阿里巴巴-SW"}, {"03690", "美团-W"}, {"00941", "中国移动"}, {"01810", "小米集团-W"}},
		"US": {{"AAPL", "Apple Inc."}, {"MSFT", "Microsoft Corp."}, {"NVDA", "NVIDIA Corp."}, {"TSLA", "Tesla Inc."}, {"AMZN", "Amazon.com Inc."}},
	}
	sectors := []string{"消费", "金融", "科技", "医疗", "能源"}
	for marketCode, list := range symbols {
		var market models.Market
		if err := db.Where("code = ?", marketCode).First(&market).Error; err != nil {
			return err
		}
		for i, s := range list {
			var count int64
			if err := db.Model(&models.Symbol{}).
				Where("market_id = ? AND code = ?", market.ID, s[0]).Count(&count).Error; err != nil {
				return err
			}
			if count > 0 {
				continue
			}
			if err := db.Create(&models.Symbol{
				MarketID: market.ID, Code: s[0], Name: s[1], Sector: sectors[i%len(sectors)],
			}).Error; err != nil {
				return err
			}
		}
	}
	log.Println("[seed] 市场与示例代码已就绪")
	return nil
}
