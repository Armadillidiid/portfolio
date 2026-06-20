import { defineHead, defineHandler } from "void";
import { SITE } from "@/lib/site";

export const loader = defineHandler(() => ({}));

export const head = defineHead(() => ({
  title: `${SITE.name} — ${SITE.description}`,
  meta: [
    { name: "description", content: SITE.description },
    { property: "og:title", content: SITE.name },
    { property: "og:description", content: SITE.description },
    { property: "og:image", content: SITE.defaultOgImage },
    { property: "og:url", content: SITE.url },
  ],
  link: [{ rel: "canonical", href: SITE.url }],
}));
