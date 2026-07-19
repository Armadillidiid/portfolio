#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import matter from "gray-matter";

const SOURCE = resolve(process.argv[2] ?? join(import.meta.dirname, "..", "..", "blog-posts"));
const DEST = resolve(process.argv[3] ?? join(import.meta.dirname, "..", "content", "posts"));
const COVERS_DIR = join(DEST, "covers");

function parseTags(tags) {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function deriveDate(raw) {
  if (raw) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function findMdFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...findMdFiles(full));
    } else if (entry.endsWith(".md") && !entry.startsWith("draft-")) {
      results.push(full);
    }
  }
  return results;
}

function dedupFiles(files) {
  const groups = {};
  for (const file of files) {
    const raw = readFileSync(file, "utf8");
    const { data } = matter(raw);
    const slug = typeof data.slug === "string" ? data.slug : basename(file, extname(file));
    if (!groups[slug]) groups[slug] = [];
    groups[slug].push({ file, raw });
  }

  const selected = [];
  for (const [, candidates] of Object.entries(groups)) {
    let best = candidates[0];
    let bestScore = candidates[0].raw.includes("\ncuid:") ? 2 : 0;
    for (let i = 1; i < candidates.length; i++) {
      const score = candidates[i].raw.includes("\ncuid:") ? 2 : 0;
      if (score > bestScore) {
        best = candidates[i];
        bestScore = score;
      }
    }
    selected.push(best);
  }
  return selected;
}

async function downloadImage(url) {
  const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${url}`);
  return Buffer.from(await resp.arrayBuffer());
}

const bodyImgRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+align="[^"]*")?\)/g;

async function processBodyImages(body, slug) {
  const contentDir = join(DEST, slug, "content");
  const matches = [];
  let match;
  while ((match = bodyImgRegex.exec(body)) !== null) {
    matches.push(match);
  }

  if (matches.length === 0) return body;

  mkdirSync(contentDir, { recursive: true });

  for (const [fullMatch, alt, url] of matches) {
    try {
      const buf = await downloadImage(url);
      const hash = createHash("md5").update(url).digest("hex").slice(0, 8);
      const ext = extname(new URL(url).pathname) || ".png";
      const filename = `${hash}${ext}`;
      const destPath = join(contentDir, filename);
      writeFileSync(destPath, buf);
      const relPath = `${slug}/content/${filename}`;
      body = body.replace(fullMatch, `![${alt}](${relPath})`);
      console.log(`    Body image: ${filename}`);
    } catch (err) {
      const cleanUrl = url.replace(/\s+align="[^"]*"/g, "");
      body = body.replace(fullMatch, `![${alt}](${cleanUrl})`);
      console.error(`    Warning: failed to download ${url}: ${err.message}`);
    }
  }
  return body;
}

async function processCover(slug, coverUrl) {
  if (!coverUrl || !coverUrl.startsWith("http")) return coverUrl;
  try {
    const buf = await downloadImage(coverUrl);
    const ext = extname(new URL(coverUrl).pathname) || ".png";
    const filename = `${slug}${ext}`;
    mkdirSync(COVERS_DIR, { recursive: true });
    writeFileSync(join(COVERS_DIR, filename), buf);
    const relPath = `covers/${filename}`;
    console.log(`  Cover: ${relPath}`);
    return relPath;
  } catch (err) {
    console.error(`  Warning: failed to download cover ${coverUrl}: ${err.message}`);
    return coverUrl;
  }
}

async function normalizePost(filepath) {
  const raw = readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);

  const filenameStem = basename(filepath, extname(filepath));
  const title = typeof data.title === "string" ? data.title : filenameStem;
  const slug = typeof data.slug === "string" ? data.slug : filenameStem;
  const date = deriveDate(data.date) ?? deriveDate(data.datePublished) ?? statSync(filepath).mtime;
  const tags = parseTags(data.tags);
  const cover = typeof data.cover === "string" ? data.cover : undefined;

  const future = date.getTime() > Date.now();

  let body = content;
  body = await processBodyImages(body, slug);

  let coverRel = cover;
  if (cover) {
    coverRel = await processCover(slug, cover);
  }

  const frontmatter = {
    title,
    date,
    tags,
    ...(coverRel ? { cover: coverRel } : {}),
  };

  return { slug, frontmatter, body, warnings: future ? ["future date"] : [] };
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    process.exit(1);
  }
  mkdirSync(DEST, { recursive: true });

  const files = findMdFiles(SOURCE);
  console.log(`Found ${files.length} file(s) in source.`);

  const deduped = dedupFiles(files);
  console.log(`After dedup: ${deduped.length} post(s).`);

  let wrote = 0;
  let skipped = 0;
  const warnings = [];

  for (const { file } of deduped) {
    const { slug, frontmatter, body, warnings: fileWarnings } = await normalizePost(file);
    const destFile = join(DEST, `${slug}.md`);

    if (existsSync(destFile)) {
      console.log(`Skipped (exists): ${slug}`);
      skipped++;
      continue;
    }

    const yaml = matter.stringify(body, frontmatter);
    writeFileSync(destFile, yaml, "utf8");
    console.log(`Wrote: ${slug}.md${fileWarnings.length ? ` [${fileWarnings.join(", ")}]` : ""}`);
    wrote++;
    if (fileWarnings.length) warnings.push({ slug, fileWarnings });
  }

  console.log(`\nMigrated ${wrote} post(s), skipped ${skipped}. Source: ${SOURCE}`);
  if (warnings.length) {
    console.log(`Warnings:`);
    for (const w of warnings) console.log(`  - ${w.slug}: ${w.fileWarnings.join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
