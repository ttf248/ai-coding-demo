package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestMarketSymbolValidation(t *testing.T) {
	tests := []struct {
		name   string
		market string
		symbol string
		valid  bool
	}{
		{name: "mainland six digit", market: "CN", symbol: "600519", valid: true},
		{name: "mainland rejects letters", market: "CN", symbol: "60051A", valid: false},
		{name: "hong kong four digit", market: "HK", symbol: "0700", valid: true},
		{name: "hong kong five digit", market: "HK", symbol: "00700", valid: true},
		{name: "hong kong rejects short code", market: "HK", symbol: "700", valid: false},
		{name: "US ticker", market: "US", symbol: "NVDA", valid: true},
		{name: "US dotted ticker", market: "US", symbol: "BRK.B", valid: true},
		{name: "US rejects path characters", market: "US", symbol: "ABC/DEF", valid: false},
		{name: "unsupported market", market: "JP", symbol: "7203", valid: false},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := validSymbol(test.market, test.symbol); got != test.valid {
				t.Errorf("validSymbol(%q, %q) = %v; want %v", test.market, test.symbol, got, test.valid)
			}
		})
	}
}

func TestContractInputNormalizationAndExchange(t *testing.T) {
	contract, err := contractFromInput(ContractInput{
		Market: " cn ",
		Symbol: " 600519 ",
		Name:   "  茅台  ",
		Sector: "  消费品  ",
	})
	if err != nil {
		t.Fatalf("contractFromInput returned an error: %v", err)
	}
	if contract.Market != "CN" || contract.Symbol != "600519" || contract.Name != "茅台" || contract.Sector != "消费品" {
		t.Fatalf("input was not normalized: %+v", contract)
	}
	if contract.Exchange != "SSE" {
		t.Errorf("exchange = %q; want SSE", contract.Exchange)
	}
	if _, err := contractFromInput(ContractInput{Market: "CN", Symbol: "12", Name: "invalid"}); err == nil {
		t.Error("expected invalid contract code to be rejected")
	}
}

func TestDemoQuoteIsStableAndClearlyPopulated(t *testing.T) {
	first := demoQuote("US", "NVDA")
	second := demoQuote("US", "NVDA")
	if first.Price != second.Price || first.Change != second.Change || first.ChangePercent != second.ChangePercent || first.Volume != second.Volume {
		t.Fatal("demo quote values should be stable for a market and symbol")
	}
	if first.Price <= 0 || first.Volume <= 0 || first.High <= first.Low || first.UpdatedAt.IsZero() {
		t.Fatalf("demo quote is missing basic market fields: %+v", first)
	}
}

func TestCORSAllowedOriginAndPreflight(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(corsMiddleware([]string{"http://localhost:5173"}))
	router.GET("/api/ping", func(c *gin.Context) { c.Status(http.StatusNoContent) })

	request := httptest.NewRequest(http.MethodOptions, "/api/ping", nil)
	request.Header.Set("Origin", "http://localhost:5173")
	request.Header.Set("Access-Control-Request-Method", "POST")
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)

	if response.Code != http.StatusNoContent {
		t.Fatalf("preflight status = %d; want %d", response.Code, http.StatusNoContent)
	}
	if got := response.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Errorf("allow-origin = %q; want allowed origin", got)
	}
	if got := response.Header().Get("Access-Control-Allow-Methods"); got == "" {
		t.Error("preflight response is missing allowed methods")
	}
}

func TestCORSRejectsUnknownOrigin(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(corsMiddleware([]string{"http://localhost:5173"}))
	router.GET("/api/ping", func(c *gin.Context) { c.Status(http.StatusNoContent) })

	request := httptest.NewRequest(http.MethodGet, "/api/ping", nil)
	request.Header.Set("Origin", "https://example.test")
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)

	if got := response.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Errorf("unexpected allow-origin header for unknown origin: %q", got)
	}
}
