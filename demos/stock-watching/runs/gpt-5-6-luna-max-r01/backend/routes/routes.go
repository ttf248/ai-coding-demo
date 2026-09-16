package routes

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"stock-watch-luna/middleware"
	"stock-watch-luna/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type stockInput struct {
	Code          string  `json:"code" binding:"required"`
	Name          string  `json:"name" binding:"required"`
	Market        string  `json:"market" binding:"required"`
	Price         float64 `json:"price"`
	Change        float64 `json:"change"`
	ChangePercent float64 `json:"changePercent"`
	Volume        int64   `json:"volume"`
}

func New(db *gorm.DB) *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery(), middleware.RequestLog(), cors.New(cors.Config{
		AllowOrigins:     allowedOrigins(),
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: os.Getenv("CORS_ORIGIN") != "*",
		MaxAge:           12 * time.Hour,
	}))
	router.GET("/healthz", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status": "ok"}) })
	api := router.Group("/api")
	api.GET("/markets", markets)
	api.GET("/stocks", list(db))
	api.POST("/stocks", create(db))
	api.PUT("/stocks/:id", update(db))
	api.DELETE("/stocks/:id", remove(db))
	api.DELETE("/stocks", removeMany(db))
	return router
}

func allowedOrigins() []string {
	if value := os.Getenv("CORS_ORIGIN"); value != "" && value != "*" {
		return strings.Split(value, ",")
	}
	return []string{"http://localhost:5173", "http://127.0.0.1:5173"}
}

func markets(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"data": models.Markets}) }

func list(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := db.Order("market asc").Order("code asc")
		if market := c.Query("market"); market != "" {
			if _, ok := models.Markets[market]; !ok { fail(c, http.StatusBadRequest, "MARKET_INVALID", "market must be CN, HK or US"); return }
			query = query.Where("market = ?", market)
		}
		if search := strings.TrimSpace(c.Query("q")); search != "" {
			like := "%" + search + "%"
			query = query.Where("code ILIKE ? OR name ILIKE ?", like, like)
		}
		var stocks []models.Stock
		if err := query.Find(&stocks).Error; err != nil { fail(c, http.StatusInternalServerError, "STOCK_LIST_FAILED", "unable to query stocks"); return }
		c.JSON(http.StatusOK, gin.H{"data": stocks, "meta": gin.H{"count": len(stocks), "updatedAt": time.Now().UTC()}})
	}
}

func create(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input stockInput
		if !bind(c, &input) { return }
		if err := validate(input); err != nil { fail(c, http.StatusBadRequest, "INPUT_INVALID", err.Error()); return }
		stock := models.Stock{ID: input.Market + "-" + strings.ToUpper(input.Code), Code: strings.ToUpper(input.Code), Name: strings.TrimSpace(input.Name), Market: input.Market, Price: input.Price, Change: input.Change, ChangePercent: input.ChangePercent, Volume: input.Volume}
		if err := db.Create(&stock).Error; err != nil { fail(c, http.StatusConflict, "STOCK_EXISTS", "a stock with this market and code already exists"); return }
		c.JSON(http.StatusCreated, gin.H{"data": stock})
	}
}

func update(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input stockInput
		if !bind(c, &input) { return }
		if err := validate(input); err != nil { fail(c, http.StatusBadRequest, "INPUT_INVALID", err.Error()); return }
		var stock models.Stock
		if db.First(&stock, "id = ?", c.Param("id")).Error != nil { fail(c, http.StatusNotFound, "STOCK_NOT_FOUND", "stock does not exist"); return }
		stock.Code, stock.Name, stock.Market = strings.ToUpper(input.Code), strings.TrimSpace(input.Name), input.Market
		stock.Price, stock.Change, stock.ChangePercent, stock.Volume = input.Price, input.Change, input.ChangePercent, input.Volume
		if err := db.Save(&stock).Error; err != nil { fail(c, http.StatusInternalServerError, "STOCK_UPDATE_FAILED", "unable to update stock"); return }
		c.JSON(http.StatusOK, gin.H{"data": stock})
	}
}

func remove(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		result := db.Delete(&models.Stock{}, "id = ?", c.Param("id"))
		if result.Error != nil { fail(c, http.StatusInternalServerError, "STOCK_DELETE_FAILED", "unable to delete stock"); return }
		if result.RowsAffected == 0 { fail(c, http.StatusNotFound, "STOCK_NOT_FOUND", "stock does not exist"); return }
		c.Status(http.StatusNoContent)
	}
}

func removeMany(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct{ IDs []string `json:"ids" binding:"required,min=1"` }
		if !bind(c, &body) { return }
		result := db.Delete(&models.Stock{}, "id IN ?", body.IDs)
		if result.Error != nil { fail(c, http.StatusInternalServerError, "STOCK_DELETE_FAILED", "unable to delete stocks"); return }
		c.JSON(http.StatusOK, gin.H{"data": gin.H{"deleted": result.RowsAffected}})
	}
}

func bind(c *gin.Context, target any) bool {
	if err := c.ShouldBindJSON(target); err != nil { fail(c, http.StatusBadRequest, "JSON_INVALID", "request body must be valid JSON"); return false }
	return true
}

func validate(input stockInput) error {
	if len(strings.TrimSpace(input.Code)) < 1 || len(strings.TrimSpace(input.Code)) > 12 { return fmt.Errorf("code must be 1-12 characters") }
	if len(strings.TrimSpace(input.Name)) < 1 || len(strings.TrimSpace(input.Name)) > 80 { return fmt.Errorf("name must be 1-80 characters") }
	if _, ok := models.Markets[input.Market]; !ok { return fmt.Errorf("market must be CN, HK or US") }
	if input.Price < 0 || input.Volume < 0 { return fmt.Errorf("price and volume cannot be negative") }
	return nil
}

func fail(c *gin.Context, status int, code, message string) { c.AbortWithStatusJSON(status, gin.H{"error": gin.H{"code": code, "message": message}}) }
