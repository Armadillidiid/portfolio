import { promises as fs } from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer, Connect } from "vite-plus";
import { SITE } from "./src/lib/site";

type FeedPost = {
  title: string;
  url: string;
  date: string;
  description: string;
  slug: string;
};

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const yaml = match[1];
  const body = match[2];
  const data: Record<string, unknown> = {};
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value: unknown = m[2].trim();
    if (typeof value === "string") {
      if ((value as string).startsWith("[") && (value as string).endsWith("]")) {
        value = (value as string)
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      } else if ((value as string) === "true") {
        value = true;
      } else if ((value as string) === "false") {
        value = false;
      } else if (/^["'].*["']$/.test(value as string)) {
        value = (value as string).slice(1, -1);
      }
    }
    data[key] = value;
  }
  return { data, body };
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  return [];
}

function asBoolean(v: unknown): boolean {
  return v === true;
}

async function readPostFile(filePath: string, slug: string): Promise<FeedPost | null> {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  if (asBoolean(data.draft)) return null;
  const title = asString(data.title) || slug;
  const date = asString(data.date);
  if (!date) return null;
  const description = asString(data.description) || body.replace(/\s+/g, " ").trim().slice(0, 280);
  return {
    title,
    url: `/blog/${slug}`,
    date,
    description,
    slug,
  };
}

async function collectPosts(root: string): Promise<FeedPost[]> {
  const blogDir = path.join(root, "pages", "blog");
  let entries: import("node:fs").Dirent[];
  try {
    entries = await fs.readdir(blogDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const posts: FeedPost[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    if (slug === "tags") continue;
    const mdPath = path.join(blogDir, slug, "index.md");
    try {
      const post = await readPostFile(mdPath, slug);
      if (post) posts.push(post);
    } catch {
      // no index.md in this dir
    }
  }
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(base: string, p: string): string {
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const b = base.replace(/\/$/, "");
  return `${b}${p.startsWith("/") ? p : `/${p}`}`;
}

function readSiteUrl(): string {
  return process.env.VITE_SITE_URL ?? SITE.url;
}

function buildRss(posts: FeedPost[], siteUrl: string): string {
  const recent = posts.slice(0, 20);
  const buildDate = new Date().toUTCString();
  const items = recent
    .map((post) => {
      const link = absoluteUrl(siteUrl, post.url);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(new Date(post.date).toUTCString())}</pubDate>
      <description>${escapeXml(post.description.slice(0, 280))}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SITE.description)}</description>
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
  let root = process.cwd();
  return {
    name: "feeds",
    configResolved(config) {
      outDir = config.build.outDir ?? "dist";
      root = config.root ?? process.cwd();
    },
    async configureServer(server: ViteDevServer) {
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        try {
          if (!req.url) return next();
          const posts = await collectPosts(root);
          if (req.url.startsWith("/rss.xml")) {
            res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
            res.end(buildRss(posts, readSiteUrl()));
            return;
          }
          if (req.url.startsWith("/sitemap.xml")) {
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
      const posts = await collectPosts(root);
      const target = path.resolve(root, outDir);
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
