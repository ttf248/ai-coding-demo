package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

type statusWriter struct {
	gin.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func RequestLog() gin.HandlerFunc {
	return func(c *gin.Context) {
		started := time.Now()
		writer := &statusWriter{ResponseWriter: c.Writer, status: 200}
		c.Writer = writer
		c.Next()
		log.Printf("[http] method=%s path=%s status=%d duration=%s client=%s", c.Request.Method, c.Request.URL.RequestURI(), writer.status, time.Since(started).Round(time.Millisecond), c.ClientIP())
	}
}
