import { createFileRoute } from "@tanstack/react-router";
import { BlogEmptyState } from "@/components/blog/empty-state";

export const Route = createFileRoute("/blog")({
  component: BlogRoute,
});

function BlogRoute() {
  return <BlogEmptyState />;
}
