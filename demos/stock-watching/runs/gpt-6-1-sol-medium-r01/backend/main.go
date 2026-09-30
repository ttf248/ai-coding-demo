package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync/atomic"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Contract struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Market    string    `json:"market" gorm:"size:8;uniqueIndex:market_symbol"`
	Symbol    string    `json:"symbol" gorm:"size:24;uniqueIndex:market_symbol"`
	Name      string    `json:"name" gorm:"size:80;not null"`
	Note      string    `json:"note" gorm:"size:240"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
type Payload struct {
	Market *string `json:"market"`
	Symbol *string `json:"symbol"`
	Name   *string `json:"name"`
	Note   *string `json:"note"`
}
type Quote struct {
	Price         float64   `json:"price"`
	Change        float64   `json:"change"`
	ChangePercent float64   `json:"changePercent"`
	Volume        int       `json:"volume"`
	Currency      string    `json:"currency"`
	Timestamp     time.Time `json:"timestamp"`
	Source        string    `json:"source"`
}
type View struct {
	Contract
	Quote Quote `json:"quote"`
}
type app struct{ db *gorm.DB }

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
func fail(c *gin.Context, status int, message string) {
	c.AbortWithStatusJSON(status, gin.H{"error": gin.H{"message": message}, "requestId": c.GetString("requestId")})
}

var symbolPattern = regexp.MustCompile(`^[A-Z0-9][A-Z0-9.-]{0,23}$`)

func validMarket(s string) bool { return s == "CN" || s == "HK" || s == "US" }
func validate(v Contract) error {
	if !validMarket(v.Market) {
		return errors.New("market 必须为 CN、HK 或 US")
	}
	if !symbolPattern.MatchString(v.Symbol) {
		return errors.New("代码只能包含大写字母、数字、点和短横线，长度 1–24")
	}
	if len([]rune(v.Name)) < 1 || len([]rune(v.Name)) > 80 {
		return errors.New("名称长度必须为 1–80")
	}
	if len([]rune(v.Note)) > 240 {
		return errors.New("备注不能超过 240 个字符")
	}
	return nil
}
func parse(c *gin.Context) (Payload, bool) {
	var p Payload
	decoder := json.NewDecoder(http.MaxBytesReader(c.Writer, c.Request.Body, 1024*1024))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&p); err != nil {
		fail(c, 400, "请求需要有效 JSON 对象，且不能包含未知字段")
		return p, false
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		fail(c, 400, "请求只能包含一个 JSON 对象")
		return p, false
	}
	return p, true
}
func merge(v Contract, p Payload) Contract {
	if p.Market != nil {
		v.Market = strings.ToUpper(strings.TrimSpace(*p.Market))
	}
	if p.Symbol != nil {
		v.Symbol = strings.ToUpper(strings.TrimSpace(*p.Symbol))
	}
	if p.Name != nil {
		v.Name = strings.TrimSpace(*p.Name)
	}
	if p.Note != nil {
		v.Note = strings.TrimSpace(*p.Note)
	}
	return v
}
func quote(v Contract) Quote {
	seed := 0
	for _, r := range v.Symbol {
		seed += int(r)
	}
	t := time.Now().UTC()
	base := float64(seed%490+30) / 3
	delta := math.Sin(float64(t.Unix()/15)+float64(seed)) * .017
	price := math.Round(base*(1+delta)*100) / 100
	change := math.Round((price-base)*100) / 100
	currency := map[string]string{"CN": "CNY", "HK": "HKD", "US": "USD"}[v.Market]
	return Quote{price, change, math.Round(delta*10000) / 100, seed*130 + 12000, currency, t, "simulated"}
}
func present(v Contract) View { return View{v, quote(v)} }
func (a app) dbError(c *gin.Context, err error) {
	log.Printf("database request=%s error=%v", c.GetString("requestId"), err)
	switch {
	case errors.Is(err, gorm.ErrRecordNotFound):
		fail(c, 404, "合约不存在")
	case errors.Is(err, gorm.ErrDuplicatedKey):
		fail(c, 409, "该市场已存在相同代码")
	default:
		fail(c, 503, "数据库暂不可用，请稍后重试")
	}
}
func (a app) find(c *gin.Context) (Contract, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil || id == 0 {
		fail(c, 400, "无效的合约 ID")
		return Contract{}, false
	}
	var v Contract
	if err = a.db.First(&v, id).Error; err != nil {
		a.dbError(c, err)
		return v, false
	}
	return v, true
}
func (a app) list(c *gin.Context) {
	market := strings.ToUpper(c.Query("market"))
	if market != "" && !validMarket(market) {
		fail(c, 400, "无效的市场")
		return
	}
	q := strings.TrimSpace(c.Query("q"))
	if len([]rune(q)) > 80 {
		fail(c, 400, "查询关键字不能超过 80 个字符")
		return
	}
	query := a.db.Model(&Contract{})
	if market != "" {
		query = query.Where("market = ?", market)
	}
	if q != "" {
		escaped := strings.NewReplacer("\\", "\\\\", "%", "\\%", "_", "\\_").Replace(q)
		query = query.Where("symbol ILIKE ? OR name ILIKE ?", "%"+escaped+"%", "%"+escaped+"%")
	}
	var rows []Contract
	if err := query.Order("created_at DESC, id DESC").Limit(500).Find(&rows).Error; err != nil {
		a.dbError(c, err)
		return
	}
	views := make([]View, 0, len(rows))
	for _, v := range rows {
		views = append(views, present(v))
	}
	c.JSON(200, gin.H{"data": views, "quoteSource": "simulated", "limit": 500})
}
func (a app) create(c *gin.Context) {
	p, ok := parse(c)
	if !ok {
		return
	}
	v := merge(Contract{}, p)
	if err := validate(v); err != nil {
		fail(c, 400, err.Error())
		return
	}
	if err := a.db.Create(&v).Error; err != nil {
		a.dbError(c, err)
		return
	}
	c.JSON(201, gin.H{"data": present(v)})
}
func (a app) update(c *gin.Context) {
	v, ok := a.find(c)
	if !ok {
		return
	}
	p, ok := parse(c)
	if !ok {
		return
	}
	if p.Market == nil && p.Symbol == nil && p.Name == nil && p.Note == nil {
		fail(c, 400, "至少提供一个可修改字段")
		return
	}
	v = merge(v, p)
	if err := validate(v); err != nil {
		fail(c, 400, err.Error())
		return
	}
	fields := map[string]interface{}{"market": v.Market, "symbol": v.Symbol, "name": v.Name, "note": v.Note}
	result := a.db.Model(&Contract{}).Where("id = ?", v.ID).Updates(fields)
	if result.Error != nil {
		a.dbError(c, result.Error)
		return
	}
	if result.RowsAffected == 0 {
		fail(c, 404, "合约已被删除")
		return
	}
	if err := a.db.First(&v, v.ID).Error; err != nil {
		a.dbError(c, err)
		return
	}
	c.JSON(200, gin.H{"data": present(v)})
}
func (a app) remove(c *gin.Context) {
	v, ok := a.find(c)
	if !ok {
		return
	}
	result := a.db.Delete(&v)
	if result.Error != nil {
		a.dbError(c, result.Error)
		return
	}
	if result.RowsAffected == 0 {
		fail(c, 404, "合约已被删除")
		return
	}
	c.Status(204)
}

type loggedWriter struct {
	gin.ResponseWriter
	body bytes.Buffer
}

func (w *loggedWriter) Write(b []byte) (int, error) {
	if w.body.Len() < 8192 {
		n := 8192 - w.body.Len()
		if n > len(b) {
			n = len(b)
		}
		w.body.Write(b[:n])
	}
	return w.ResponseWriter.Write(b)
}

var requestSequence atomic.Uint64

func requestLog() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		id := fmt.Sprintf("%x-%x", start.UnixNano(), requestSequence.Add(1))
		c.Set("requestId", id)
		c.Header("X-Request-ID", id)
		body, err := io.ReadAll(io.LimitReader(c.Request.Body, 1024*1024+1))
		if err != nil {
			fail(c, 400, "无法读取请求")
			return
		}
		if len(body) > 1024*1024 {
			fail(c, 413, "请求体超过 1 MiB")
			return
		}
		c.Request.Body = io.NopCloser(bytes.NewReader(body))
		writer := &loggedWriter{ResponseWriter: c.Writer}
		c.Writer = writer
		log.Printf("request id=%s method=%s path=%s query=%q body=%q", id, c.Request.Method, c.Request.URL.Path, c.Request.URL.RawQuery, string(body))
		c.Next()
		log.Printf("response id=%s status=%d duration=%s body=%q", id, writer.Status(), time.Since(start), writer.body.String())
	}
}
func cors() gin.HandlerFunc {
	origins := strings.Split(env("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"), ",")
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			allowed := false
			for _, o := range origins {
				if strings.TrimSpace(o) == origin {
					allowed = true
					break
				}
			}
			c.Header("Vary", "Origin")
			if !allowed {
				fail(c, 403, "当前来源不允许跨域访问")
				return
			}
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type")
			c.Header("Access-Control-Expose-Headers", "X-Request-ID")
		}
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("请设置 DATABASE_URL，示例见 .env.example")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{TranslateError: true, Logger: logger.Default.LogMode(logger.Warn)})
	if err != nil {
		log.Fatal("连接 PostgreSQL 失败，请检查配置和服务状态")
	}
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("无法取得数据库连接")
	}
	defer sqlDB.Close()
	sqlDB.SetMaxOpenConns(12)
	sqlDB.SetMaxIdleConns(4)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)
	if err = db.AutoMigrate(&Contract{}); err != nil {
		log.Fatal("数据库迁移失败，请检查数据库权限")
	}
	a := app{db}
	r := gin.New()
	r.Use(gin.Recovery(), requestLog(), cors())
	r.GET("/api/health", func(c *gin.Context) {
		if err := sqlDB.PingContext(c.Request.Context()); err != nil {
			fail(c, 503, "数据库连接失败")
			return
		}
		c.JSON(200, gin.H{"status": "ok", "quoteSource": "simulated"})
	})
	r.GET("/api/contracts", a.list)
	r.GET("/api/contracts/:id", func(c *gin.Context) {
		if v, ok := a.find(c); ok {
			c.JSON(200, gin.H{"data": present(v)})
		}
	})
	r.POST("/api/contracts", a.create)
	r.PATCH("/api/contracts/:id", a.update)
	r.DELETE("/api/contracts/:id", a.remove)
	server := &http.Server{Addr: env("LISTEN_ADDR", "127.0.0.1:8080"), Handler: r, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 15 * time.Second, WriteTimeout: 20 * time.Second, IdleTimeout: 60 * time.Second}
	log.Printf("API listening on %s; quotes are simulated", server.Addr)
	if err = server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
