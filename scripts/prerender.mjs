import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const clientDir = path.resolve(root, "dist/client");
const serverEntryPath = path.resolve(root, "dist/server/entry-server.js");

const template = await fs.readFile(path.resolve(clientDir, "index.html"), "utf-8");

const { render } = await import(serverEntryPath);

async function getRoutes() {
  const staticRoutes = ["/", "/blog", "/blog/tags"];

  const velitePosts = JSON.parse(
    await fs.readFile(path.resolve(root, ".velite/posts.json"), "utf-8"),
  );
  const published = velitePosts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allTags = new Set();
  for (const post of published) {
    for (const tag of post.tags) {
      allTags.add(tag);
    }
  }

  const dynamicRoutes = [
    ...published.map((p) => `/blog/${p.slug}`),
    ...[...allTags].map((tag) => `/blog/tags/${tag}`),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}

const routes = await getRoutes();

for (const url of routes) {
  console.log(`Prerendering: ${url}`);
  try {
    const { html, dehydrate, statusCode } = await render(url);

    const pageHtml = template
      .replace("<!--app-outlet-->", html)
      .replace("<!--dehydrate-outlet-->", dehydrate);

    let outDir;
    if (url === "/") {
      outDir = clientDir;
    } else {
      const relative = url.replace(/^\//, "");
      outDir = path.resolve(clientDir, relative);
    }

    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "index.html"), pageHtml, "utf-8");

    if (statusCode === 404) {
      console.warn(`  -> 404 for ${url}`);
    }
  } catch (err) {
    console.error(`  x Failed to prerender ${url}:`, err.message);
  }
}

console.log(`\nPrerendered ${routes.length} routes.`);
