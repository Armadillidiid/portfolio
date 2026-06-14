import { createFileRoute } from "@tanstack/react-router";
import { PostList } from "@/components/blog/post-list";

export const Route = createFileRoute("/blog")({
  component: BlogRoute,
});

function BlogRoute() {
  return <PostList />;
}
