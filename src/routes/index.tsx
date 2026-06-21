import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/about/hero-section";
import { homeSeo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => homeSeo(),
  component: AboutRoute,
});

function AboutRoute() {
  return <HeroSection />;
}
