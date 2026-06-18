import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/about/hero-section";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.description}` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: SITE.name },
      { property: "og:description", content: SITE.description },
      { property: "og:image", content: SITE.defaultOgImage },
      { property: "og:url", content: SITE.url },
    ],
    links: [{ rel: "canonical", href: SITE.url }],
  }),
  component: AboutRoute,
});

function AboutRoute() {
  return <HeroSection />;
}
