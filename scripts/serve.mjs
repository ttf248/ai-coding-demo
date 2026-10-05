import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { ROOT } from "./lib.mjs";
import { saveTestingStatus } from "./topic-lifecycle.mjs";
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
const server = http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (!pathname.startsWith(base)) {
        res.writeHead(404).end();
        return;
      }
      const localPath = pathname.slice(base.length);
      const json = (code, value) =>
        res
          .writeHead(code, {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
          })
          .end(JSON.stringify(value));
      const editable = !process.argv.includes("--read-only");
      if (localPath === "__archive/capabilities" && req.method === "GET") {
        json(200, { editable });
        return;
      }
      const topicRequest = localPath.match(
        /^__archive\/topics\/([a-z0-9]+(?:-[a-z0-9]+)*)$/,
      );
      if (topicRequest && req.method === "POST") {
        if (!editable) {
          json(403, { error: "Preview is read-only" });
          return;
        }
        if (
          ![
            `http://127.0.0.1:${server.address().port}`,
            `http://localhost:${server.address().port}`,
          ].includes(req.headers.origin) ||
          req.headers.origin !== `http://${req.headers.host}` ||
          req.headers["content-type"]?.split(";")[0] !== "application/json"
        ) {
          json(403, { error: "Only same-origin JSON requests are allowed" });
          return;
        }
        try {
          req.setEncoding("utf8");
          let body = "";
          for await (const chunk of req) {
            body += chunk;
            if (Buffer.byteLength(body) > 4096) {
              json(413, { error: "Request too large" });
              return;
            }
          }
          const { status, reason } = JSON.parse(body);
          json(200, saveTestingStatus(topicRequest[1], status, reason));
        } catch (error) {
          json(400, { error: error.message });
        }
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
  .listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${server.address().port}${base}`;
    console.log(`Archive: ${url}`);
    if (process.argv.includes("--open") && process.platform === "win32") {
      const browser = spawn(
        "rundll32.exe",
        ["url.dll,FileProtocolHandler", url],
        {
          stdio: "ignore",
          windowsHide: true,
        },
      );
      browser.on("error", () =>
        console.log(`Open this URL in your browser: ${url}`),
      );
      browser.unref();
    }
  });
