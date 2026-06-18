import { Fragment } from "react";
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
        <p className="text-secondary text-xs font-bold uppercase tracking-widest flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{format(new Date(post.date), "yyyy-MM-dd")}</span>
          {post.tags.map((tag) => (
            <Fragment key={tag}>
              <span aria-hidden="true">·</span>
              <Link
                to="/blog/tags/$tag"
                params={{ tag }}
                className="hover:text-primary transition-colors"
              >
                {tag}
              </Link>
            </Fragment>
          ))}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-none">{post.title}</h1>
      </header>

      {post.cover && (
        <img
          src={post.cover.src}
          alt={post.title}
          loading="lazy"
          decoding="async"
          width={post.cover.width}
          height={post.cover.height}
          className="w-full border border-border"
        />
      )}

      <MarkdownContent body={post.body} />
    </article>
  );
}
