import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PostDetail } from "@/components/blog/post-detail";
import { TerminalLine } from "@/components/terminal/terminal-line";
import { TerminalPrompt } from "@/components/terminal/terminal-prompt";
import { TerminalWindow } from "@/components/terminal/terminal-window";
import { SITE, absoluteUrl } from "@/lib/site";
import { getPostBySlug } from "@/lib/posts";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostRoute,
  notFoundComponent: NotFound,
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    const post = loaderData;
    const description = post ? extractDescription(post.body) : SITE.description;
    const ogImage = post?.cover ? absoluteUrl(post.cover) : SITE.defaultOgImage;
    const url = post ? absoluteUrl(post.url) : SITE.url;
    return {
      meta: [
        { title: `${post?.title ?? "Post"} — ${SITE.name}` },
        { name: "description", content: description },
        { property: "og:title", content: post?.title ?? SITE.name },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:image", content: ogImage },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post?.title ?? SITE.name },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
        ...(post?.date ? [{ property: "article:published_time", content: post.date }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function extractDescription(body: string): string {
  const stripped = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > 160 ? `${stripped.slice(0, 157).trimEnd()}...` : stripped;
}

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
