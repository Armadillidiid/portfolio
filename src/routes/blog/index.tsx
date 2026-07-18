import { createFileRoute } from "@tanstack/react-router";
import { PostList } from "@/components/blog/post-list";
import { SITE } from "@/lib/site";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageSeo({
      title: "Blog",
      description: `Posts on TypeScript, React, and the web by ${SITE.author.name}.`,
      url: "/blog",
    }),
  component: PostList,
});
