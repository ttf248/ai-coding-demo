// Package middleware 提供跨域、请求日志与 panic 恢复。
package middleware

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"net/http"
	"runtime/debug"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// RequestIDHeader 是贯穿前后端的请求标识。
const RequestIDHeader = "X-Request-Id"

// RequestID 为每个请求生成或透传一个 ID，便于把前后端日志对上。
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetHeader(RequestIDHeader)
		if id == "" {
			buf := make([]byte, 8)
			if _, err := rand.Read(buf); err != nil {
				id = fmt.Sprintf("%d", time.Now().UnixNano())
			} else {
				id = hex.EncodeToString(buf)
			}
		}
		c.Set("requestId", id)
		c.Writer.Header().Set(RequestIDHeader, id)
		c.Next()
	}
}

// bodyWriter 记录响应状态码与字节数，不影响原有写出。
type bodyWriter struct {
	gin.ResponseWriter
	status int
	bytes  int
}

func (w *bodyWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func (w *bodyWriter) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	n, err := w.ResponseWriter.Write(b)
	w.bytes += n
	return n, err
}

// Logger 打印请求与应答日志：方法、路径、状态、耗时、来源 IP、请求体摘要。
func Logger(enabled bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !enabled {
			c.Next()
			return
		}
		start := time.Now()
		lw := &bodyWriter{ResponseWriter: c.Writer}
		c.Writer = lw

		var body []byte
		if c.Request.Body != nil && c.Request.Method != http.MethodGet {
			body, _ = readAndRestore(c)
		}
		reqID, _ := c.Get("requestId")

		log.Printf("[req]  id=%v %s %s from=%s query=%q body=%s",
			reqID, c.Request.Method, c.Request.URL.Path, c.ClientIP(), c.Request.URL.RawQuery, summarize(body))

		c.Next()

		lw.status = c.Writer.Status()
		c.Writer = lw.ResponseWriter
		log.Printf("[resp] id=%v status=%d bytes=%d cost=%s %s %s",
			reqID, lw.status, lw.bytes, time.Since(start).Round(time.Millisecond),
			c.Request.Method, c.Request.URL.Path)
	}
}

// readAndRestore 读取请求体并放回，保证 handler 仍能正常解析。
func readAndRestore(c *gin.Context) ([]byte, error) {
	buf := make([]byte, 0, 512)
	tmp := make([]byte, 512)
	for {
		n, err := c.Request.Body.Read(tmp)
		if n > 0 {
			buf = append(buf, tmp[:n]...)
			if len(buf) > 2048 {
				break
			}
		}
		if err != nil {
			break
		}
	}
	_ = c.Request.Body.Close()
	c.Request.Body = newRepeatableBody(buf)
	return buf, nil
}

type repeatableBody struct {
	data []byte
	pos  int
}

func newRepeatableBody(data []byte) *repeatableBody { return &repeatableBody{data: data} }

func (b *repeatableBody) Read(p []byte) (int, error) {
	if b.pos >= len(b.data) {
		return 0, io.EOF
	}
	n := copy(p, b.data[b.pos:])
	b.pos += n
	return n, nil
}

func (b *repeatableBody) Close() error { return nil }

// summarize 截断并清洗请求体，避免日志过长或泄露敏感字段。
func summarize(body []byte) string {
	s := strings.TrimSpace(string(body))
	if s == "" {
		return "-"
	}
	s = strings.ReplaceAll(s, "\n", " ")
	if len(s) > 300 {
		s = s[:300] + "…"
	}
	return s
}

// CORS 处理跨域：白名单来源、方法、请求头，并支持预检。
func CORS(origins []string) gin.HandlerFunc {
	allow := make(map[string]bool, len(origins))
	for _, o := range origins {
		allow[strings.TrimRight(o, "/")] = true
	}
	allowAll := len(allow) == 0
	return func(c *gin.Context) {
		origin := strings.TrimRight(c.GetHeader("Origin"), "/")
		if origin != "" && (allowAll || allow[origin]) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
			c.Writer.Header().Set("Access-Control-Allow-Headers",
				"Content-Type, Authorization, X-User-Key, "+RequestIDHeader)
			c.Writer.Header().Set("Access-Control-Expose-Headers", RequestIDHeader)
			c.Writer.Header().Set("Access-Control-Max-Age", "600")
		}
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

// Recovery 捕获 panic，返回统一错误结构并打印堆栈。
func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("[panic] %v\n%s", r, debug.Stack())
				reqID, _ := c.Get("requestId")
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"requestId": reqID,
					"error": gin.H{
						"code":    "INTERNAL_ERROR",
						"message": "服务内部错误",
					},
				})
			}
		}()
		c.Next()
	}
}
