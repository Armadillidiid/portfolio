import type { Plugin, ViteDevServer } from "vite-plus";

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

type KeystaticRequest = {
  headers: { get: (name: string) => string | null };
  method: string;
  url: string;
  json: () => Promise<unknown>;
};

type KeystaticResponse = {
  status?: number;
  headers?: unknown;
  body?: unknown;
};

export function keystaticServerPlugin(): Plugin {
  let server: ViteDevServer;
  let apiHandler: ((req: KeystaticRequest) => Promise<KeystaticResponse>) | null = null;

  return {
    name: "keystatic-server",
    configureServer(_server) {
      server = _server;

      _server.middlewares.use(async (req, res, next) => {
        const url = req.url || "/";

        if (url.startsWith("/api/keystatic")) {
          if (!apiHandler) {
            try {
              const { makeGenericAPIRouteHandler } = await import("@keystatic/core/api/generic");
              const cfgMod = await server.ssrLoadModule("/keystatic.config");
              const keystaticConfig = cfgMod.default ?? cfgMod;
              apiHandler = makeGenericAPIRouteHandler({ config: keystaticConfig });
            } catch (err) {
              console.error("[keystatic-server] init error:", err);
              res.statusCode = 500;
              res.end("Keystatic init failed");
              return;
            }
          }

          try {
            let body = "";
            req.on("data", (chunk: string) => (body += chunk));
            await new Promise<void>((resolve) => req.on("end", resolve));
            const fullUrl = `http://${req.headers.host}${url}`;
            const ksReq: KeystaticRequest = {
              headers: {
                get: (name: string) => (req.headers[name.toLowerCase()] as string) ?? null,
              },
              method: req.method ?? "GET",
              url: fullUrl,
              json: async () => JSON.parse(body || "null"),
            };
            const { status, headers, body: responseBody } = await apiHandler(ksReq);
            if (headers) {
              if (Array.isArray(headers)) {
                for (const [key, value] of headers) res.setHeader(key, String(value));
              } else if (typeof headers === "object" && headers !== null) {
                for (const [key, value] of Object.entries(headers))
                  res.setHeader(key, String(value));
              }
            }
            res.statusCode = status ?? 200;
            res.end((responseBody as string) ?? "");
          } catch (err) {
            console.error("[keystatic-api]", err);
            res.statusCode = 500;
            res.end("Internal Server Error");
          }
          return;
        }

        if (url === "/keystatic" || url.startsWith("/keystatic/")) {
          try {
            const html = await server.transformIndexHtml(url, keystaticHtml);
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
          } catch (err) {
            console.error("[keystatic-ui]", err);
            next();
          }
          return;
        }

        next();
      });
    },
  };
}
