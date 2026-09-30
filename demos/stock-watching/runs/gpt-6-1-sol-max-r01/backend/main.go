package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"hash/fnv"
	"io"
	"log/slog"
	"math"
	"net/http"
	"os"
	"os/signal"
	"regexp"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Entry struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Market    string    `json:"market" gorm:"size:8;not null;uniqueIndex:market_symbol"`
	Symbol    string    `json:"symbol" gorm:"size:16;not null;uniqueIndex:market_symbol"`
	Name      string    `json:"name" gorm:"size:64;not null"`
	Notes     string    `json:"notes" gorm:"size:200"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
type EntryInput struct {
	Market string `json:"market" binding:"required,max=8"`
	Symbol string `json:"symbol" binding:"required,max=16"`
	Name   string `json:"name" binding:"required,max=64"`
	Notes  string `json:"notes" binding:"max=200"`
}
type Quote struct {
	Price         float64   `json:"price"`
	Change        float64   `json:"change"`
	ChangePercent float64   `json:"changePercent"`
	Volume        int64     `json:"volume"`
	Currency      string    `json:"currency"`
	Series        []float64 `json:"series"`
	AsOf          time.Time `json:"asOf"`
	Source        string    `json:"source"`
}
type Item struct {
	Entry
	Quote Quote `json:"quote"`
}
type Market struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Currency string `json:"currency"`
	Hint     string `json:"hint"`
}

var markets = []Market{{"CN", "A 股 / 合约", "CNY", "6 位股票代码或合约代码，例如 600519、IF2609"}, {"HK", "港股", "HKD", "5 位代码，例如 00700"}, {"US", "美股", "USD", "英文代码，例如 AAPL、BRK.B"}}
var symbols = map[string]*regexp.Regexp{"CN": regexp.MustCompile(`^(?:[0-9]{6}|[A-Z]{1,6}[0-9]{3,4})$`), "HK": regexp.MustCompile(`^[0-9]{5}$`), "US": regexp.MustCompile(`^[A-Z][A-Z0-9.]{0,11}$`)}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
func fail(c *gin.Context, status int, code, message string) {
	c.JSON(status, gin.H{"error": gin.H{"code": code, "message": message, "requestId": c.GetString("requestId")}})
}
func databaseError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, gorm.ErrRecordNotFound):
		fail(c, 404, "not_found", "该自选合约不存在")
	case errors.Is(err, gorm.ErrDuplicatedKey):
		fail(c, 409, "duplicate", "同一市场已存在此合约")
	default:
		slog.Error("database operation failed", "requestId", c.GetString("requestId"), "error", err)
		fail(c, 503, "database_unavailable", "数据库暂时不可用，请稍后重试")
	}
}
func validate(c *gin.Context) (EntryInput, bool) {
	var body EntryInput
	if err := c.ShouldBindJSON(&body); err != nil {
		fail(c, 400, "invalid_input", "请求格式错误或字段长度不合法")
		return body, false
	}
	body.Market = strings.ToUpper(strings.TrimSpace(body.Market))
	body.Symbol = strings.ToUpper(strings.TrimSpace(body.Symbol))
	body.Name = strings.TrimSpace(body.Name)
	body.Notes = strings.TrimSpace(body.Notes)
	pattern, ok := symbols[body.Market]
	if !ok || !pattern.MatchString(body.Symbol) || body.Name == "" {
		fail(c, 400, "invalid_contract", "请检查市场、合约代码和名称")
		return body, false
	}
	return body, true
}
func id(c *gin.Context) (uint, bool) {
	n, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil || n == 0 {
		fail(c, 400, "invalid_id", "合约 ID 不合法")
		return 0, false
	}
	return uint(n), true
}
func quote(entry Entry) Quote {
	h := fnv.New32a()
	h.Write([]byte(entry.Market + ":" + entry.Symbol))
	seed := h.Sum32()
	base := float64(2000+seed%120000) / 100
	change := math.Round(math.Sin(float64(seed))*base*.026*100) / 100
	price := math.Round((base+change)*100) / 100
	series := make([]float64, 32)
	for i := range series {
		series[i] = math.Round((base+math.Sin(float64(i)*.21+float64(seed%9))*base*.008+change*float64(i)/31)*100) / 100
	}
	currency := "CNY"
	for _, m := range markets {
		if m.ID == entry.Market {
			currency = m.Currency
		}
	}
	return Quote{Price: price, Change: change, ChangePercent: math.Round(change/base*10000) / 100, Volume: int64(300000 + seed%6000000), Currency: currency, Series: series, AsOf: time.Now().UTC(), Source: "mock"}
}
func item(entry Entry) Item { return Item{Entry: entry, Quote: quote(entry)} }

type captureWriter struct {
	gin.ResponseWriter
	body bytes.Buffer
}

func (w *captureWriter) Write(data []byte) (int, error) {
	if w.body.Len() < 4096 {
		remaining := 4096 - w.body.Len()
		w.body.Write(data[:min(len(data), remaining)])
	}
	return w.ResponseWriter.Write(data)
}
func (w *captureWriter) WriteString(data string) (int, error) { return w.Write([]byte(data)) }
func logging() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := make([]byte, 8)
		if _, err := rand.Read(requestID); err != nil {
			fail(c, 500, "request_id", "无法初始化请求")
			c.Abort()
			return
		}
		rid := hex.EncodeToString(requestID)
		c.Set("requestId", rid)
		c.Header("X-Request-ID", rid)
		start := time.Now()
		var body []byte
		if c.Request.Body != nil {
			c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 1<<20)
			var err error
			body, err = io.ReadAll(c.Request.Body)
			if err != nil {
				fail(c, 413, "body_too_large", "请求内容超过 1 MB")
				c.Abort()
				return
			}
			c.Request.Body = io.NopCloser(bytes.NewReader(body))
		}
		writer := &captureWriter{ResponseWriter: c.Writer}
		c.Writer = writer
		slog.Info("request", "requestId", rid, "method", c.Request.Method, "path", c.Request.URL.Path, "query", c.Request.URL.RawQuery, "body", string(body[:min(len(body), 4096)]))
		c.Next()
		slog.Info("response", "requestId", rid, "status", c.Writer.Status(), "elapsedMs", time.Since(start).Milliseconds(), "body", writer.body.String())
	}
}
func router(db *gorm.DB) *gin.Engine {
	gin.EnableJsonDecoderDisallowUnknownFields()
	r := gin.New()
	r.Use(logging(), gin.Recovery())
	origins := strings.Split(env("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4174,http://127.0.0.1:4174"), ",")
	r.Use(cors.New(cors.Config{AllowOrigins: origins, AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, AllowHeaders: []string{"Origin", "Content-Type", "Accept"}, ExposeHeaders: []string{"X-Request-ID"}, MaxAge: 12 * time.Hour}))
	r.NoRoute(func(c *gin.Context) { fail(c, 404, "not_found", "接口不存在") })
	r.NoMethod(func(c *gin.Context) { fail(c, 405, "method_not_allowed", "请求方法不支持") })
	r.HandleMethodNotAllowed = true
	r.GET("/api/health", func(c *gin.Context) {
		sqlDB, err := db.DB()
		if err != nil {
			databaseError(c, err)
			return
		}
		ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
		defer cancel()
		if err = sqlDB.PingContext(ctx); err != nil {
			databaseError(c, err)
			return
		}
		c.JSON(200, gin.H{"status": "ok", "quotes": "mock"})
	})
	r.GET("/api/markets", func(c *gin.Context) { c.JSON(200, gin.H{"items": markets, "quoteSource": "mock"}) })
	r.GET("/api/watchlist", func(c *gin.Context) {
		query := db.WithContext(c.Request.Context())
		market := strings.ToUpper(c.Query("market"))
		if market != "" {
			if _, ok := symbols[market]; !ok {
				fail(c, 400, "invalid_market", "未知市场")
				return
			}
			query = query.Where("market = ?", market)
		}
		if q := strings.TrimSpace(c.Query("q")); q != "" {
			if len([]rune(q)) > 64 {
				fail(c, 400, "query_too_long", "搜索最多 64 个字符")
				return
			}
			q = strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`).Replace(q)
			query = query.Where(`(symbol ILIKE ? ESCAPE '\' OR name ILIKE ? ESCAPE '\')`, "%"+q+"%", "%"+q+"%")
		}
		var entries []Entry
		if err := query.Order("created_at DESC, id DESC").Limit(500).Find(&entries).Error; err != nil {
			databaseError(c, err)
			return
		}
		items := make([]Item, 0, len(entries))
		for _, entry := range entries {
			items = append(items, item(entry))
		}
		c.JSON(200, gin.H{"items": items, "total": len(items), "quoteSource": "mock"})
	})
	r.POST("/api/watchlist", func(c *gin.Context) {
		body, ok := validate(c)
		if !ok {
			return
		}
		entry := Entry{Market: body.Market, Symbol: body.Symbol, Name: body.Name, Notes: body.Notes}
		if err := db.WithContext(c.Request.Context()).Create(&entry).Error; err != nil {
			databaseError(c, err)
			return
		}
		c.JSON(201, item(entry))
	})
	r.PUT("/api/watchlist/:id", func(c *gin.Context) {
		entryID, ok := id(c)
		if !ok {
			return
		}
		body, ok := validate(c)
		if !ok {
			return
		}
		var entry Entry
		if err := db.WithContext(c.Request.Context()).First(&entry, entryID).Error; err != nil {
			databaseError(c, err)
			return
		}
		entry.Market = body.Market
		entry.Symbol = body.Symbol
		entry.Name = body.Name
		entry.Notes = body.Notes
		if err := db.WithContext(c.Request.Context()).Save(&entry).Error; err != nil {
			databaseError(c, err)
			return
		}
		c.JSON(200, item(entry))
	})
	r.DELETE("/api/watchlist/:id", func(c *gin.Context) {
		entryID, ok := id(c)
		if !ok {
			return
		}
		result := db.WithContext(c.Request.Context()).Delete(&Entry{}, entryID)
		if result.Error != nil {
			databaseError(c, result.Error)
			return
		}
		if result.RowsAffected == 0 {
			fail(c, 404, "not_found", "该自选合约不存在")
			return
		}
		c.Status(204)
	})
	return r
}
func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		slog.Error("DATABASE_URL is required; see .env.example (environment variables must be loaded by your shell)")
		os.Exit(1)
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{TranslateError: true, Logger: logger.Default.LogMode(logger.Warn)})
	if err != nil {
		slog.Error("cannot open PostgreSQL", "error", err)
		os.Exit(1)
	}
	sqlDB, err := db.DB()
	if err != nil {
		slog.Error("cannot initialize database pool", "error", err)
		os.Exit(1)
	}
	defer sqlDB.Close()
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)
	if err := db.AutoMigrate(&Entry{}); err != nil {
		slog.Error("migration failed", "error", err)
		os.Exit(1)
	}
	srv := &http.Server{Addr: "127.0.0.1:" + env("PORT", "8080"), Handler: router(db), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second}
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	go func() {
		slog.Info("server started", "address", srv.Addr, "quotes", "mock")
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()
	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		slog.Error("shutdown failed", "error", err)
	}
	fmt.Println("server stopped")
}
