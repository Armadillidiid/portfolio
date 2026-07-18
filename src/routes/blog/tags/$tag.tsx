import { createFileRoute, notFound } from "@tanstack/react-router";
import { PostList } from "@/components/blog/post-list";
import { SITE } from "@/lib/site";
import { getAllTags } from "@/lib/posts";
import { pageSeo } from "@/lib/seo";

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
    return pageSeo({
      title: `#${tag} — Blog`,
      description: `Posts tagged #${tag} by ${SITE.author.name}.`,
      url: `/blog/tags/${tag}/`,
    });
  },
});

function TaggedPostsRoute() {
  const { tag } = Route.useLoaderData();
  return <PostList tag={tag} />;
}
