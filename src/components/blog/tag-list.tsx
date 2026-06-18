import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getAllTags } from "@/lib/posts";

export function TagList() {
  const tags = getAllTags();

  if (tags.length === 0) {
    return <p className="text-muted-foreground text-sm">No tags yet.</p>;
  }

  return (
    <ul className="border border-border bg-card divide-y divide-border">
      {tags.map(({ tag, count }) => (
        <li key={tag}>
          <Link
            to="/blog/tags/$tag"
            params={{ tag }}
            className="group flex items-center justify-between gap-4 p-4 md:p-5 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="flex items-baseline gap-3 flex-wrap">
              <span className="text-foreground group-hover:text-primary font-bold text-base md:text-lg">
                {tag}
              </span>
              <span className="text-muted-foreground text-xs">
                {count} {count === 1 ? "post" : "posts"}
              </span>
            </span>
            <ArrowRight
              className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
