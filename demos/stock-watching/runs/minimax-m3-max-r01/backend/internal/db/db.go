package db

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"stock-watching-backend/internal/config"
	"stock-watching-backend/internal/model"
)

func Open(cfg config.Config) (*gorm.DB, error) {
	switch cfg.DBDriver {
	case "postgres":
		return gorm.Open(postgres.Open(cfg.DBDSN), &gorm.Config{})
	case "sqlite", "":
		return gorm.Open(sqlite.Open(cfg.DBDSN), &gorm.Config{})
	default:
		return nil, fmt.Errorf("unknown DB driver %q", cfg.DBDriver)
	}
}

func Migrate(conn *gorm.DB) error {
	return conn.AutoMigrate(
		&model.User{},
		&model.Market{},
		&model.Stock{},
		&model.Watchlist{},
		&model.PriceSnapshot{},
	)
}