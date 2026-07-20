import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeMode } from "@/components/theme-provider";

function giscusTheme(mode: "dark" | "light"): string {
  return mode === "dark" ? "dark_dimmed" : "light";
}

export function CommentSection() {
  const { mode } = useThemeMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const repoId = import.meta.env.VITE_GISCUS_REPO_ID;
  const categoryId = import.meta.env.VITE_GISCUS_CATEGORY_ID;

  if (!repoId || !categoryId) return null;

  if (!mounted) {
    return (
      <section aria-label="Comments loading" className="border-t border-border pt-8 mt-16">
        <h2 className="text-xl font-bold text-foreground mb-6">Comments</h2>
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-1/4" />
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Comments" className="border-t border-border pt-8 mt-16">
      <h2 className="text-xl font-bold text-foreground mb-6">Comments</h2>
      <Giscus
        repo="Armadillidiid/blog-comments"
        repoId={repoId}
        category="Announcements"
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={giscusTheme(mode)}
        lang="en"
      />
    </section>
  );
}
