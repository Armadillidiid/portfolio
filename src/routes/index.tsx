import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/about/hero-section";

export const Route = createFileRoute("/")({
  component: AboutRoute,
});

function AboutRoute() {
  return <HeroSection />;
}
