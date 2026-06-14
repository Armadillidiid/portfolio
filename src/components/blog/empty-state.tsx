import { TerminalLine } from "@/components/terminal/terminal-line";
import { TerminalPrompt } from "@/components/terminal/terminal-prompt";
import { TerminalWindow } from "@/components/terminal/terminal-window";

export function BlogEmptyState() {
  return (
    <TerminalWindow filename="blog.md">
      <TerminalLine command="ls content/posts" />
      <div className="space-y-2">
        <p className="text-foreground">No posts found.</p>
        <p className="text-muted-foreground text-sm">
          Run <code className="text-secondary">pnpm dlx velite new</code> in a{" "}
          <code className="text-secondary">content/posts/</code> directory to scaffold your first
          post.
        </p>
      </div>
      <TerminalPrompt className="pt-2" />
    </TerminalWindow>
  );
}
