// Package config 负责从环境变量读取后端配置，并给出可用的默认值。
package config

import (
	"os"
	"strconv"
	"strings"
)

// Config 是后端运行期需要的全部配置。
type Config struct {
	Port         string
	GinMode      string
	DatabaseDSN  string
	CORSOrigins  []string
	LogRequests  bool
	RequestLimit int // 读取请求体大小上限（字节）
	QuoteMode    string
	SeedEnabled  bool
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getbool(key string, fallback bool) bool {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return fallback
	}
	return b
}

func getint(key string, fallback int) int {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	n, err := strconv.Atoi(v)
	if err != nil || n <= 0 {
		return fallback
	}
	return n
}

// Load 读取环境变量并返回配置。DSN 为空时服务仍可启动，但 /health 会报告数据库未连接，
// 便于在本地先把前端跑起来。
func Load() Config {
	origins := strings.Split(getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"), ",")
	clean := make([]string, 0, len(origins))
	for _, o := range origins {
		if o = strings.TrimSpace(o); o != "" {
			clean = append(clean, o)
		}
	}
	return Config{
		Port:         getenv("PORT", "8080"),
		GinMode:      getenv("GIN_MODE", "debug"),
		DatabaseDSN:  getenv("DATABASE_DSN", "host=127.0.0.1 port=5432 user=stockwatch password=stockwatch dbname=stockwatch sslmode=disable"),
		CORSOrigins:  clean,
		LogRequests:  getbool("LOG_REQUESTS", true),
		RequestLimit: getint("REQUEST_LIMIT_BYTES", 1<<20),
		QuoteMode:    getenv("QUOTE_MODE", "simulated"),
		SeedEnabled:  getbool("SEED_ENABLED", true),
	}
}
