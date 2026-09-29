package main

import (
	"errors"
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

type Stock struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Symbol        string    `json:"symbol" gorm:"size:20;not null;uniqueIndex:idx_market_symbol"`
	Name          string    `json:"name" gorm:"size:80;not null"`
	Market        string    `json:"market" gorm:"size:4;not null;uniqueIndex:idx_market_symbol"`
	Price         float64   `json:"price" gorm:"not null;default:0"`
	Change        float64   `json:"change" gorm:"not null;default:0"`
	ChangePercent float64   `json:"change_percent" gorm:"not null;default:0"`
	QuoteSource   string    `json:"quote_source" gorm:"size:40;not null;default:待更新"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type StockInput struct {
	Symbol string `json:"symbol" binding:"required,max=20"`
	Name   string `json:"name" binding:"required,max=80"`
	Market string `json:"market" binding:"required,oneof=CN HK US"`
}

var symbolPattern = regexp.MustCompile(`^[A-Z0-9.\-]{1,20}$`)

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is required; see Readme.md for a PostgreSQL example")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("connect PostgreSQL: %v", err)
	}
	if err := db.AutoMigrate(&Stock{}); err != nil {
		log.Fatalf("migrate watchlist table: %v", err)
	}
	seedSamples(db)

	r := gin.New()
	r.Use(gin.Recovery(), requestResponseLog(), cors())
	r.GET("/api/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status": "ok"}) })
	r.GET("/api/markets", func(c *gin.Context) {
		c.JSON(http.StatusOK, []gin.H{{"code": "CN", "name": "沪深 A 股", "currency": "CNY"}, {"code": "HK", "name": "港股", "currency": "HKD"}, {"code": "US", "name": "美股", "currency": "USD"}})
	})
	r.GET("/api/stocks", func(c *gin.Context) {
		query := db.Model(&Stock{})
		if market := strings.ToUpper(strings.TrimSpace(c.Query("market"))); market != "" {
			if !validMarket(market) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "market must be CN, HK, or US"})
				return
			}
			query = query.Where("market = ?", market)
		}
		if keyword := strings.TrimSpace(c.Query("q")); keyword != "" {
			like := "%" + strings.ReplaceAll(strings.ReplaceAll(keyword, "%", "\\%"), "_", "\\_") + "%"
			query = query.Where("symbol ILIKE ? OR name ILIKE ?", like, like)
		}
		var rows []Stock
		if err := query.Order("market asc, symbol asc").Find(&rows).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load watchlist"})
			return
		}
		c.JSON(http.StatusOK, rows)
	})
	r.POST("/api/stocks", func(c *gin.Context) {
		input, ok := parseInput(c)
		if !ok {
			return
		}
		row := Stock{Symbol: input.Symbol, Name: input.Name, Market: input.Market, QuoteSource: "待接入行情源"}
		if err := db.Create(&row).Error; err != nil {
			if isDuplicate(err) {
				c.JSON(http.StatusConflict, gin.H{"error": "this symbol is already in the selected market"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add watchlist item"})
			return
		}
		c.JSON(http.StatusCreated, row)
	})
	r.PUT("/api/stocks/:id", func(c *gin.Context) {
		input, ok := parseInput(c)
		if !ok {
			return
		}
		var row Stock
		if err := db.First(&row, c.Param("id")).Error; errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "watchlist item not found"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load watchlist item"})
			return
		}
		row.Symbol, row.Name, row.Market = input.Symbol, input.Name, input.Market
		if err := db.Save(&row).Error; err != nil {
			if isDuplicate(err) {
				c.JSON(http.StatusConflict, gin.H{"error": "this symbol is already in the selected market"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update watchlist item"})
			return
		}
		c.JSON(http.StatusOK, row)
	})
	r.DELETE("/api/stocks/:id", func(c *gin.Context) {
		result := db.Delete(&Stock{}, c.Param("id"))
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete watchlist item"})
			return
		}
		if result.RowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "watchlist item not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"deleted": c.Param("id")})
	})

	address := os.Getenv("API_ADDR")
	if address == "" {
		address = ":8080"
	}
	log.Printf("stock watch API listening on %s", address)
	if err := r.Run(address); err != nil {
		log.Fatalf("start API: %v", err)
	}
}

func parseInput(c *gin.Context) (StockInput, bool) {
	var input StockInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "symbol, name and market are required", "detail": err.Error()})
		return input, false
	}
	input.Symbol = strings.ToUpper(strings.TrimSpace(input.Symbol))
	input.Name = strings.TrimSpace(input.Name)
	input.Market = strings.ToUpper(strings.TrimSpace(input.Market))
	if !symbolPattern.MatchString(input.Symbol) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "symbol may only contain letters, digits, dot, and hyphen"})
		return input, false
	}
	if input.Name == "" || !validMarket(input.Market) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "a non-empty name and a supported market are required"})
		return input, false
	}
	return input, true
}

func validMarket(market string) bool { return market == "CN" || market == "HK" || market == "US" }

func isDuplicate(err error) bool {
	message := strings.ToLower(err.Error())
	return strings.Contains(message, "duplicate key") || strings.Contains(message, "unique constraint")
}

func requestResponseLog() gin.HandlerFunc {
	return func(c *gin.Context) {
		started := time.Now()
		log.Printf("request method=%s path=%s remote=%s", c.Request.Method, c.Request.URL.RequestURI(), c.ClientIP())
		c.Next()
		log.Printf("response method=%s path=%s status=%d elapsed=%s", c.Request.Method, c.Request.URL.Path, c.Writer.Status(), time.Since(started).Round(time.Millisecond))
	}
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func seedSamples(db *gorm.DB) {
	var count int64
	db.Model(&Stock{}).Count(&count)
	if count > 0 {
		return
	}
	rows := []Stock{
		{Symbol: "600519", Name: "贵州茅台", Market: "CN", Price: 1488.20, Change: 18.40, ChangePercent: 1.25, QuoteSource: "样例行情"},
		{Symbol: "000858", Name: "五粮液", Market: "CN", Price: 132.70, Change: -1.12, ChangePercent: -0.84, QuoteSource: "样例行情"},
		{Symbol: "300750", Name: "宁德时代", Market: "CN", Price: 258.36, Change: 4.26, ChangePercent: 1.68, QuoteSource: "样例行情"},
		{Symbol: "00700", Name: "腾讯控股", Market: "HK", Price: 382.20, Change: 3.40, ChangePercent: 0.90, QuoteSource: "样例行情"},
		{Symbol: "09988", Name: "阿里巴巴-W", Market: "HK", Price: 108.50, Change: -1.30, ChangePercent: -1.18, QuoteSource: "样例行情"},
		{Symbol: "AAPL", Name: "Apple Inc.", Market: "US", Price: 228.87, Change: 2.11, ChangePercent: 0.93, QuoteSource: "样例行情"},
		{Symbol: "NVDA", Name: "NVIDIA Corporation", Market: "US", Price: 141.54, Change: 3.52, ChangePercent: 2.55, QuoteSource: "样例行情"},
	}
	if err := db.Create(&rows).Error; err != nil {
		log.Printf("seed sample watchlist: %v", err)
	}
}
