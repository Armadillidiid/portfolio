#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import matter from "gray-matter";

const SOURCE = resolve(process.argv[2] ?? join(import.meta.dirname, "..", "..", "blog-posts"));
const DEST = resolve(process.argv[3] ?? join(import.meta.dirname, "..", "content", "posts"));

function parseTags(tags) {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
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
    } else if (entry.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

function normalizePost(filepath) {
  const raw = readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);

  const filenameStem = basename(filepath, extname(filepath));
  const title = typeof data.title === "string" ? data.title : filenameStem;
  const slug = typeof data.slug === "string" ? data.slug : filenameStem;
  const date = deriveDate(data.date) ?? deriveDate(data.datePublished) ?? statSync(filepath).mtime;
  const tags = parseTags(data.tags);
  const cover = typeof data.cover === "string" ? data.cover : undefined;

  const future = date.getTime() > Date.now();
  const frontmatter = {
    title,
    date: date.toISOString(),
    tags,
    ...(cover ? { cover } : {}),
  };

  return { slug, frontmatter, body: content, warnings: future ? ["future date"] : [] };
}

function main() {
  if (!existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    process.exit(1);
  }
  mkdirSync(DEST, { recursive: true });

  const files = findMdFiles(SOURCE);
  let wrote = 0;
  let skipped = 0;
  const warnings = [];

  for (const file of files) {
    const { slug, frontmatter, body, warnings: fileWarnings } = normalizePost(file);
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

main();
