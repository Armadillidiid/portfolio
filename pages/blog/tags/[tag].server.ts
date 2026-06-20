import { defineHead, defineHandler } from "void";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { SITE, absoluteUrl } from "@/lib/site";

export const loader = defineHandler((c) => {
  const tag = c.req.param("tag") ?? "";
  const posts = getPostsByTag(tag);
  if (posts.length === 0) {
    throw c.notFound();
  }
  return { tag, posts };
});

export async function getPrerenderPaths() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export const head = defineHead<{ tag: string }>((_c, { tag }) => {
  const url = absoluteUrl(`/blog/tags/${tag}`);
  return {
    title: `#${tag} — Blog — ${SITE.name}`,
    meta: [
      {
        name: "description",
        content: `Posts tagged #${tag} by ${SITE.author.name}.`,
      },
      { property: "og:title", content: `#${tag} — ${SITE.name}` },
      { property: "og:description", content: `Posts tagged #${tag}.` },
      { property: "og:image", content: SITE.defaultOgImage },
      { property: "og:url", content: url },
    ],
    link: [{ rel: "canonical", href: url }],
  };
});
