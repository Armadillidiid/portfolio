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

  vite.middlewares.use(async (req, res, next) => {
    const url = req.url || "/";

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
