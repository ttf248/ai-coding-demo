package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"stock-watching-backend/internal/config"
	"stock-watching-backend/internal/db"
	"stock-watching-backend/internal/handler"
	"stock-watching-backend/internal/middleware"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()

	conn, err := db.Open(cfg)
	if err != nil {
		panic(err)
	}
	if err := db.Migrate(conn); err != nil {
		panic(err)
	}
	if cfg.Seed {
		if err := db.Seed(conn); err != nil {
			panic(err)
		}
	}

	r := gin.New()
	r.Use(middleware.Recovery())
	r.Use(middleware.AccessLog())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Request-ID"},
		ExposeHeaders:    []string{"X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	h := handler.New(conn, cfg)
	api := r.Group("/api/v1")
	{
		api.GET("/markets", h.ListMarkets)
		api.GET("/stocks", h.ListStocks)
		api.GET("/stocks/:code/quote", h.StockQuote)

		api.GET("/watchlist", h.ListWatchlist)
		api.POST("/watchlist", h.CreateWatchlist)
		api.PUT("/watchlist/:id", h.UpdateWatchlist)
		api.DELETE("/watchlist/:id", h.DeleteWatchlist)

		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})
	}

	srv := &http.Server{
		Addr:              cfg.HTTPAddr,
		Handler:           r,
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			panic(err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		panic(err)
	}
}