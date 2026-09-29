package database

import (
	"log"
	"os"

	"stock-watching/models"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB 全局 GORM 实例
var DB *gorm.DB

// dbPath 当前数据库文件路径（SQLite 模式下），启动时计算
var dbPath string

// InitDB 初始化数据库
// 默认使用 SQLite（文件 stocks.db），便于本地无依赖启动；
// 设置 USE_POSTGRES=1 或 DB_DRIVER=postgres 后切换到 PostgreSQL。
func InitDB() {
	driver := os.Getenv("DB_DRIVER")
	if driver == "" && os.Getenv("USE_POSTGRES") == "1" {
		driver = "postgres"
	}

	var (
		err error
		db  *gorm.DB
	)

	switch driver {
	case "postgres":
		host := envOrDefault("DB_HOST", "localhost")
		user := envOrDefault("DB_USER", "postgres")
		password := envOrDefault("DB_PASSWORD", "123456")
		dbname := envOrDefault("DB_NAME", "postgres")
		port := envOrDefault("DB_PORT", "5432")
		sslmode := envOrDefault("DB_SSLMODE", "disable")

		dsn := "host=" + host + " user=" + user + " password=" + password +
			" dbname=" + dbname + " port=" + port + " sslmode=" + sslmode
		log.Printf("[DB] 使用 PostgreSQL: host=%s dbname=%s", host, dbname)
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	default:
		dbPath = envOrDefault("DB_SQLITE_PATH", "stocks.db")
		log.Printf("[DB] 使用 SQLite: %s", dbPath)
		// 即使数据库文件存在，GORM.AutoMigrate 也能幂等迁移
		db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	}

	if err != nil {
		log.Fatalf("[DB] 连接数据库失败: %v", err)
	}

	// 自动迁移
	if err := db.AutoMigrate(&models.Stock{}); err != nil {
		log.Fatalf("[DB] 数据库迁移失败: %v", err)
	}

	DB = db
}

// GetDBPath 返回 SQLite 数据库文件路径，便于测试清理
func GetDBPath() string {
	if dbPath == "" {
		dbPath = envOrDefault("DB_SQLITE_PATH", "stocks.db")
	}
	return dbPath
}

// Reset 清空数据库（用于测试或全新安装；保留 schema，仅清表数据）
func Reset() error {
	if DB == nil {
		return nil
	}
	return DB.Where("1=1").Delete(&models.Stock{}).Error
}

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}