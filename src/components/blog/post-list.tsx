import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
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
    <TerminalWindow filename="blog.md">
      <TerminalLine command="ls -la content/posts" />
      <p className="text-muted-foreground text-sm">
        {posts.length} {posts.length === 1 ? "post" : "posts"} · sorted by date desc
      </p>

      <ul className="divide-y divide-border">
        {posts.map((post) => (
          <li key={post.slug} className="py-4 first:pt-0 last:pb-0">
            <Link
              to={post.url}
              className="group block transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <div className="flex items-baseline gap-4 flex-wrap">
                <time dateTime={post.date} className="text-muted-foreground text-sm shrink-0">
                  {format(new Date(post.date), "yyyy-MM-dd")}
                </time>
                <h2 className="text-primary font-bold group-hover:underline">{post.title}</h2>
              </div>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <TerminalPrompt className="pt-2" />
    </TerminalWindow>
  );
}
