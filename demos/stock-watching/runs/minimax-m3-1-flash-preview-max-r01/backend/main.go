// 自选股后端：Gin + GORM + PostgreSQL。
//
// 运行：
//
//	go mod tidy
//	go run .
//
// 依赖的环境变量见 internal/config。
package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"stockwatch/backend/internal/config"
	"stockwatch/backend/internal/database"
	"stockwatch/backend/internal/handler"
	"stockwatch/backend/internal/middleware"
	"stockwatch/backend/internal/repository"
	"stockwatch/backend/internal/service"
)

func main() {
	cfg := config.Load()
	gin.SetMode(cfg.GinMode)

	db, err := database.Open(cfg.DatabaseDSN, cfg.SeedEnabled)
	if err != nil {
		// 数据库不可用时不直接退出：接口仍然启动，/health 会返回 503，
		// 前端据此展示「后端不可用」告警，便于联调。
		log.Printf("[warn] 数据库未就绪: %v", err)
	}

	router := gin.New()
	router.Use(middleware.Recovery(), middleware.RequestID(), middleware.Logger(cfg.LogRequests), middleware.CORS(cfg.CORSOrigins))
	router.MaxMultipartMemory = int64(cfg.RequestLimit)

	repo := repository.New(db)
	h := handler.New(repo, service.NewSimulatedProvider(15*time.Second))
	h.Register(router)

	// 无数据库时用统一错误替代真实错误，便于前端看到明确提示
	if db == nil {
		log.Println("[warn] 以只读模式启动：所有数据库接口将返回 503")
	}

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		log.Printf("[boot] 监听 :%s  模式=%s  跨域白名单=%v  行情源=%s",
			cfg.Port, cfg.GinMode, cfg.CORSOrigins, cfg.QuoteMode)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("[fatal] 服务启动失败: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[shutdown] 正在关闭…")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("[shutdown] 强制关闭: %v", err)
	}
	log.Println("[shutdown] 已退出")
}
