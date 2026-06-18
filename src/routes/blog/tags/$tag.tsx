import { createFileRoute, notFound } from "@tanstack/react-router";
import { PostList } from "@/components/blog/post-list";
import { SITE, absoluteUrl } from "@/lib/site";
import { getAllTags } from "@/lib/posts";

export const Route = createFileRoute("/blog/tags/$tag")({
  component: TaggedPostsRoute,
  loader: ({ params }) => {
    const tags = getAllTags();
    const exists = tags.some((t) => t.tag === params.tag);
    if (!exists) throw notFound();
    return { tag: params.tag };
  },
  head: ({ loaderData, params }) => {
    const tag = loaderData?.tag ?? params.tag;
    const url = absoluteUrl(`/blog/tags/${tag}`);
    return {
      meta: [
        { title: `#${tag} — Blog — ${SITE.name}` },
        { name: "description", content: `Posts tagged #${tag} by ${SITE.author.name}.` },
        { property: "og:title", content: `#${tag} — ${SITE.name}` },
        { property: "og:description", content: `Posts tagged #${tag}.` },
        { property: "og:image", content: SITE.defaultOgImage },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function TaggedPostsRoute() {
  const { tag } = Route.useLoaderData();
  return <PostList tag={tag} />;
}
