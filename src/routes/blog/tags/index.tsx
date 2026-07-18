import { createFileRoute } from "@tanstack/react-router";
import { TagList } from "@/components/blog/tag-list";
import { SITE } from "@/lib/site";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/blog/tags/")({
  component: TagsIndexRoute,
  head: () =>
    pageSeo({
      title: "Tags",
      description: `All tags across posts by ${SITE.author.name}.`,
      url: "/blog/tags/",
    }),
});

function TagsIndexRoute() {
  return (
    <div className="space-y-12">
      <header>
        <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">TAGS</p>
        <h1 className="text-3xl md:text-5xl font-bold leading-none mb-6">
          Tags
          <span
            aria-hidden="true"
            className="cursor-blink bg-primary w-2 h-8 md:h-10 inline-block align-middle ml-2"
          />
        </h1>
        <p className="text-muted-foreground text-sm">
          All tags across published posts. Click a tag to filter.
        </p>
      </header>
      <TagList />
    </div>
  );
}
