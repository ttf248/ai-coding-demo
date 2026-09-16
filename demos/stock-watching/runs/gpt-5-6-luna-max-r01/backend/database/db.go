package database

import (
	"fmt"
	"os"

	"stock-watch-luna/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Open() (*gorm.DB, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		host := env("DB_HOST", "localhost")
		user := env("DB_USER", "postgres")
		password := env("DB_PASSWORD", "postgres")
		database := env("DB_NAME", "stock_watch")
		port := env("DB_PORT", "5432")
		sslmode := env("DB_SSLMODE", "disable")
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", host, user, password, database, port, sslmode)
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Warn)})
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}
	if err := db.AutoMigrate(&models.Stock{}, &models.PriceHistory{}); err != nil {
		return nil, fmt.Errorf("migrate schema: %w", err)
	}
	return db, nil
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
