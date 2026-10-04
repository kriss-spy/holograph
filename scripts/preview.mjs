// Loopback-only preview of the production output. Public hosting uses Pages or Vercel.
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
const port = Number(process.env.PORT || 8766);
const base = process.env.BASE_PATH || "/";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    try {
      if (!["GET", "HEAD"].includes(req.method)) {
        res.writeHead(405);
        return res.end();
      }
      const url = new URL(req.url, "http://localhost");
      if (!url.pathname.startsWith(base)) throw new Error("Not found");
      const filename = path.resolve(
        root,
        decodeURIComponent(url.pathname.slice(base.length)) || "index.html",
      );
      if (!filename.startsWith(root + path.sep)) throw new Error("Not found");
      const bytes = await readFile(filename);
      res.writeHead(200, {
        "Content-Type":
          types[path.extname(filename)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(req.method === "HEAD" ? undefined : bytes);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Production preview: http://127.0.0.1:${port}${base}`),
  );
