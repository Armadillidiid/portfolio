import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PostDetail } from "@/components/blog/post-detail";
import { TerminalLine } from "@/components/terminal/terminal-line";
import { TerminalPrompt } from "@/components/terminal/terminal-prompt";
import { TerminalWindow } from "@/components/terminal/terminal-window";
import { getPostBySlug } from "@/lib/posts";
import { postSeo } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostRoute,
  notFoundComponent: NotFound,
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => postSeo(loaderData),
});

function BlogPostRoute() {
  const post = Route.useLoaderData();
  return <PostDetail post={post} />;
}

function NotFound() {
  const { slug } = Route.useParams();
  return (
    <TerminalWindow filename={`${slug ?? "404"}.md`}>
      <TerminalLine command={`cat content/posts/${slug ?? "404"}.md`} />
      <p className="text-foreground">No such file or directory.</p>
      <p className="text-muted-foreground text-sm">
        Back to{" "}
        <Link to="/blog" className="text-primary underline">
          /blog
        </Link>
        .
      </p>
      <TerminalPrompt className="pt-2" />
    </TerminalWindow>
  );
}
