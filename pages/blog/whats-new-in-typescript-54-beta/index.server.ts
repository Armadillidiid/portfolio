import { defineHead } from "void";
import { SITE, absoluteUrl } from "@/lib/site";

const SLUG = "whats-new-in-typescript-54-beta";
const coverUrl = absoluteUrl(`/blog/${SLUG}/cover.png`);
const url = absoluteUrl(`/blog/${SLUG}`);
const title = "What's New in TypeScript 5.4 Beta";
const date = "2024-02-08T08:24:47.000Z";
const description =
  "Object.groupBy, Map.groupBy, and the NoInfer<T> utility type land in the TypeScript 5.4 Beta.";

export const head = defineHead(() => ({
  title: `${title} — ${SITE.name}`,
  meta: [
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:image", content: coverUrl },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: coverUrl },
    { property: "article:published_time", content: date },
  ],
  link: [{ rel: "canonical", href: url }],
}));
