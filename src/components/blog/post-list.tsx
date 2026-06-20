import { Link } from "@void/react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TerminalLine } from "@/components/terminal/terminal-line";
import { TerminalPrompt } from "@/components/terminal/terminal-prompt";
import { TerminalWindow } from "@/components/terminal/terminal-window";
import type { PostSummary } from "@/lib/posts";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

type PostListProps = {
  posts: PostSummary[];
  tag?: string;
};

export function PostList({ posts, tag }: PostListProps) {
  if (posts.length === 0) {
    return (
      <TerminalWindow filename="blog.md">
        <TerminalLine command={tag ? `ls content/posts | grep ${tag}` : "ls content/posts"} />
        <p className="text-foreground">No posts found.</p>
        {tag ? (
          <p className="text-muted-foreground text-sm">
            No posts tagged <code className="text-secondary">{tag}</code>.{" "}
            <Link href="/blog/tags" className="text-primary underline">
              Browse all tags
            </Link>
            .
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Add a markdown file under <code className="text-secondary">pages/blog/</code> to publish
            your first post.
          </p>
        )}
        <TerminalPrompt className="pt-2" />
      </TerminalWindow>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">
          {tag ? "TAG" : "BLOG"}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-none mb-6">
          {tag ?? (
            <>
              Writing
              <span
                aria-hidden="true"
                className="cursor-blink bg-primary w-2 h-8 md:h-10 inline-block align-middle ml-2"
              />
            </>
          )}
        </h1>
        {tag ? (
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            cd ..
          </Link>
        ) : (
          <Link
            href="/blog/tags"
            className="inline-flex items-center gap-2 text-primary text-sm hover:underline underline-offset-4 decoration-2"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
            Browse by tag
          </Link>
        )}
      </header>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.url}
              className="group block border border-border bg-card p-6 md:p-8 transition-colors duration-200 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <div className="flex flex-col gap-4">
                <time dateTime={post.date} className="text-muted-foreground text-sm shrink-0">
                  {format(new Date(post.date), "yyyy-MM-dd")}
                </time>
                <h2 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
