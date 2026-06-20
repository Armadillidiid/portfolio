import { defineHead, defineHandler } from "void";
import { getAllPosts } from "@/lib/posts";
import { SITE, absoluteUrl } from "@/lib/site";

export const loader = defineHandler(() => ({
  posts: getAllPosts(),
}));

export const head = defineHead(() => ({
  title: `Blog — ${SITE.name}`,
  meta: [
    {
      name: "description",
      content: `Posts on TypeScript, React, and the web by ${SITE.author.name}.`,
    },
    { property: "og:title", content: `Blog — ${SITE.name}` },
    { property: "og:description", content: "Posts on TypeScript, React, and the web." },
    { property: "og:image", content: SITE.defaultOgImage },
    { property: "og:url", content: absoluteUrl("/blog") },
  ],
  link: [{ rel: "canonical", href: absoluteUrl("/blog") }],
}));
