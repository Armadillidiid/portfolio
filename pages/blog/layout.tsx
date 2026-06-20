import { useRouter, Link } from "@void/react";
import { useFrontmatter } from "@void/md";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import "@void/md/theme-content.css";

function isPostDetailPath(path: string): boolean {
  if (!path.startsWith("/blog/")) return false;
  const tail = path.slice("/blog/".length).replace(/\/$/, "");
  if (!tail) return false;
  if (tail === "tags") return false;
  if (tail.startsWith("tags/")) return false;
  return true;
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const frontmatter = useFrontmatter();

  if (!isPostDetailPath(router.path) || Object.keys(frontmatter).length === 0) {
    return <>{children}</>;
  }

  const title = (frontmatter.title as string | undefined) ?? "";
  const date = (frontmatter.date as string | undefined) ?? "";
  const tags = ((frontmatter.tags as string[] | undefined) ?? []).filter(Boolean);
  const cover = (frontmatter.cover as string | undefined) ?? null;
  const slug = router.path.slice("/blog/".length).replace(/\/$/, "");
  const coverSrc = cover
    ? cover.startsWith("http")
      ? cover
      : `/blog/${slug}/${cover.replace(/^\.\//, "")}`
    : null;

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        cd ..
      </Link>

      <header className="space-y-4">
        <p className="text-secondary text-xs font-bold uppercase tracking-widest flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{date ? format(new Date(date), "yyyy-MM-dd") : ""}</span>
          {tags.map((tag) => (
            <span key={tag} className="contents">
              <span aria-hidden="true">·</span>
              <Link href={`/blog/tags/${tag}`} className="hover:text-primary transition-colors">
                {tag}
              </Link>
            </span>
          ))}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-none">{title}</h1>
      </header>

      {coverSrc ? (
        <img
          src={coverSrc}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full border border-border"
        />
      ) : null}

      <div className="void-md">{children}</div>
    </article>
  );
}
