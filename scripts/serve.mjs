import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";
const port = Number(process.env.PORT || 4173);
const base = process.env.SITE_BASE || "/";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
http
  .createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (!pathname.startsWith(base)) {
        res.writeHead(404).end();
        return;
      }
      let file = path.resolve(ROOT, "." + "/" + pathname.slice(base.length));
      if (
        (file !== ROOT && !file.startsWith(ROOT + path.sep)) ||
        /(?:^|[/\\])(?:\.git|node_modules)(?:[/\\]|$)/.test(file)
      ) {
        res.writeHead(403).end();
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory())
        file = path.join(file, "index.html");
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      if (req.method === "HEAD") res.end();
      else fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(400).end("Bad request");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Archive: http://127.0.0.1:${port}${base}`),
  );
