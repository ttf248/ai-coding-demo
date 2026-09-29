// Package apperr 定义业务错误码，统一接口错误响应结构。
package apperr

import (
	"errors"
	"fmt"
	"net/http"
)

// Error 是带 HTTP 状态码与业务码的错误。
//
// 注意：包级的 ErrXxx 是只读模板，WithField / WithCause 一律返回副本，
// 避免并发请求之间互相污染 Fields。
type Error struct {
	Status  int               `json:"-"`
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Fields  map[string]string `json:"fields,omitempty"`

	cause error
}

func (e *Error) Error() string {
	if e.cause != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.cause)
	}
	return e.Message
}

func (e *Error) Unwrap() error { return e.cause }

func (e *Error) clone() *Error {
	c := *e
	if e.Fields != nil {
		c.Fields = make(map[string]string, len(e.Fields)+1)
		for k, v := range e.Fields {
			c.Fields[k] = v
		}
	}
	return &c
}

// WithField 返回带字段级校验信息的副本。
func (e *Error) WithField(key, msg string) *Error {
	c := e.clone()
	if c.Fields == nil {
		c.Fields = map[string]string{}
	}
	c.Fields[key] = msg
	return c
}

// WithCause 返回挂载了底层错误的副本，用于日志。
func (e *Error) WithCause(err error) *Error {
	c := e.clone()
	c.cause = err
	return c
}

func New(status int, code, message string) *Error {
	return &Error{Status: status, Code: code, Message: message}
}

var (
	ErrNotFound     = New(http.StatusNotFound, "NOT_FOUND", "资源不存在")
	ErrConflict     = New(http.StatusConflict, "CONFLICT", "资源已存在")
	ErrInvalidInput = New(http.StatusBadRequest, "INVALID_INPUT", "请求参数不合法")
	ErrUnavailable  = New(http.StatusServiceUnavailable, "SERVICE_UNAVAILABLE", "服务暂时不可用")
	ErrInternal     = New(http.StatusInternalServerError, "INTERNAL_ERROR", "服务内部错误")
)

// From 把任意 error 归一化成 *Error。
func From(err error) *Error {
	if err == nil {
		return nil
	}
	var e *Error
	if errors.As(err, &e) {
		return e
	}
	return ErrInternal.WithCause(err)
}
