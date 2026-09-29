package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

func AccessLog() gin.HandlerFunc {
	return func(c *gin.Context) {
		reqID := c.GetHeader("X-Request-ID")
		if reqID == "" {
			reqID = uuid.NewString()
		}
		c.Set("requestID", reqID)
		c.Header("X-Request-ID", reqID)

		start := time.Now()
		c.Next()

		log.Info().
			Str("request_id", reqID).
			Str("method", c.Request.Method).
			Str("path", c.Request.URL.Path).
			Int("status", c.Writer.Status()).
			Dur("cost", time.Since(start)).
			Msg("http request")
	}
}

func Recovery() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered any) {
		log.Error().Interface("panic", recovered).Msg("panic recovered")
		c.AbortWithStatusJSON(500, gin.H{"code": "internal_error", "message": "服务器内部错误"})
	})
}