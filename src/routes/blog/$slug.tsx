import { Link, createFileRoute } from "@tanstack/react-router";
import { TerminalLine } from "@/components/terminal/terminal-line";
import { TerminalPrompt } from "@/components/terminal/terminal-prompt";
import { TerminalWindow } from "@/components/terminal/terminal-window";

export const Route = createFileRoute("/blog/$slug")({
  component: PostStub,
});

function PostStub() {
  const { slug } = Route.useParams();
  return (
    <TerminalWindow filename={`${slug}.md`}>
      <TerminalLine command={`cat content/posts/${slug}.md`} />
      <p className="text-muted-foreground">
        Post detail pages coming soon. See the{" "}
        <Link to="/blog" className="text-primary underline">
          list
        </Link>
        .
      </p>
      <TerminalPrompt className="pt-2" />
    </TerminalWindow>
  );
}
