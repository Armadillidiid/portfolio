import { createFileRoute } from "@tanstack/react-router";
import { PostList } from "@/components/blog/post-list";
import { SITE, absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: `Blog — ${SITE.name}` },
      {
        name: "description",
        content: `Posts on TypeScript, React, and the web by ${SITE.author.name}.`,
      },
      { property: "og:title", content: `Blog — ${SITE.name}` },
      { property: "og:description", content: `Posts on TypeScript, React, and the web.` },
      { property: "og:image", content: SITE.defaultOgImage },
      { property: "og:url", content: absoluteUrl("/blog") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/blog") }],
  }),
  component: PostList,
});
