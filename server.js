import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite-plus";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function start() {
  const vite = await createServer({
    appType: "custom",
    server: { port: 5173 },
  });

  const keystaticHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Keystatic</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/scripts/keystatic-entry.tsx"></script>
  </body>
</html>`;

  const { makeGenericAPIRouteHandler } = await import("@keystatic/core/api/generic");
  const cfgMod = await vite.ssrLoadModule("/keystatic.config");
  const keystaticConfig = cfgMod.default ?? cfgMod;
  const apiHandler = makeGenericAPIRouteHandler({ config: keystaticConfig });

  vite.middlewares.use(async (req, res, next) => {
    const url = req.url || "/";

    // Keystatic API routes
    if (url.startsWith("/api/keystatic/")) {
      try {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        await new Promise((resolve) => req.on("end", resolve));
        const ksReq = {
          headers: { get: (name) => req.headers[name.toLowerCase()] ?? null },
          method: req.method,
          url: req.url,
          json: async () => JSON.parse(body || "null"),
        };
        const { status, headers, body: responseBody } = await apiHandler(ksReq);
        if (headers) {
          const h = headers;
          if (Array.isArray(h)) {
            for (const [key, value] of h) res.setHeader(key, value);
          } else if (typeof h.entries === "function") {
            for (const [key, value] of h.entries()) res.setHeader(key, value);
          }
        }
        res.statusCode = status ?? 200;
        res.end(responseBody ?? "");
      } catch (err) {
        console.error("[keystatic-api]", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
      return;
    }

    // Keystatic admin UI
    if (url === "/keystatic" || url.startsWith("/keystatic/")) {
      try {
        const html = await vite.transformIndexHtml(url, keystaticHtml);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(html);
      } catch (err) {
        console.error("[keystatic-ui]", err);
        next();
      }
      return;
    }

    // SSR page requests
    const isPageRequest =
      req.headers.accept?.includes("text/html") || !path.extname(url) || url === "/";

    if (!isPageRequest) return next();

    try {
      let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const { html, head, dehydrate, statusCode } = await render(url);

      const finalHtml = template
        .replace("</head>", () => `  ${head}\n  </head>`)
        .replace("<!--app-outlet-->", html)
        .replace("<!--dehydrate-outlet-->", dehydrate);

      res.statusCode = statusCode;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(finalHtml);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(`<pre>SSR Error: ${(e && e.message) || e}</pre>`);
    }
  });

  await vite.listen();
  vite.printUrls();
}

void start();
