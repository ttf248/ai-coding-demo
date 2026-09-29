package main

import (
	"log/slog"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Contract struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Symbol        string    `json:"symbol" gorm:"size:16;not null;index:idx_market_symbol,unique" binding:"required,min=1,max=16"`
	Name          string    `json:"name" gorm:"size:64;not null" binding:"required,min=1,max=64"`
	Market        string    `json:"market" gorm:"size:4;not null;index:idx_market_symbol,unique" binding:"required,oneof=CN HK US"`
	Last          float64   `json:"last" gorm:"not null" binding:"gte=0"`
	Change        float64   `json:"change" gorm:"not null"`
	ChangePercent float64   `json:"changePercent" gorm:"not null"`
	Currency      string    `json:"currency" gorm:"size:4;not null"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type App struct{ db *gorm.DB }

func main() {
	_ = godotenv.Load()
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		logger.Error("DATABASE_URL is required")
		os.Exit(1)
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logger.Error("database connection failed", "error", err)
		os.Exit(1)
	}
	if err := db.AutoMigrate(&Contract{}); err != nil {
		logger.Error("database migration failed", "error", err)
		os.Exit(1)
	}
	app := &App{db: db}
	router := gin.New()
	router.Use(gin.LoggerWithWriter(os.Stdout), gin.Recovery())
	origins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = origins
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
	router.Use(cors.New(corsConfig))
	router.Use(requestLogger(logger))
	router.GET("/api/health", app.health)
	router.GET("/api/markets", app.markets)
	router.GET("/api/contracts", app.list)
	router.POST("/api/contracts", app.create)
	router.PUT("/api/contracts/:id", app.update)
	router.DELETE("/api/contracts/:id", app.remove)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	logger.Info("stock service listening", "port", port)
	if err := router.Run(":" + port); err != nil {
		logger.Error("server stopped", "error", err)
	}
}

func requestLogger(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		started := time.Now()
		c.Next()
		logger.Info("http exchange", "method", c.Request.Method, "path", c.Request.URL.Path, "status", c.Writer.Status(), "duration", time.Since(started).String())
	}
}
func (a *App) health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "time": time.Now().UTC()})
}
func (a *App) markets(c *gin.Context) {
	c.JSON(http.StatusOK, []gin.H{{"id": "CN", "label": "A 股", "currency": "CNY"}, {"id": "HK", "label": "港股", "currency": "HKD"}, {"id": "US", "label": "美股", "currency": "USD"}})
}
func (a *App) list(c *gin.Context) {
	var records []Contract
	query := a.db.Order("updated_at desc")
	if market := strings.ToUpper(strings.TrimSpace(c.Query("market"))); market != "" {
		if market != "CN" && market != "HK" && market != "US" {
			c.JSON(http.StatusBadRequest, gin.H{"message": "market must be CN, HK or US"})
			return
		}
		query = query.Where("market = ?", market)
	}
	if err := query.Find(&records).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to query contracts"})
		return
	}
	c.JSON(http.StatusOK, records)
}
func (a *App) create(c *gin.Context) {
	var input Contract
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid contract", "detail": err.Error()})
		return
	}
	input.ID = 0
	input.Currency = currency(input.Market)
	input.UpdatedAt = time.Now().UTC()
	if err := a.db.Create(&input).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"message": "symbol already exists in this market"})
		return
	}
	c.JSON(http.StatusCreated, input)
}
func (a *App) update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid id"})
		return
	}
	var input Contract
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid contract", "detail": err.Error()})
		return
	}
	var item Contract
	if err := a.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "contract not found"})
		return
	}
	item.Symbol = input.Symbol
	item.Name = input.Name
	item.Market = input.Market
	item.Last = input.Last
	item.Change = input.Change
	item.ChangePercent = input.ChangePercent
	item.Currency = currency(input.Market)
	item.UpdatedAt = time.Now().UTC()
	if err := a.db.Save(&item).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"message": "could not update contract"})
		return
	}
	c.JSON(http.StatusOK, item)
}
func (a *App) remove(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid id"})
		return
	}
	result := a.db.Delete(&Contract{}, id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "could not delete contract"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "contract not found"})
		return
	}
	c.Status(http.StatusNoContent)
}
func currency(market string) string {
	switch strings.ToUpper(market) {
	case "US":
		return "USD"
	case "HK":
		return "HKD"
	default:
		return "CNY"
	}
}
