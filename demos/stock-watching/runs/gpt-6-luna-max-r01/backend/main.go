package main

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"hash/fnv"
	"log/slog"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Contract struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Market    string    `json:"market" gorm:"size:2;not null;uniqueIndex:idx_market_symbol"`
	Symbol    string    `json:"symbol" gorm:"size:12;not null;uniqueIndex:idx_market_symbol"`
	Name      string    `json:"name" gorm:"size:80;not null;index"`
	Sector    string    `json:"sector" gorm:"size:50;not null;default:''"`
	Exchange  string    `json:"exchange" gorm:"size:24;not null"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ContractInput struct {
	Market string `json:"market" binding:"required,oneof=CN HK US"`
	Symbol string `json:"symbol" binding:"required,max=12"`
	Name   string `json:"name" binding:"required,max=80"`
	Sector string `json:"sector" binding:"omitempty,max=50"`
}

type ContractUpdateInput struct {
	Symbol string `json:"symbol" binding:"required,max=12"`
	Name   string `json:"name" binding:"required,max=80"`
	Sector string `json:"sector" binding:"omitempty,max=50"`
}

type Quote struct {
	Price         float64   `json:"price"`
	Change        float64   `json:"change"`
	ChangePercent float64   `json:"changePercent"`
	Volume        int64     `json:"volume"`
	High          float64   `json:"high"`
	Low           float64   `json:"low"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type ContractResponse struct {
	ID        uint      `json:"id"`
	Market    string    `json:"market"`
	Symbol    string    `json:"symbol"`
	Name      string    `json:"name"`
	Sector    string    `json:"sector"`
	Exchange  string    `json:"exchange"`
	Price     float64   `json:"price"`
	Change    float64   `json:"change"`
	ChangePct float64   `json:"changePercent"`
	Volume    int64     `json:"volume"`
	High      float64   `json:"high"`
	Low       float64   `json:"low"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Server struct {
	db     *gorm.DB
	logger *slog.Logger
}

type statusWriter struct {
	gin.ResponseWriter
	status int
}

func (writer *statusWriter) WriteHeader(code int) {
	writer.status = code
	writer.ResponseWriter.WriteHeader(code)
}

func (writer *statusWriter) Write(data []byte) (int, error) {
	if writer.status == 0 {
		writer.status = http.StatusOK
	}
	return writer.ResponseWriter.Write(data)
}

func main() {
	_ = godotenv.Load()
	_ = godotenv.Load("../.env")

	logLevel := slog.LevelInfo
	if strings.EqualFold(os.Getenv("LOG_LEVEL"), "debug") {
		logLevel = slog.LevelDebug
	}
	appLogger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: logLevel}))

	databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if databaseURL == "" {
		databaseURL = "postgres://watchlist:watchlist@127.0.0.1:5432/stock_watchlist?sslmode=disable"
	}
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		TranslateError: true,
		Logger:         logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		appLogger.Error("database.connect_failed", "error", err.Error())
		os.Exit(1)
	}
	if err := db.AutoMigrate(&Contract{}); err != nil {
		appLogger.Error("database.migrate_failed", "error", err.Error())
		os.Exit(1)
	}

	server := &Server{db: db, logger: appLogger}
	router := gin.New()
	router.Use(server.requestResponseLog(), server.recoverPanics(), corsMiddleware(allowedOrigins()))
	router.GET("/api/healthz", server.health)
	router.GET("/api/markets", server.markets)
	router.GET("/api/contracts", server.listContracts)
	router.POST("/api/contracts", server.createContract)
	router.GET("/api/contracts/:id", server.getContract)
	router.PUT("/api/contracts/:id", server.updateContract)
	router.DELETE("/api/contracts/:id", server.deleteContract)

	port := strings.TrimSpace(os.Getenv("PORT"))
	if port == "" {
		port = "8080"
	}
	if _, err := strconv.Atoi(port); err != nil {
		appLogger.Error("server.invalid_port", "port", port)
		os.Exit(1)
	}
	appLogger.Info("server.started", "port", port, "markets", []string{"CN", "HK", "US"})
	if err := router.Run(":" + port); err != nil {
		appLogger.Error("server.stopped", "error", err.Error())
		os.Exit(1)
	}
}

func allowedOrigins() []string {
	value := os.Getenv("CORS_ALLOWED_ORIGINS")
	if strings.TrimSpace(value) == "" {
		value = "http://localhost:5173,http://127.0.0.1:5173"
	}
	var origins []string
	for _, origin := range strings.Split(value, ",") {
		if normalized := strings.TrimSpace(origin); normalized != "" {
			origins = append(origins, normalized)
		}
	}
	return origins
}

func corsMiddleware(origins []string) gin.HandlerFunc {
	allowed := make(map[string]struct{}, len(origins))
	for _, origin := range origins {
		allowed[origin] = struct{}{}
	}
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if _, ok := allowed[origin]; ok && origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID")
			c.Header("Access-Control-Expose-Headers", "X-Request-ID")
			c.Header("Access-Control-Max-Age", "600")
		}
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func (server *Server) requestResponseLog() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = newRequestID()
		}
		c.Set("requestID", requestID)
		c.Header("X-Request-ID", requestID)
		writer := &statusWriter{ResponseWriter: c.Writer}
		c.Writer = writer
		startedAt := time.Now()

		server.logger.Info("http.request",
			"request_id", requestID,
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"remote_addr", c.ClientIP(),
			"user_agent", c.Request.UserAgent(),
		)
		c.Next()

		status := writer.status
		if status == 0 {
			status = http.StatusOK
		}
		server.logger.Info("http.response",
			"request_id", requestID,
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", status,
			"duration_ms", time.Since(startedAt).Milliseconds(),
			"response_bytes", writer.Size(),
		)
	}
}

func (server *Server) recoverPanics() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if recovered := recover(); recovered != nil {
				server.logger.Error("http.panic", "request_id", c.GetString("requestID"), "panic", fmt.Sprint(recovered))
				writeError(c, http.StatusInternalServerError, "internal_error", "服务器内部错误")
				c.Abort()
			}
		}()
		c.Next()
	}
}

func newRequestID() string {
	var value [16]byte
	if _, err := rand.Read(value[:]); err == nil {
		return hex.EncodeToString(value[:])
	}
	return strconv.FormatInt(time.Now().UnixNano(), 16)
}

func (server *Server) health(c *gin.Context) {
	sqlDB, err := server.db.DB()
	if err == nil {
		err = sqlDB.PingContext(c.Request.Context())
	}
	if err != nil {
		server.logger.Error("database.health_check_failed", "error", err.Error())
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": gin.H{"code": "database_unavailable", "message": "数据库暂不可用"}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "stock-watchlist-api"})
}

func (server *Server) markets(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": []gin.H{
		{"id": "CN", "name": "A 股", "description": "沪深市场", "currency": "CNY"},
		{"id": "HK", "name": "港股", "description": "香港市场", "currency": "HKD"},
		{"id": "US", "name": "美股", "description": "美国市场", "currency": "USD"},
	}})
}

func (server *Server) listContracts(c *gin.Context) {
	market := strings.ToUpper(strings.TrimSpace(c.Query("market")))
	if !validMarket(market) {
		writeError(c, http.StatusBadRequest, "invalid_market", "market 必须是 CN、HK 或 US")
		return
	}
	query := strings.TrimSpace(c.Query("q"))
	if utf8.RuneCountInString(query) > 80 {
		writeError(c, http.StatusBadRequest, "invalid_query", "搜索内容最多 80 个字符")
		return
	}

	var contracts []Contract
	databaseQuery := server.db.Where("market = ?", market)
	if query != "" {
		pattern := "%" + query + "%"
		databaseQuery = databaseQuery.Where("symbol ILIKE ? OR name ILIKE ? OR sector ILIKE ?", pattern, pattern, pattern)
	}
	if err := databaseQuery.Order("symbol ASC").Limit(200).Find(&contracts).Error; err != nil {
		server.logger.Error("contracts.list_failed", "error", err.Error())
		writeError(c, http.StatusInternalServerError, "database_error", "读取自选合约失败")
		return
	}

	result := make([]ContractResponse, 0, len(contracts))
	for _, contract := range contracts {
		result = append(result, responseFor(contract))
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (server *Server) getContract(c *gin.Context) {
	contract, ok := server.findContract(c)
	if !ok {
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": responseFor(contract)})
}

func (server *Server) createContract(c *gin.Context) {
	var input ContractInput
	if err := c.ShouldBindJSON(&input); err != nil {
		writeError(c, http.StatusBadRequest, "invalid_input", "请求格式无效，请检查必填项与字段长度")
		return
	}
	contract, err := contractFromInput(input)
	if err != nil {
		writeError(c, http.StatusBadRequest, "invalid_input", err.Error())
		return
	}
	if err := server.db.Create(&contract).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			writeError(c, http.StatusConflict, "contract_exists", "此市场中已存在该合约代码")
			return
		}
		server.logger.Error("contracts.create_failed", "market", contract.Market, "symbol", contract.Symbol, "error", err.Error())
		writeError(c, http.StatusInternalServerError, "database_error", "创建自选合约失败")
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": responseFor(contract)})
}

func (server *Server) updateContract(c *gin.Context) {
	contract, ok := server.findContract(c)
	if !ok {
		return
	}
	var input ContractUpdateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		writeError(c, http.StatusBadRequest, "invalid_input", "请求格式无效，请检查必填项与字段长度")
		return
	}
	input.Symbol = strings.ToUpper(strings.TrimSpace(input.Symbol))
	input.Name = strings.TrimSpace(input.Name)
	input.Sector = strings.TrimSpace(input.Sector)
	if err := validateContractFields(contract.Market, input.Symbol, input.Name, input.Sector); err != nil {
		writeError(c, http.StatusBadRequest, "invalid_input", err.Error())
		return
	}
	updates := map[string]any{
		"symbol":   input.Symbol,
		"name":     input.Name,
		"sector":   input.Sector,
		"exchange": exchangeFor(contract.Market, input.Symbol),
	}
	if err := server.db.Model(&contract).Updates(updates).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			writeError(c, http.StatusConflict, "contract_exists", "此市场中已存在该合约代码")
			return
		}
		server.logger.Error("contracts.update_failed", "id", contract.ID, "error", err.Error())
		writeError(c, http.StatusInternalServerError, "database_error", "更新自选合约失败")
		return
	}
	if err := server.db.First(&contract, contract.ID).Error; err != nil {
		writeError(c, http.StatusInternalServerError, "database_error", "读取更新后的合约失败")
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": responseFor(contract)})
}

func (server *Server) deleteContract(c *gin.Context) {
	contract, ok := server.findContract(c)
	if !ok {
		return
	}
	if err := server.db.Delete(&contract).Error; err != nil {
		server.logger.Error("contracts.delete_failed", "id", contract.ID, "error", err.Error())
		writeError(c, http.StatusInternalServerError, "database_error", "删除自选合约失败")
		return
	}
	c.Status(http.StatusNoContent)
}

func (server *Server) findContract(c *gin.Context) (Contract, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		writeError(c, http.StatusBadRequest, "invalid_id", "合约 ID 格式无效")
		return Contract{}, false
	}
	var contract Contract
	if err := server.db.First(&contract, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(c, http.StatusNotFound, "not_found", "找不到该自选合约")
			return Contract{}, false
		}
		server.logger.Error("contracts.read_failed", "id", id, "error", err.Error())
		writeError(c, http.StatusInternalServerError, "database_error", "读取自选合约失败")
		return Contract{}, false
	}
	return contract, true
}

func contractFromInput(input ContractInput) (Contract, error) {
	contract := Contract{
		Market: strings.ToUpper(strings.TrimSpace(input.Market)),
		Symbol: strings.ToUpper(strings.TrimSpace(input.Symbol)),
		Name:   strings.TrimSpace(input.Name),
		Sector: strings.TrimSpace(input.Sector),
	}
	if !validMarket(contract.Market) {
		return Contract{}, errors.New("市场必须是 CN、HK 或 US")
	}
	if err := validateContractFields(contract.Market, contract.Symbol, contract.Name, contract.Sector); err != nil {
		return Contract{}, err
	}
	contract.Exchange = exchangeFor(contract.Market, contract.Symbol)
	return contract, nil
}

func validateContractFields(market, symbol, name, sector string) error {
	if !validMarket(market) {
		return errors.New("市场必须是 CN、HK 或 US")
	}
	if !validSymbol(market, symbol) {
		messages := map[string]string{
			"CN": "A 股代码应为 6 位数字",
			"HK": "港股代码应为 4 至 5 位数字",
			"US": "美股代码应为 1 至 10 位字母、数字、点号或连字符",
		}
		return errors.New(messages[market])
	}
	if name == "" || utf8.RuneCountInString(name) > 80 || strings.ContainsRune(name, '\x00') {
		return errors.New("合约名称为必填项，最多 80 个字符")
	}
	if utf8.RuneCountInString(sector) > 50 || strings.ContainsRune(sector, '\x00') {
		return errors.New("行业分类最多 50 个字符")
	}
	return nil
}

func validMarket(market string) bool {
	return market == "CN" || market == "HK" || market == "US"
}

func validSymbol(market, symbol string) bool {
	switch market {
	case "CN":
		return len(symbol) == 6 && allDigits(symbol)
	case "HK":
		return (len(symbol) == 4 || len(symbol) == 5) && allDigits(symbol)
	case "US":
		if len(symbol) == 0 || len(symbol) > 10 || symbol[0] < 'A' || symbol[0] > 'Z' {
			return false
		}
		for _, char := range symbol {
			if !(char >= 'A' && char <= 'Z') && !(char >= '0' && char <= '9') && char != '.' && char != '-' {
				return false
			}
		}
		return true
	default:
		return false
	}
}

func allDigits(value string) bool {
	for _, char := range value {
		if char < '0' || char > '9' {
			return false
		}
	}
	return value != ""
}

func exchangeFor(market, symbol string) string {
	switch market {
	case "CN":
		if strings.HasPrefix(symbol, "6") || strings.HasPrefix(symbol, "5") || strings.HasPrefix(symbol, "9") {
			return "SSE"
		}
		return "SZSE"
	case "HK":
		return "HKEX"
	default:
		return "US"
	}
}

func responseFor(contract Contract) ContractResponse {
	quote := demoQuote(contract.Market, contract.Symbol)
	return ContractResponse{
		ID: contract.ID, Market: contract.Market, Symbol: contract.Symbol,
		Name: contract.Name, Sector: contract.Sector, Exchange: contract.Exchange,
		Price: quote.Price, Change: quote.Change, ChangePct: quote.ChangePercent,
		Volume: quote.Volume, High: quote.High, Low: quote.Low, UpdatedAt: quote.UpdatedAt,
	}
}

// demoQuote supplies stable illustrative values; it is not connected to a live quote provider.
func demoQuote(market, symbol string) Quote {
	hash := fnv.New32a()
	_, _ = hash.Write([]byte(market + ":" + symbol))
	value := hash.Sum32()
	var price float64
	switch market {
	case "CN":
		price = 5 + float64(value%250000)/100
	case "HK":
		price = 1 + float64(value%160000)/100
	default:
		price = 5 + float64(value%80000)/100
	}
	percent := (float64((value>>8)%1401) - 700) / 100
	change := price * percent / 100
	price = roundTo(price, 2)
	change = roundTo(change, 2)
	return Quote{
		Price:         price,
		Change:        change,
		ChangePercent: roundTo(percent, 2),
		Volume:        int64(100000 + value%25000000),
		High:          roundTo(price*1.018, 2),
		Low:           roundTo(price*0.982, 2),
		UpdatedAt:     time.Now().UTC(),
	}
}

func roundTo(value float64, places int) float64 {
	factor := float64(1)
	for range places {
		factor *= 10
	}
	return math.Round(value*factor) / factor
}

func writeError(c *gin.Context, status int, code, message string) {
	c.JSON(status, gin.H{"error": gin.H{"code": code, "message": message}})
}
