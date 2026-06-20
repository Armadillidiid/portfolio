import pages from "@void/md/pages";

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover: string | null;
  description: string | null;
  url: string;
};

function toSlug(path: string): string {
  const trimmed = path.replace(/^\/blog\//, "").replace(/\/$/, "");
  return trimmed;
}

function isPostPath(path: string): boolean {
  if (!path.startsWith("/blog/")) return false;
  const tail = path.slice("/blog/".length).replace(/\/$/, "");
  if (!tail) return false;
  if (tail === "tags") return false;
  if (tail.startsWith("tags/")) return false;
  return true;
}

function toSummary(p: (typeof pages)[number]): PostSummary | null {
  if (!isPostPath(p.path)) return null;
  const slug = toSlug(p.path);
  const frontmatter = p.frontmatter as {
    date?: string;
    tags?: string[];
    cover?: string | null;
    description?: string;
    draft?: boolean;
  };
  if (frontmatter.draft) return null;
  return {
    slug,
    title: p.title,
    date: frontmatter.date ?? "",
    tags: frontmatter.tags ?? [],
    cover: frontmatter.cover ?? null,
    description: frontmatter.description ?? null,
    url: p.path,
  };
}

export function getAllPosts(): PostSummary[] {
  return pages
    .map(toSummary)
    .filter((p): p is PostSummary => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): PostSummary | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getPostsByTag(tag: string): PostSummary[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export type TagCount = { tag: string; count: number };

export function getAllTags(): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([tag, count]) => ({ tag, count })).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
}
