import assert from "node:assert/strict";
const base = process.env.WATCHDESK_API || "http://127.0.0.1:8080/api",
  ids = [];
async function call(
  path,
  method = "GET",
  body,
  origin = "http://127.0.0.1:4174",
) {
  const response = await fetch(base + path, {
    method,
    headers: {
      Origin: origin,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { response, data };
}
try {
  const health = await call("/health");
  assert.equal(health.response.status, 200);
  assert.equal(health.data.quotes, "mock");
  assert.equal(
    health.response.headers.get("access-control-allow-origin"),
    "http://127.0.0.1:4174",
  );
  const metadata = await call("/markets");
  assert.equal(metadata.data.items.length, 3);
  const suffix = String(Date.now() % 1000).padStart(3, "0");
  const bodies = [
    {
      market: "CN",
      symbol: "990" + suffix,
      name: "VERIFY percent %",
      notes: "API check",
    },
    { market: "HK", symbol: "09" + suffix, name: "VERIFY HK", notes: "" },
    { market: "US", symbol: "SOL" + suffix, name: "VERIFY US", notes: "" },
  ];
  for (const body of bodies) {
    const created = await call("/watchlist", "POST", body);
    assert.equal(created.response.status, 201, JSON.stringify(created.data));
    assert.equal(created.data.quote.source, "mock");
    assert.equal(created.data.quote.series.length, 32);
    ids.push(created.data.id);
  }
  const duplicate = await call("/watchlist", "POST", bodies[0]);
  assert.equal(duplicate.response.status, 409);
  assert.equal(duplicate.data.error.code, "duplicate");
  const invalid = await call("/watchlist", "POST", {
    market: "US",
    symbol: "!BAD",
    name: "invalid",
    notes: "",
  });
  assert.equal(invalid.response.status, 400);
  const unknown = await call("/watchlist", "POST", {
    ...bodies[0],
    ignored: true,
  });
  assert.equal(unknown.response.status, 400);
  const market = await call(
    "/watchlist?market=HK&q=" + encodeURIComponent("VERIFY"),
  );
  assert(market.data.items.every((i) => i.market === "HK"));
  assert(market.data.items.some((i) => i.id === ids[1]));
  const literal = await call("/watchlist?q=" + encodeURIComponent("%"));
  assert(literal.data.items.some((i) => i.id === ids[0]));
  assert(!literal.data.items.some((i) => i.id === ids[1]));
  const updated = await call("/watchlist/" + ids[0], "PUT", {
    ...bodies[0],
    name: "VERIFY renamed",
    notes: "updated",
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.data.name, "VERIFY renamed");
  assert.equal(updated.data.notes, "updated");
  const found = await call("/watchlist?q=VERIFY%20renamed");
  assert(found.data.items.some((i) => i.id === ids[0]));
  const denied = await call(
    "/markets",
    "GET",
    undefined,
    "https://not-allowed.example",
  );
  assert.equal(denied.response.status, 403);
  const preflight = await fetch(base + "/watchlist", {
    method: "OPTIONS",
    headers: {
      Origin: "http://127.0.0.1:4174",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "Content-Type",
    },
  });
  assert.equal(preflight.status, 204);
  const missing = await call("/watchlist/4294967295", "DELETE");
  assert.equal(missing.response.status, 404);
  console.log(
    "API checks passed: health, markets, PostgreSQL CRUD, duplicate, validation, literal search, CORS, preflight, missing ID.",
  );
} finally {
  for (const id of ids) {
    const result = await call("/watchlist/" + id, "DELETE");
    assert.equal(result.response.status, 204);
  }
}
