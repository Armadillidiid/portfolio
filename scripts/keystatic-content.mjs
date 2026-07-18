import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { createHash } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentDir = path.resolve(root, "content/posts");
const veliteDir = path.resolve(root, ".velite");
const staticDir = path.resolve(root, "public/static");

async function dims(filePath) {
  try {
    const { default: sharp } = await import("sharp");
    const meta = await sharp(filePath).metadata();
    return { w: meta.width ?? 1200, h: meta.height ?? 630 };
  } catch {
    return { w: 1200, h: 630 };
  }
}

async function copyCover(coverRel) {
  const coverPath = path.resolve(contentDir, coverRel);
  await fs.access(coverPath);
  const buf = await fs.readFile(coverPath);
  const ext = path.extname(coverRel);
  const hash = createHash("md5").update(buf).digest("hex").slice(0, 6);
  const base = path.basename(coverRel, ext);
  const destName = `${base}-${hash}${ext}`;
  await fs.mkdir(staticDir, { recursive: true });
  await fs.writeFile(path.resolve(staticDir, destName), buf);
  const { w, h } = await dims(coverPath);
  return { src: `/static/${destName}`, width: w, height: h };
}

export async function buildContent() {
  await fs.mkdir(veliteDir, { recursive: true });

  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (ext !== ".mdoc" && ext !== ".md") continue;

    const raw = await fs.readFile(path.join(contentDir, entry.name), "utf-8");
    const { data, content: body } = matter(raw);

    const slug = path.basename(entry.name, ext);
    const title = data.title ?? slug;
    const date = data.date ? String(data.date) : new Date().toISOString();
    const draft = Boolean(data.draft);

    let tags = data.tags ?? [];
    if (typeof tags === "string")
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    let cover = null;
    if (data.cover) {
      try {
        cover = await copyCover(String(data.cover));
      } catch {
        cover = { src: `/${data.cover}`, width: 1200, height: 630 };
      }
    }

    const post = { title, slug, date, draft, tags, body, url: `/blog/${slug}` };
    if (cover) post.cover = cover;
    posts.push(post);
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  await Promise.all([
    fs.writeFile(path.join(veliteDir, "posts.json"), JSON.stringify(posts, null, 2)),
    fs.writeFile(
      path.join(veliteDir, "index.js"),
      `export { default as posts } from './posts.json' with { type: 'json' };\n`,
    ),
    fs.writeFile(
      path.join(veliteDir, "index.d.ts"),
      [
        `export interface Post {`,
        `  title: string;`,
        `  slug: string;`,
        `  date: string;`,
        `  draft: boolean;`,
        `  tags: string[];`,
        `  cover?: { src: string; width: number; height: number };`,
        `  body: string;`,
        `  url: string;`,
        `}`,
        `export declare const posts: Post[];`,
        ``,
      ].join("\n"),
    ),
  ]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildContent();
  console.log("[keystatic-content] Done.");
}
