import deepmerge from "deepmerge";
import { SITE, absoluteUrl } from "./site";

type SeoType = "website" | "article";

type SeoConfig = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: SeoType;
  publishedTime?: string;
};

const DEFAULT_IMAGE = SITE.defaultOgImage;
const TWITTER_HANDLE = "@EIsenah";

type LinkTag = { rel: string; type?: string; title?: string; href: string };
type ScriptTag = { type: string; children: string };
type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

type SeoHead = {
  title: string;
  meta: MetaTag[];
  links: LinkTag[];
  scripts: ScriptTag[];
};

function abs(url: string): string {
  return url.startsWith("http://") || url.startsWith("https://") ? url : absoluteUrl(url);
}

// Site-wide meta. Lives in __root.tsx only. Not duplicated per page.
function siteMeta(): SeoHead {
  return {
    title: SITE.name,
    meta: [
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: SITE.locale },
      { name: "twitter:site", content: TWITTER_HANDLE },
      { name: "twitter:creator", content: TWITTER_HANDLE },
    ],
    links: [
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: `${SITE.name} — RSS`,
        href: absoluteUrl("/rss.xml"),
      },
    ],
    scripts: [blogJsonLdScript()],
  };
}

// Per-page meta. Lives in each leaf route. Includes canonical (no duplicates).
function pageMeta(config: SeoConfig): SeoHead {
  const title = config.title ?? SITE.name;
  const description = config.description ?? SITE.description;
  const url = config.url ? abs(config.url) : SITE.url;
  const image = config.image ? abs(config.image) : DEFAULT_IMAGE;
  const type: SeoType = config.type ?? "website";

  return {
    title,
    meta: [
      { title: title },
      { name: "title", content: title },
      { name: "description", content: description },
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: title },
      { property: "og:image:type", content: "image/png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:url", content: url },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: title },
      ...(config.publishedTime
        ? [{ property: "article:published_time", content: config.publishedTime }]
        : []),
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [],
  };
}

export function defaultSeo() {
  return siteMeta();
}

export function homeSeo() {
  return deepmerge(siteMeta(), pageMeta({}));
}

export function pageSeo(config: SeoConfig) {
  return deepmerge(siteMeta(), pageMeta(config));
}

export function postSeo(
  post:
    | {
        title: string;
        body: string;
        date: string;
        url: string;
        cover?: { src: string };
      }
    | undefined,
) {
  if (!post) return defaultSeo();
  return deepmerge.all([
    siteMeta(),
    pageMeta({
      title: post.title,
      description: extractDescription(post.body),
      url: post.url,
      type: "article",
      publishedTime: post.date,
      image: post.cover?.src ?? DEFAULT_IMAGE,
    }),
    { scripts: [blogPostingJsonLdScript(post)] },
  ]);
}

export function extractDescription(body: string): string {
  const stripped = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > 160 ? `${stripped.slice(0, 156).trimEnd()}...` : stripped;
}

function blogJsonLdScript() {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": SITE.url,
      mainEntityOfPage: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: {
        "@type": "Person",
        "@id": SITE.url,
        name: SITE.name,
        image: {
          "@type": "ImageObject",
          url: absoluteUrl("/pfp.webp"),
        },
      },
    }),
  };
}

function blogPostingJsonLdScript(post: {
  title: string;
  body: string;
  date: string;
  url: string;
  cover?: { src: string };
}) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: extractDescription(post.body),
      datePublished: post.date,
      author: { "@type": "Person", name: SITE.author.name, url: SITE.url },
      url: absoluteUrl(post.url),
      image: post.cover?.src ? abs(post.cover.src) : DEFAULT_IMAGE,
      publisher: {
        "@type": "Person",
        name: SITE.name,
        url: SITE.url,
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(post.url) },
    }),
  };
}
