import { defineHead } from "void";
import pages from "@void/md/pages";
import { SITE, absoluteUrl } from "@/lib/site";

const SLUG = "whats-new-in-typescript-54-beta";

const thisPage = pages.find((p) => p.path === `/blog/${SLUG}`);

const fm = (thisPage?.frontmatter ?? {}) as {
  title?: string;
  date?: string;
  description?: string;
  cover?: string | null;
};

const title = fm.title ?? "Post";
const date = fm.date ?? "";
const description = fm.description ?? SITE.description;
const coverUrl = fm.cover
  ? absoluteUrl(`/blog/${SLUG}/${fm.cover.replace(/^\.\//, "")}`)
  : SITE.defaultOgImage;
const url = absoluteUrl(`/blog/${SLUG}`);

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
    ...(date ? [{ property: "article:published_time", content: date }] : []),
  ],
  link: [{ rel: "canonical", href: url }],
}));
