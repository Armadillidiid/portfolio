import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { MarkdownContent } from "@/components/blog/markdown-content";
import type { Post } from "@velite";

type PostDetailProps = {
  post: Post;
};

export function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        cd ..
      </Link>

      <header className="space-y-4">
        <p className="text-secondary text-xs font-bold uppercase tracking-widest">
          {format(new Date(post.date), "yyyy-MM-dd")}
          {post.tags.length > 0 ? ` · ${post.tags.join(" · ")}` : ""}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-none">{post.title}</h1>
      </header>

      {post.cover && (
        <img
          src={post.cover}
          alt={post.title}
          loading="lazy"
          decoding="async"
          width={1600}
          height={840}
          className="w-full border border-border"
        />
      )}

      <MarkdownContent body={post.body} />
    </article>
  );
}
