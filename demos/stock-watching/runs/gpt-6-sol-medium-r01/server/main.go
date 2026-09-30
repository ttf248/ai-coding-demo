package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Instrument struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Market    string    `json:"market" gorm:"size:12;uniqueIndex:contract"`
	Symbol    string    `json:"symbol" gorm:"size:24;uniqueIndex:contract"`
	Name      string    `json:"name" gorm:"size:80"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
type Input struct {
	Market string `json:"market"`
	Symbol string `json:"symbol"`
	Name   string `json:"name"`
}
type ListedItem struct {
	Instrument
	Price         float64 `json:"price"`
	ChangePercent float64 `json:"changePercent"`
	Volume        int64   `json:"volume"`
	QuoteSource   string  `json:"quoteSource"`
}
type loggingWriter struct {
	gin.ResponseWriter
	body bytes.Buffer
}

func (w *loggingWriter) Write(data []byte) (int, error) {
	w.body.Write(data)
	return w.ResponseWriter.Write(data)
}
func (w *loggingWriter) WriteString(s string) (int, error) {
	w.body.WriteString(s)
	return w.ResponseWriter.WriteString(s)
}

var markets = map[string]bool{"US": true, "HK": true, "CN": true, "CRYPTO": true}
var symbolRE = regexp.MustCompile(`^[A-Z0-9][A-Z0-9.\-]{0,23}$`)

func clean(in Input) (Input, error) {
	in.Market = strings.ToUpper(strings.TrimSpace(in.Market))
	in.Symbol = strings.ToUpper(strings.TrimSpace(in.Symbol))
	in.Name = strings.TrimSpace(in.Name)
	if !markets[in.Market] {
		return in, fmt.Errorf("市场必须为 US、HK、CN 或 CRYPTO")
	}
	if !symbolRE.MatchString(in.Symbol) {
		return in, fmt.Errorf("合约代码格式无效")
	}
	if len([]rune(in.Name)) < 1 || len([]rune(in.Name)) > 80 {
		return in, fmt.Errorf("名称长度应为 1 到 80 个字符")
	}
	return in, nil
}
func quote(item Instrument) ListedItem {
	var seed int64
	for _, c := range item.Market + item.Symbol {
		seed = seed*31 + int64(c)
	}
	if seed < 0 {
		seed = -seed
	}
	return ListedItem{Instrument: item, Price: float64(1200+seed%40000) / 100, ChangePercent: float64(seed%901-450) / 100, Volume: 10000 + seed%900000, QuoteSource: "模拟行情"}
}
func respond(c *gin.Context, code int, data any) { c.JSON(code, data) }
func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is required")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	if err = db.AutoMigrate(&Instrument{}); err != nil {
		log.Fatal(err)
	}
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(func(c *gin.Context) {
		origin := os.Getenv("FRONTEND_ORIGIN")
		if origin == "" {
			origin = "http://localhost:5173"
		}
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Vary", "Origin")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(204)
			return
		}
		body, _ := io.ReadAll(io.LimitReader(c.Request.Body, 1<<20))
		c.Request.Body = io.NopCloser(bytes.NewReader(body))
		writer := &loggingWriter{ResponseWriter: c.Writer}
		c.Writer = writer
		start := time.Now()
		c.Next()
		log.Printf("%s %s request=%s response=%d body=%s duration=%s", c.Request.Method, c.Request.URL.Path, string(body), writer.Status(), writer.body.String(), time.Since(start))
	})
	r.GET("/api/health", func(c *gin.Context) { respond(c, 200, gin.H{"ok": true}) })
	r.GET("/api/markets", func(c *gin.Context) { respond(c, 200, []string{"US", "HK", "CN", "CRYPTO"}) })
	r.GET("/api/watchlist", func(c *gin.Context) {
		market := strings.ToUpper(c.Query("market"))
		if market != "" && !markets[market] {
			respond(c, 400, gin.H{"error": "无效市场"})
			return
		}
		var items []Instrument
		q := db.Order("created_at desc")
		if market != "" {
			q = q.Where("market = ?", market)
		}
		if err := q.Find(&items).Error; err != nil {
			respond(c, 500, gin.H{"error": "查询失败"})
			return
		}
		out := make([]ListedItem, 0, len(items))
		for _, item := range items {
			out = append(out, quote(item))
		}
		respond(c, 200, out)
	})
	r.POST("/api/watchlist", func(c *gin.Context) {
		var in Input
		if c.ShouldBindJSON(&in) != nil {
			respond(c, 400, gin.H{"error": "JSON 无效"})
			return
		}
		in, err := clean(in)
		if err != nil {
			respond(c, 400, gin.H{"error": err.Error()})
			return
		}
		item := Instrument{Market: in.Market, Symbol: in.Symbol, Name: in.Name}
		if err := db.Create(&item).Error; err != nil {
			respond(c, 409, gin.H{"error": "合约已存在或保存失败"})
			return
		}
		respond(c, 201, item)
	})
	r.PUT("/api/watchlist/:id", func(c *gin.Context) {
		var item Instrument
		if err := db.First(&item, c.Param("id")).Error; err != nil {
			respond(c, 404, gin.H{"error": "未找到合约"})
			return
		}
		var in Input
		if c.ShouldBindJSON(&in) != nil {
			respond(c, 400, gin.H{"error": "JSON 无效"})
			return
		}
		in, err := clean(in)
		if err != nil {
			respond(c, 400, gin.H{"error": err.Error()})
			return
		}
		item.Market = in.Market
		item.Symbol = in.Symbol
		item.Name = in.Name
		if err := db.Save(&item).Error; err != nil {
			respond(c, 409, gin.H{"error": "合约冲突或更新失败"})
			return
		}
		respond(c, 200, item)
	})
	r.DELETE("/api/watchlist/:id", func(c *gin.Context) {
		result := db.Delete(&Instrument{}, c.Param("id"))
		if result.Error != nil {
			respond(c, 500, gin.H{"error": "删除失败"})
			return
		}
		if result.RowsAffected == 0 {
			respond(c, 404, gin.H{"error": "未找到合约"})
			return
		}
		c.Status(204)
	})
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(r.Run(":" + port))
}
