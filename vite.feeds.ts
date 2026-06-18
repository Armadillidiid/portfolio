import { promises as fs } from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer, Connect } from "vite-plus";

type FeedPost = {
  title: string;
  url: string;
  date: string;
  body: string;
};

async function readPosts(): Promise<FeedPost[]> {
  const file = path.resolve(process.cwd(), ".velite/posts.json");
  const raw = await fs.readFile(file, "utf8");
  const all = JSON.parse(raw) as Array<FeedPost & { draft: boolean }>;
  return all
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ title, url, date, body }) => ({ title, url, date, body }));
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripMarkdown(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(base: string, path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const b = base.replace(/\/$/, "");
  return `${b}${path.startsWith("/") ? path : `/${path}`}`;
}

function readSiteUrl(): string {
  return process.env.VITE_SITE_URL ?? "http://localhost:5173";
}

function buildRss(posts: FeedPost[], siteUrl: string): string {
  const recent = posts.slice(0, 20);
  const buildDate = new Date().toUTCString();
  const items = recent
    .map((post) => {
      const description = stripMarkdown(post.body).slice(0, 280);
      const link = absoluteUrl(siteUrl, post.url);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(new Date(post.date).toUTCString())}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml("Emmanuel Isenah")}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml("Personal site — TypeScript, React, and the web.")}</description>
    <language>en</language>
    <lastBuildDate>${escapeXml(buildDate)}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(absoluteUrl(siteUrl, "/rss.xml"))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

function buildSitemap(posts: FeedPost[], siteUrl: string): string {
  const entries = [
    { loc: siteUrl, lastmod: new Date().toISOString() },
    { loc: absoluteUrl(siteUrl, "/blog"), lastmod: new Date().toISOString() },
    ...posts.map((post) => ({
      loc: absoluteUrl(siteUrl, post.url),
      lastmod: new Date(post.date).toISOString(),
    })),
  ];

  const body = entries
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function feedsPlugin(): Plugin {
  let outDir = "dist";
  return {
    name: "feeds",
    configResolved(config) {
      outDir = config.build.outDir ?? "dist";
    },
    async configureServer(server: ViteDevServer) {
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        try {
          if (!req.url) return next();
          if (req.url.startsWith("/rss.xml")) {
            const posts = await readPosts();
            res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
            res.end(buildRss(posts, readSiteUrl()));
            return;
          }
          if (req.url.startsWith("/sitemap.xml")) {
            const posts = await readPosts();
            res.setHeader("Content-Type", "application/xml; charset=utf-8");
            res.end(buildSitemap(posts, readSiteUrl()));
            return;
          }
        } catch (err) {
          server.config.logger.error(`[feeds] ${(err as Error).message}`);
        }
        next();
      };
      server.middlewares.use(handler);
    },
    async closeBundle() {
      const posts = await readPosts();
      const target = path.resolve(process.cwd(), outDir);
      await fs.mkdir(target, { recursive: true });
      await fs.writeFile(path.join(target, "rss.xml"), buildRss(posts, readSiteUrl()), "utf8");
      await fs.writeFile(
        path.join(target, "sitemap.xml"),
        buildSitemap(posts, readSiteUrl()),
        "utf8",
      );
    },
  };
}
