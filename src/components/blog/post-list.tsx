import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TerminalLine } from "@/components/terminal/terminal-line";
import { TerminalPrompt } from "@/components/terminal/terminal-prompt";
import { TerminalWindow } from "@/components/terminal/terminal-window";
import { getAllPosts } from "@/lib/posts";

export function PostList() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <TerminalWindow filename="blog.md">
        <TerminalLine command="ls content/posts" />
        <p className="text-foreground">No posts found.</p>
        <p className="text-muted-foreground text-sm">
          Run <code className="text-secondary">pnpm dlx velite new</code> in a{" "}
          <code className="text-secondary">content/posts/</code> directory to scaffold your first
          post.
        </p>
        <TerminalPrompt className="pt-2" />
      </TerminalWindow>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">BLOG</p>
        <h1 className="text-3xl md:text-5xl font-bold leading-none mb-6">
          Writing
          <span
            aria-hidden="true"
            className="cursor-blink bg-primary w-2 h-8 md:h-10 inline-block align-middle ml-2"
          />
        </h1>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-primary text-sm hover:underline underline-offset-4 decoration-2"
        >
          <ArrowRight aria-hidden="true" className="size-4" />
          Browse by topic
        </a>
      </header>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.url}
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
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
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
