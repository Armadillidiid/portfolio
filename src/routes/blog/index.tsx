import { createFileRoute } from "@tanstack/react-router";
import { PostList } from "@/components/blog/post-list";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageSeo({
      title: "Emmanuel's Blog",
      url: "/blog",
    }),
  component: PostList,
});
