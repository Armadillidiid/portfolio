import { createFileRoute, notFound } from "@tanstack/react-router";
import { PostList } from "@/components/blog/post-list";
import { getAllTags } from "@/lib/posts";

export const Route = createFileRoute("/blog/tags/$tag")({
  component: TaggedPostsRoute,
  loader: ({ params }) => {
    const tags = getAllTags();
    const exists = tags.some((t) => t.tag === params.tag);
    if (!exists) throw notFound();
    return { tag: params.tag };
  },
});

function TaggedPostsRoute() {
  const { tag } = Route.useLoaderData();
  return <PostList tag={tag} />;
}
