import { HeadContent, Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SITE } from "@/lib/site";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { name: "description", content: SITE.description },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { property: "og:title", content: SITE.name },
      { property: "og:description", content: SITE.description },
      { property: "og:image", content: SITE.defaultOgImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE.url }],
  }),
  component: RootLayout,
});

function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID as string | undefined;
    if (!gtmId) return;
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event: "page_view", page_path: pathname });
  }, [pathname]);

  return (
    <div className="flex min-h-svh flex-col">
      <HeadContent />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-background focus:text-foreground focus:px-3 focus:py-2 focus:border focus:border-primary"
      >
        Skip to main content
      </a>
      <Header pathname={pathname} />
      <main id="main" className="flex-1 py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
