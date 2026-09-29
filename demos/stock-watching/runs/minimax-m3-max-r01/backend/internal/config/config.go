package config

import (
	"os"
	"strconv"
	"strings"
)

type Config struct {
	HTTPAddr    string
	DBDriver    string
	DBDSN       string
	CORSOrigins []string
	Seed        bool
	LogLevel    string
}

func Load() Config {
	return Config{
		HTTPAddr:    getenv("HTTP_ADDR", ":8080"),
		DBDriver:    getenv("DB_DRIVER", "sqlite"),
		DBDSN:       getenv("DB_DSN", "stock.db"),
		CORSOrigins: splitCSV(getenv("CORS_ORIGINS", "http://localhost:5173")),
		Seed:        getbool("DB_SEED", true),
		LogLevel:    getenv("LOG_LEVEL", "info"),
	}
}

func getenv(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

func getbool(key string, fallback bool) bool {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		b, err := strconv.ParseBool(v)
		if err == nil {
			return b
		}
	}
	return fallback
}

func splitCSV(s string) []string {
	if s == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if t := strings.TrimSpace(p); t != "" {
			out = append(out, t)
		}
	}
	return out
}